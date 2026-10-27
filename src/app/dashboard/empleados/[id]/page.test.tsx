import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EmpleadoDetallePage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams = { id: "101" };
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useParams: () => mockParams,
  useSearchParams: () => mockSearchParams,
}));

jest.mock("../actions", () => ({
  obtenerEmpleadoDetalle: jest.fn(),
  modificarEmpleado: jest.fn(),
}));

const mockDetalle = {
  id: "101",
  idEntidadTipo: 201,
  dni: "31222333",
  cuitCuil: "20312223334",
  nombre: "Carlos",
  apellido: "López",
  sexo: "Masculino",
  estado: "Activo" as const,
  fechaNacimiento: "1988-04-12",
  ciudad: "Rosario",
  calle: "Pellegrini",
  altura: "1240",
  observaciones: "Empleado contable",
  telefonos: ["3414998877"],
  emails: ["carlos@example.com"],
};

const mockInactivoDetalle = {
  ...mockDetalle,
  id: "102",
  dni: "32444555",
  nombre: "Mariana",
  apellido: "Ríos",
  sexo: "Femenino",
  estado: "Inactivo" as const,
};

describe("EmpleadoDetallePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "101" };
    mockSearchParams = new URLSearchParams();
  });

  it("renderiza correctamente los datos del empleado", async () => {
    (actions.obtenerEmpleadoDetalle as jest.Mock).mockResolvedValue(mockDetalle);

    render(<EmpleadoDetallePage />);

    expect(screen.getByText("Detalle del Empleado")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("López, Carlos")).toBeInTheDocument();
      expect(screen.getByText("DNI 31222333")).toBeInTheDocument();
      expect(screen.getByText("Rosario")).toBeInTheDocument();
      expect(screen.getByText("Pellegrini")).toBeInTheDocument();
      expect(screen.getByText("3414998877")).toBeInTheDocument();
      expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
    });
  });

  it("renderiza etiqueta inactiva con clases de fondo destructivo y texto blanco", async () => {
    (actions.obtenerEmpleadoDetalle as jest.Mock).mockResolvedValue(mockInactivoDetalle);

    render(<EmpleadoDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Ríos, Mariana")).toBeInTheDocument();
    });

    const inactivoChip = screen.getByText("Inactivo");
    expect(inactivoChip).toBeInTheDocument();
    expect(inactivoChip.className).toContain("bg-destructive");
    expect(inactivoChip.className).toContain("text-white font-medium");
  });

  it("permite entrar en modo edición, modificar datos y guardar cambios", async () => {
    (actions.obtenerEmpleadoDetalle as jest.Mock).mockResolvedValue(mockDetalle);
    (actions.modificarEmpleado as jest.Mock).mockResolvedValue({ success: true });

    render(<EmpleadoDetallePage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    expect(screen.getByText("Editar Empleado")).toBeInTheDocument();
    const nombreInput = screen.getByLabelText(/Nombre/i);
    expect(nombreInput).toHaveValue("Carlos");

    fireEvent.change(nombreInput, { target: { value: "Carlos Alberto" } });

    const guardarBtn = screen.getByRole("button", { name: /Guardar cambios/i });
    fireEvent.click(guardarBtn);

    await waitFor(() => {
      expect(actions.modificarEmpleado).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Detalle del Empleado")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de no encontrado si el empleado no existe", async () => {
    (actions.obtenerEmpleadoDetalle as jest.Mock).mockResolvedValue(null);

    render(<EmpleadoDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Empleado no encontrado")).toBeInTheDocument();
      expect(screen.getByText("Volver al listado")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Volver al listado"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
