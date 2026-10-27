import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AsignarNichoDialog } from "./asignar-nicho-dialog";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  buscarSociosAsignablesNicho: jest.fn(),
  asignarNicho: jest.fn(),
}));

const mockNicho = {
  id: "2",
  nroNicho: "46",
  sector: "A",
  ocupado: false,
  conLapida: false,
  valorNicho: 50000,
  valorLapida: 0,
  cuotas: 12,
  interes: 0.05,
  socio: null,
};

const mockSocios = [
  {
    idSocio: 1,
    idEntidad: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
  },
];

describe("AsignarNichoDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (actions.buscarSociosAsignablesNicho as jest.Mock).mockResolvedValue(mockSocios);
  });

  it("renderiza y lista socios elegibles", async () => {
    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Asignar Nicho #46/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
      expect(screen.getByText("DNI: 12345678")).toBeInTheDocument();
    });
  });

  it("asigna nicho exitosamente al seleccionar socio y enviar formulario", async () => {
    (actions.asignarNicho as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Asignado",
    });

    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
    });

    // Seleccionar socio
    fireEvent.click(screen.getByText("Pérez, Juan"));

    await waitFor(() => {
      expect(screen.getByText("Cambiar")).toBeInTheDocument();
    });

    // Enviar formulario
    const submitBtn = screen.getByRole("button", { name: /Confirmar Asignación/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.asignarNicho).toHaveBeenCalledWith({
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "NO",
        valorLapida: 0,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("muestra error si se intenta enviar sin seleccionar socio", async () => {
    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Confirmar Asignación/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Debe seleccionar un socio activo titular.")).toBeInTheDocument();
    });
  });
});
