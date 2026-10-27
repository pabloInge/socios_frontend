import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CrearNichoDialog } from "./crear-nicho-dialog";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  crearNicho: jest.fn(),
}));

describe("CrearNichoDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza campos correctamente al estar abierto", () => {
    render(
      <CrearNichoDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("Nuevo Nicho")).toBeInTheDocument();
    expect(screen.getByLabelText("Sector")).toBeInTheDocument();
    expect(screen.getByLabelText("Número de Nicho")).toBeInTheDocument();
  });

  it("crea nicho exitosamente al enviar el formulario", async () => {
    (actions.crearNicho as jest.Mock).mockResolvedValue({
      success: true,
      idNicho: 10,
    });

    render(
      <CrearNichoDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText("Sector"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Número de Nicho"), {
      target: { value: "105" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear Nicho/i }));

    await waitFor(() => {
      expect(actions.crearNicho).toHaveBeenCalledWith({
        sector: "A",
        nroNicho: "105",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("muestra mensaje de error si la acción falla", async () => {
    (actions.crearNicho as jest.Mock).mockResolvedValue({
      success: false,
      mensaje: "Ya existe un nicho con ese sector y número",
    });

    render(
      <CrearNichoDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText("Sector"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Número de Nicho"), {
      target: { value: "105" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear Nicho/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Ya existe un nicho con ese sector y número")
      ).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
