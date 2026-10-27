import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ColaboradoresPage from "./page";
import * as actions from "./actions";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./actions", () => ({
  obtenerColaboradores: jest.fn(),
  darDeBajaColaborador: jest.fn(),
  reactivarColaborador: jest.fn(),
}));

const mockColaboradoresData = [
  {
    id: "10",
    tipoDocumento: "DNI",
    documento: "28111222",
    nombre: "Esteban",
    apellido: "Quito",
    prestacion: "Atención Médica",
    estado: "Activo" as const,
    telefonos: ["3414556677"],
    emails: ["esteban@example.com"],
  },
  {
    id: "11",
    tipoDocumento: "CUIT",
    documento: "30708090102",
    nombre: "Farmacia",
    apellido: "Central",
    razonSocial: "Farmacia Central S.R.L.",
    prestacion: "Farmacia",
    estado: "Inactivo" as const,
    telefonos: ["1144556677"],
    emails: [],
  },
];

describe("ColaboradoresPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza métricas y tabla de colaboradores", async () => {
    (actions.obtenerColaboradores as jest.Mock).mockResolvedValue(mockColaboradoresData);

    render(<ColaboradoresPage />);

    expect(screen.getByText("Listado de Colaboradores")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total Colaboradores")).toBeInTheDocument();
      expect(screen.getByText("Quito, Esteban")).toBeInTheDocument();
      expect(screen.getByText("28111222")).toBeInTheDocument();
      expect(screen.getByText("Central, Farmacia")).toBeInTheDocument();
    });
  });

  it("renderiza etiqueta inactiva con clases de fondo destructivo y texto blanco", async () => {
    (actions.obtenerColaboradores as jest.Mock).mockResolvedValue(mockColaboradoresData);

    render(<ColaboradoresPage />);

    await waitFor(() => {
      const inactivoBadge = screen.getByText("Inactivo");
      expect(inactivoBadge).toHaveClass("bg-destructive text-white font-medium");
    });
  });

  it("permite dar de baja con motivo a un colaborador activo", async () => {
    (actions.obtenerColaboradores as jest.Mock).mockResolvedValue(mockColaboradoresData);
    (actions.darDeBajaColaborador as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Dado de baja",
    });

    render(<ColaboradoresPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Dar de baja colaborador Esteban")).toBeInTheDocument();
    });

    const bajaBtn = screen.getByLabelText("Dar de baja colaborador Esteban");
    fireEvent.click(bajaBtn);

    await waitFor(() => {
      expect(screen.getByText("Dar de Baja Colaborador")).toBeInTheDocument();
    });

    const motivoInput = screen.getByLabelText("Motivo de Baja");
    fireEvent.change(motivoInput, { target: { value: "Fin de contrato" } });

    const submitBtn = screen.getByRole("button", { name: /Confirmar Baja/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.darDeBajaColaborador).toHaveBeenCalledWith(10, "Fin de contrato");
    });
  });

  it("permite reactivar a un colaborador inactivo", async () => {
    (actions.obtenerColaboradores as jest.Mock).mockResolvedValue(mockColaboradoresData);
    (actions.reactivarColaborador as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Reactivado",
    });

    render(<ColaboradoresPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Reactivar colaborador Farmacia")).toBeInTheDocument();
    });

    const reactivarBtn = screen.getByLabelText("Reactivar colaborador Farmacia");
    fireEvent.click(reactivarBtn);

    await waitFor(() => {
      expect(screen.getByText("Reactivar Colaborador")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", { name: /^Reactivar$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.reactivarColaborador).toHaveBeenCalledWith(11);
    });
  });
});
