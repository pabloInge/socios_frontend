import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ColaboradorDetallePage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams = { id: "10" };
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useParams: () => mockParams,
  useSearchParams: () => mockSearchParams,
}));

jest.mock("../actions", () => ({
  obtenerColaboradorDetalle: jest.fn(),
  modificarColaborador: jest.fn(),
}));

const mockDetalle = {
  id: "10",
  tipoDocumento: "DNI",
  documento: "28111222",
  nombre: "Esteban",
  apellido: "Quito",
  razonSocial: "",
  prestacion: "Atención Médica",
  estado: "Activo" as const,
  fechaNacimiento: "1985-06-15",
  ciudad: "Rosario",
  calle: "Córdoba",
  altura: "1500",
  observaciones: "Atención por la mañana",
  telefonos: ["3414556677"],
  emails: ["esteban@example.com"],
};

const mockInactivoDetalle = {
  ...mockDetalle,
  id: "11",
  documento: "30708090102",
  tipoDocumento: "CUIT",
  razonSocial: "Farmacia Central S.R.L.",
  estado: "Inactivo" as const,
};

describe("ColaboradorDetallePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "10" };
    mockSearchParams = new URLSearchParams();
  });

  it("renderiza correctamente los datos del colaborador", async () => {
    (actions.obtenerColaboradorDetalle as jest.Mock).mockResolvedValue(mockDetalle);

    render(<ColaboradorDetallePage />);

    expect(screen.getByText("Detalle del Colaborador")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Quito, Esteban")).toBeInTheDocument();
      expect(screen.getByText("DNI 28111222")).toBeInTheDocument();
      expect(screen.getByText("Rosario")).toBeInTheDocument();
      expect(screen.getByText("Córdoba")).toBeInTheDocument();
      expect(screen.getByText("Atención Médica")).toBeInTheDocument();
      expect(screen.getByText("3414556677")).toBeInTheDocument();
      expect(screen.getByText("esteban@example.com")).toBeInTheDocument();
    });
  });

  it("renderiza etiqueta inactiva con clases de fondo destructivo y texto blanco", async () => {
    (actions.obtenerColaboradorDetalle as jest.Mock).mockResolvedValue(mockInactivoDetalle);

    render(<ColaboradorDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Farmacia Central S.R.L.")).toBeInTheDocument();
    });

    const inactivoChip = screen.getByText("Inactivo");
    expect(inactivoChip).toBeInTheDocument();
    expect(inactivoChip.className).toContain("bg-destructive");
    expect(inactivoChip.className).toContain("text-white font-medium");
  });

  it("permite entrar en modo edición, modificar datos y guardar cambios", async () => {
    (actions.obtenerColaboradorDetalle as jest.Mock).mockResolvedValue(mockDetalle);
    (actions.modificarColaborador as jest.Mock).mockResolvedValue({ success: true });

    render(<ColaboradorDetallePage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    expect(screen.getByText("Editar Colaborador")).toBeInTheDocument();
    const nombreInput = screen.getByLabelText(/Nombre/i);
    expect(nombreInput).toHaveValue("Esteban");

    fireEvent.change(nombreInput, { target: { value: "Esteban Carlos" } });

    const guardarBtn = screen.getByRole("button", { name: /Guardar cambios/i });
    fireEvent.click(guardarBtn);

    await waitFor(() => {
      expect(actions.modificarColaborador).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Detalle del Colaborador")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de no encontrado si el colaborador no existe", async () => {
    (actions.obtenerColaboradorDetalle as jest.Mock).mockResolvedValue(null);

    render(<ColaboradorDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Colaborador no encontrado")).toBeInTheDocument();
      expect(screen.getByText("Volver al listado")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Volver al listado"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
