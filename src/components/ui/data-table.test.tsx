import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type Column } from './data-table';

interface Row {
  id: string;
  nombre: string;
  categoria: string;
  estado: string;
}

const DATA: Row[] = [
  { id: '1', nombre: 'Juan', categoria: 'Admin', estado: 'Activo' },
  { id: '2', nombre: 'María', categoria: 'Socio', estado: 'Baja' },
  { id: '3', nombre: 'Pedro', categoria: 'Socio', estado: 'Activo' },
];

const STORAGE_KEY = 'test-table-state';

function buildColumns(overrides: Partial<Column<Row>>[] = []): Column<Row>[] {
  const base: Column<Row>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      accessor: (r) => r.nombre,
      searchable: true,
    },
    {
      key: 'categoria',
      header: 'Categoría',
      accessor: (r) => r.categoria,
      searchable: true,
      filterable: true,
      filterAccessor: (r) => r.categoria,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => r.estado,
      filterable: true,
      filterAccessor: (r) => r.estado,
    },
  ];
  return base.map((col, i) => ({ ...col, ...overrides[i] }));
}

function renderTable(props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) {
  const onRowClick = props.onRowClick ?? jest.fn();
  const renderActions = props.renderActions ?? ((r: Row) => <button>Acción-{r.id}</button>);
  return render(
    <DataTable<Row>
      storageKey={STORAGE_KEY}
      data={props.data ?? DATA}
      columns={props.columns ?? buildColumns()}
      getRowId={(r) => r.id}
      searchPlaceholder="Buscar"
      onRowClick={onRowClick}
      renderActions={renderActions}
      {...props}
    />
  );
}

describe('DataTable', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('rendering', () => {
    it('renderiza una columna por dato más la columna de Acciones', () => {
      renderTable();
      expect(screen.getByRole('columnheader', { name: /nombre/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /categoría/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /estado/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /acciones/i })).toBeInTheDocument();
    });

    it('renderiza una fila por cada registro', () => {
      renderTable();
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('María')).toBeInTheDocument();
      expect(screen.getByText('Pedro')).toBeInTheDocument();
    });

    it('muestra el mensaje de vacío cuando no hay datos', () => {
      renderTable({ data: [], emptyMessage: 'Sin resultados' });
      expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    });

    it('muestra skeletons mientras carga', () => {
      renderTable({ loading: true });
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renderiza las acciones vía renderActions en cada fila', () => {
      renderTable();
      expect(screen.getByText('Acción-1')).toBeInTheDocument();
      expect(screen.getByText('Acción-2')).toBeInTheDocument();
      expect(screen.getByText('Acción-3')).toBeInTheDocument();
    });
  });

  describe('búsqueda', () => {
    it('filtra por las columnas searchable', async () => {
      const user = userEvent.setup();
      renderTable();

      const input = screen.getByRole('textbox', { name: /buscar/i });
      await user.type(input, 'Mar');

      expect(screen.getByText('María')).toBeInTheDocument();
      expect(screen.queryByText('Juan')).not.toBeInTheDocument();
      expect(screen.queryByText('Pedro')).not.toBeInTheDocument();
    });

    it('no filtra por columnas que no son searchable', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByRole('textbox', { name: /buscar/i }), 'Admin');
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.queryByText('María')).not.toBeInTheDocument();
    });
  });

  describe('filtros por columna', () => {
    async function openFilters() {
      const user = userEvent.setup();
      const trigger = await screen.findByRole('button', { name: /filtros/i });
      await user.click(trigger);
      return user;
    }

    it('al abrir el panel muestra un combobox por cada columna filterable visible', async () => {
      renderTable();
      await openFilters();
      const combos = screen.getAllByRole('combobox', { hidden: true });
      expect(combos).toHaveLength(2);
    });

    it('el filtro del componente de Select filtra los datos', async () => {
      renderTable();
      const user = await openFilters();
      const combos = screen.getAllByRole('combobox', { hidden: true });
      await user.click(combos[1]);
      const listbox = await screen.findByRole('listbox');
      await user.click(within(listbox).getByRole('option', { name: 'Activo' }));

      await waitFor(() => {
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText('Pedro')).toBeInTheDocument();
        expect(screen.queryByText('María')).not.toBeInTheDocument();
      });
    });
  });

  describe('ocultar columnas', () => {
    async function toggleColumn(name: RegExp) {
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));
      await user.click(await screen.findByRole('menuitemcheckbox', { name }));
    }

    it('oculta la columna del header y de las celdas', async () => {
      renderTable();
      expect(screen.getByRole('columnheader', { name: /nombre/i })).toBeInTheDocument();

      await toggleColumn(/nombre/i);

      expect(screen.queryByRole('columnheader', { name: /nombre/i })).not.toBeInTheDocument();
    });

    it('al ocultar una columna filterable desaparece su select del panel', async () => {
      renderTable();
      await toggleColumn(/estado/i);

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /filtros/i }));
      const combos = screen.getAllByRole('combobox', { hidden: true });
      expect(combos).toHaveLength(1);
    });
  });

  describe('click en fila', () => {
    it('llama a onRowClick al hacer clic en una fila', () => {
      const onRowClick = jest.fn();
      renderTable({ onRowClick });

      fireEvent.click(screen.getByText('María'));
      expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
    });

    it('no llama a onRowClick al hacer clic en acciones (stopPropagation)', () => {
      const onRowClick = jest.fn();
      renderTable({ onRowClick });

      fireEvent.click(screen.getByText('Acción-2'));
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe('persistencia', () => {
    it('persiste la visibilidad de columnas en localStorage', async () => {
      renderTable();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));
      await user.click(await screen.findByRole('menuitemcheckbox', { name: /estado/i }));

      await waitFor(() => {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw!);
        expect(parsed.visibility.estado).toBe(false);
      });
    });

    it('recupera la visibilidad guardada sin romper (no lanza durante la hidratación)', async () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ visibility: { nombre: true, categoria: true, estado: false }, filters: {} })
      );

      renderTable();
      await waitFor(() => {
        expect(screen.queryByRole('columnheader', { name: /estado/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('contador de resultados', () => {
    it('muestra cuántos registros coinciden', () => {
      renderTable();
      expect(screen.getByText(/3 registros encontrados/i)).toBeInTheDocument();
    });

    it('usa singular cuando hay un solo registro', async () => {
      const user = userEvent.setup();
      renderTable();
      await user.type(screen.getByRole('textbox', { name: /buscar/i }), 'Mar');
      expect(screen.getByText(/1 registro encontrado/i)).toBeInTheDocument();
    });
  });
});
