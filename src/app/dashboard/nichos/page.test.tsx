import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NichosPage from "./page";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  obtenerNichos: jest.fn(),
  darDeBajaNicho: jest.fn(),
  crearNicho: jest.fn(),
  asignarNicho: jest.fn(),
  buscarSociosAsignablesNicho: jest.fn(),
}));

const mockNichosData = [
  {
    id: "1",
    nroNicho: "45",
    sector: "A",
    ocupado: true,
    conLapida: true,
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interes: 0.05,
    socio: {
      id: "1",
      nombre: "Luciano",
      apellido: "Oldan",
    },
  },
  {
    id: "2",
    nroNicho: "46",
    sector: "B",
    ocupado: false,
    conLapida: false,
    valorNicho: 50000,
    valorLapida: 0,
    cuotas: 0,
    interes: 0,
    socio: null,
  },
];

describe("NichosPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar y renderizar las métricas y la tabla de nichos", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue(mockNichosData);

    render(<NichosPage />);

    expect(screen.getByText("Gestión de Nichos")).toBeInTheDocument();

    await waitFor(() => {
      // Métricas
      expect(screen.getByText("Total de Nichos")).toBeInTheDocument();
      expect(screen.getByText("Ocupados / Concesionados")).toBeInTheDocument();
      expect(screen.getByText("Disponibles")).toBeInTheDocument();

      // Filas
      expect(screen.getByText("Sector A")).toBeInTheDocument();
      expect(screen.getByText("Sector B")).toBeInTheDocument();
      expect(screen.getByText("#45")).toBeInTheDocument();
      expect(screen.getByText("#46")).toBeInTheDocument();
    });
  });

  it("permite abrir el modal de nuevo nicho", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue(mockNichosData);

    render(<NichosPage />);

    const nuevoBtn = screen.getByRole("button", { name: /Nuevo Nicho/i });
    fireEvent.click(nuevoBtn);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByLabelText("Sector")).toBeInTheDocument();
    });
  });

  it("permite abrir el modal de asignación para nichos disponibles", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue(mockNichosData);
    (actions.buscarSociosAsignablesNicho as jest.Mock).mockResolvedValue([]);

    render(<NichosPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Asignar nicho 46")).toBeInTheDocument();
    });

    const asignarBtn = screen.getByLabelText("Asignar nicho 46");
    fireEvent.click(asignarBtn);

    await waitFor(() => {
      expect(screen.getByText(/Asignar Nicho #46/i)).toBeInTheDocument();
    });
  });

  it("permite abrir la confirmación de eliminación y dar de baja un nicho", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue(mockNichosData);
    (actions.darDeBajaNicho as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Eliminado",
    });

    render(<NichosPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Eliminar nicho 46")).toBeInTheDocument();
    });

    const eliminarBtn = screen.getByLabelText("Eliminar nicho 46");
    fireEvent.click(eliminarBtn);

    await waitFor(() => {
      expect(screen.getByText("Eliminar Nicho")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", { name: /^Eliminar$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.darDeBajaNicho).toHaveBeenCalledWith(2);
    });
  });
});
