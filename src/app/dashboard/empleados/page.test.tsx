import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EmpleadosPage from "./page";
import * as actions from "./actions";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./actions", () => ({
  obtenerEmpleados: jest.fn(),
  darDeBajaEmpleado: jest.fn(),
}));

const mockEmpleadosData = [
  {
    id: "101",
    idEntidadTipo: 201,
    dni: "31222333",
    nombre: "Carlos",
    apellido: "López",
    sexo: "Masculino",
    estado: "Activo" as const,
    telefonos: ["3414998877"],
    emails: ["carlos@example.com"],
  },
  {
    id: "102",
    idEntidadTipo: 202,
    dni: "32444555",
    nombre: "Mariana",
    apellido: "Ríos",
    sexo: "Femenino",
    estado: "Inactivo" as const,
    telefonos: ["3415123456"],
    emails: ["mariana@example.com"],
  },
];

describe("EmpleadosPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza métricas y tabla de empleados", async () => {
    (actions.obtenerEmpleados as jest.Mock).mockResolvedValue(mockEmpleadosData);

    render(<EmpleadosPage />);

    expect(screen.getByText("Listado de Empleados")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total Empleados")).toBeInTheDocument();
      expect(screen.getByText("31222333")).toBeInTheDocument();
      expect(screen.getByText("López, Carlos")).toBeInTheDocument();
      expect(screen.getByText("32444555")).toBeInTheDocument();
      expect(screen.getByText("Ríos, Mariana")).toBeInTheDocument();
    });
  });

  it("renderiza etiqueta inactiva con clases de fondo destructivo y texto blanco", async () => {
    (actions.obtenerEmpleados as jest.Mock).mockResolvedValue(mockEmpleadosData);

    render(<EmpleadosPage />);

    await waitFor(() => {
      const inactivoBadge = screen.getByText("Inactivo");
      expect(inactivoBadge).toHaveClass("bg-destructive text-white font-medium");
    });
  });

  it("permite dar de baja con motivo a un empleado activo", async () => {
    (actions.obtenerEmpleados as jest.Mock).mockResolvedValue(mockEmpleadosData);
    (actions.darDeBajaEmpleado as jest.Mock).mockResolvedValue({ success: true });

    render(<EmpleadosPage />);

    await waitFor(() => {
      expect(screen.getByText("31222333")).toBeInTheDocument();
    });

    const bajaButtons = screen.getAllByTitle("Dar de baja");
    expect(bajaButtons.length).toBeGreaterThan(0);
    fireEvent.click(bajaButtons[0]!);

    await waitFor(() => {
      expect(screen.getByText("Dar de baja empleado")).toBeInTheDocument();
    });

    const inputMotivo = screen.getByPlaceholderText(/Renuncia voluntaria/i);
    fireEvent.change(inputMotivo, { target: { value: "Fin de contrato temporal" } });

    const confirmBtn = screen.getByRole("button", { name: /Confirmar baja/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.darDeBajaEmpleado).toHaveBeenCalledWith(201, "Fin de contrato temporal");
    });
  });
});
