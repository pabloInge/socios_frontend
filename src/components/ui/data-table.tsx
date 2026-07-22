"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Chip } from "@/components/ui/chip"
import {
  FilterToggle,
  FilterToggleTrigger,
  FilterToggleContent,
} from "@/components/ui/filter-toggle"
import { ColumnToggle } from "@/components/ui/column-toggle"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const FILTER_ALL = "Todos"

export interface ColumnFilterOption {
  value: string
  label: string
}

export interface Column<T> {
  key: string
  header: string
  accessor: (row: T) => React.ReactNode
  defaultVisible?: boolean
  searchable?: boolean
  searchAccessor?: (row: T) => string
  filterable?: boolean
  filterOptions?: ColumnFilterOption[]
  filterAccessor?: (row: T) => string
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  storageKey: string
  data: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  searchPlaceholder?: string
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  renderActions?: (row: T) => React.ReactNode
  columnsLabel?: string
  className?: string
}

interface PersistedState {
  visibility: Record<string, boolean>
  filters: Record<string, string>
}

function loadPersistedState(storageKey: string): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    return JSON.parse(raw) as Partial<PersistedState>
  } catch {
    return null
  }
}

function savePersistedState(storageKey: string, state: PersistedState) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
  }
}

function DataTable<T>({
  storageKey,
  data,
  columns,
  getRowId,
  searchPlaceholder = "Buscar...",
  loading = false,
  emptyMessage = "No se encontraron registros",
  onRowClick,
  renderActions,
  columnsLabel = "Columnas",
  className,
}: DataTableProps<T>) {
  const [visibility, setVisibility] = React.useState<Record<string, boolean>>(
    () => {
      const result: Record<string, boolean> = {}
      for (const col of columns) {
        result[col.key] = col.defaultVisible ?? true
      }
      return result
    }
  )

  const [columnFilters, setColumnFilters] = React.useState<
    Record<string, string>
  >(() => {
    const result: Record<string, string> = {}
    for (const col of columns) {
      if (col.filterable) {
        result[col.key] = FILTER_ALL
      }
    }
    return result
  })

  const [search, setSearch] = React.useState("")

  const hydratedRef = React.useRef(false)
  React.useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    const persisted = loadPersistedState(storageKey)
    if (!persisted) return
    setVisibility((prev) => {
      const next: Record<string, boolean> = {}
      for (const col of columns) {
        const stored = persisted.visibility?.[col.key]
        next[col.key] = stored ?? prev[col.key] ?? col.defaultVisible ?? true
      }
      return next
    })
    setColumnFilters((prev) => {
      const next: Record<string, string> = { ...prev }
      for (const col of columns) {
        if (col.filterable) {
          const stored = persisted.filters?.[col.key]
          if (stored) next[col.key] = stored
        }
      }
      return next
    })
  }, [storageKey, columns])

  React.useEffect(() => {
    savePersistedState(storageKey, { visibility, filters: columnFilters })
  }, [storageKey, visibility, columnFilters])

  const derivedFilterOptions = React.useMemo(() => {
    const map: Record<string, ColumnFilterOption[]> = {}
    for (const col of columns) {
      if (!col.filterable || col.filterOptions) continue
      const accessor = col.filterAccessor
      if (!accessor) continue
      const unique = Array.from(
        new Set(
          data
            .map((row) => accessor(row))
            .filter((v) => v !== null && v !== undefined && v !== "")
        )
      ).sort((a, b) => a.localeCompare(b))
      map[col.key] = unique.map((value) => ({ value, label: value }))
    }
    return map
  }, [columns, data])

  const getFilterOptions = React.useCallback(
    (col: Column<T>): ColumnFilterOption[] =>
      col.filterOptions ?? derivedFilterOptions[col.key] ?? [],
    [derivedFilterOptions]
  )

  const visibleColumns = React.useMemo(
    () => columns.filter((col) => visibility[col.key]),
    [columns, visibility]
  )

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((row) => {
      const matchesSearch =
        !q ||
        visibleColumns.some((col) => {
          if (!col.searchable) return false
          const accessor = col.searchAccessor
          const value = accessor
            ? accessor(row)
            : (() => {
                const node = col.accessor(row)
                return typeof node === "string" || typeof node === "number"
                  ? String(node)
                  : ""
              })()
          return value.toLowerCase().includes(q)
        })

      const matchesFilters = visibleColumns.every((col) => {
        if (!col.filterable) return true
        const value = columnFilters[col.key] ?? FILTER_ALL
        if (value === FILTER_ALL) return true
        const accessor = col.filterAccessor
        if (!accessor) return true
        return accessor(row) === value
      })

      return matchesSearch && matchesFilters
    })
  }, [data, search, visibleColumns, columnFilters])

  const activeFilters = React.useMemo(() => {
    const result: { column: Column<T>; value: string }[] = []
    for (const col of columns) {
      if (!col.filterable) continue
      const value = columnFilters[col.key]
      if (value && value !== FILTER_ALL) {
        result.push({ column: col, value })
      }
    }
    return result
  }, [columns, columnFilters])

  const activeFilterCount = activeFilters.length

  const filterableVisibleColumns = React.useMemo(
    () => visibleColumns.filter((col) => col.filterable),
    [visibleColumns]
  )

  const toggleColumn = React.useCallback((key: string) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const setColumnFilter = React.useCallback(
    (key: string, value: string) => {
      setColumnFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const clearAllFilters = React.useCallback(() => {
    setColumnFilters((prev) => {
      const next: Record<string, string> = {}
      for (const k of Object.keys(prev)) next[k] = FILTER_ALL
      return next
    })
  }, [])

  const hasActions = Boolean(renderActions)
  const totalColCount = visibleColumns.length + (hasActions ? 1 : 0)

  return (
    <div className={cn("w-full", className)}>
      <FilterToggle className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              label={searchPlaceholder}
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterToggleTrigger
            activeCount={activeFilterCount}
            onClear={activeFilterCount > 0 ? clearAllFilters : undefined}
          />
        </div>
        <FilterToggleContent>
          {filterableVisibleColumns.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {filterableVisibleColumns.map((col) => (
                <div key={col.key} className="w-48">
                  <Select
                    value={columnFilters[col.key] ?? FILTER_ALL}
                    onValueChange={(v) => setColumnFilter(col.key, v)}
                  >
                    <SelectTrigger label={col.header} variant="outlined">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_ALL}>Todos</SelectItem>
                      {getFilterOptions(col).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant py-2">
              No hay columnas filtrables visibles.
            </p>
          )}
        </FilterToggleContent>
      </FilterToggle>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ column, value }) => (
            <Chip
              key={column.key}
              variant="input"
              onRemove={() => setColumnFilter(column.key, FILTER_ALL)}
            >
              {column.header}: {value}
            </Chip>
          ))}
        </div>
      )}

      <div className="relative rounded-xl border border-outline-variant overflow-hidden">
        <ColumnToggle
          label={columnsLabel}
          compact
          className="absolute right-3 top-2 z-10 bg-surface-container-low/50 hover:bg-foreground/[0.08]"
          items={columns.map((col) => ({
            key: col.key,
            label: col.header,
            visible: visibility[col.key] ?? true,
          }))}
          onToggle={toggleColumn}
        />
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-center">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: totalColCount }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColCount}
                  className="text-center py-8 text-on-surface-variant"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => {
                const rowId = getRowId(row)
                const clickable = Boolean(onRowClick)
                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      "leading-relaxed",
                      clickable && "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                    )}
                    tabIndex={clickable ? 0 : undefined}
                    role={clickable ? "link" : undefined}
                    onClick={
                      clickable
                        ? () => onRowClick?.(row)
                        : undefined
                    }
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              onRowClick?.(row)
                            }
                          }
                        : undefined
                    }
                  >
                    {visibleColumns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.accessor(row)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                        className="text-center"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {renderActions?.(row)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > 0 && !loading && (
        <p className="text-sm text-on-surface-variant mt-3">
          {filteredData.length} registro{filteredData.length !== 1 && "s"}{" "}
          encontrado{filteredData.length !== 1 && "s"}
        </p>
      )}
    </div>
  )
}

export { DataTable }
