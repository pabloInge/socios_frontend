import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ConfirmDialog } from "./confirm-dialog"

describe("ConfirmDialog Component", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    title: "¿Estás seguro?",
    description: "Esta acción no se puede deshacer.",
    onConfirm: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar el título, la descripción y los botones por defecto cuando open=true", () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument()
    expect(screen.getByText("Esta acción no se puede deshacer.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument()
  })

  it("no debe mostrar el diálogo si open=false", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />)

    expect(screen.queryByText("¿Estás seguro?")).not.toBeInTheDocument()
  })

  it("debe ejecutar onConfirm al hacer clic en el botón de confirmación", async () => {
    const onConfirmMock = jest.fn().mockResolvedValue(undefined)
    const onOpenChangeMock = jest.fn()

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirmMock}
        onOpenChange={onOpenChangeMock}
        confirmText="Aceptar"
      />
    )

    const btnConfirm = screen.getByRole("button", { name: "Aceptar" })
    fireEvent.click(btnConfirm)

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
      expect(onOpenChangeMock).toHaveBeenCalledWith(false)
    })
  })

  it("debe ejecutar onCancel y onOpenChange(false) al hacer clic en Cancelar", () => {
    const onCancelMock = jest.fn()
    const onOpenChangeMock = jest.fn()

    render(
      <ConfirmDialog
        {...defaultProps}
        onCancel={onCancelMock}
        onOpenChange={onOpenChangeMock}
        cancelText="Volver"
      />
    )

    const btnCancel = screen.getByRole("button", { name: "Volver" })
    fireEvent.click(btnCancel)

    expect(onCancelMock).toHaveBeenCalledTimes(1)
    expect(onOpenChangeMock).toHaveBeenCalledWith(false)
  })

  it("debe usar los estilos y textos específicos para la variante destructive", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        variant="destructive"
        confirmText="Eliminar"
      />
    )

    const btnEliminar = screen.getByRole("button", { name: "Eliminar" })
    expect(btnEliminar).toBeInTheDocument()
    expect(btnEliminar).toHaveAttribute("data-variant", "destructive")
  })

  it("debe deshabilitar botones cuando loading es verdadero", () => {
    render(<ConfirmDialog {...defaultProps} loading={true} />)

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled()
  })
})
