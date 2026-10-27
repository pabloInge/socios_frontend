import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NuevoEmpleadoPage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../actions", () => ({
  crearEmpleado: jest.fn(),
  buscarEmpleadoPorDocumento: jest.fn(),
}));

describe("NuevoEmpleadoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar el campo de búsqueda inicial de DNI", () => {
    render(<NuevoEmpleadoPage />);

    expect(screen.getByText("Nuevo empleado")).toBeInTheDocument();
    expect(screen.getByLabelText(/DNI \(7 u 8 dígitos\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancelar")).toBeInTheDocument();
  });

  it("debe validar formato de DNI al buscar", async () => {
    render(<NuevoEmpleadoPage />);

    const searchBtn = screen.getByLabelText("Buscar");
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/El DNI es obligatorio/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/DNI \(7 u 8 dígitos\)/i), {
      target: { value: "123" },
    });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/El DNI debe tener 7 u 8 dígitos/i)).toBeInTheDocument();
    });
  });

  it("debe autocompletar datos si la entidad existe y permitir enviar el formulario", async () => {
    (actions.buscarEmpleadoPorDocumento as jest.Mock).mockResolvedValue({
      dni: "31222333",
      nombre: "Carlos",
      apellido: "López",
      sexo: "Masculino",
      ciudad: "Rosario",
      calle: "Pellegrini",
      altura: "1240",
      fechaNacimiento: "1988-04-12",
      observaciones: "Empleado",
      telefonos: ["3414998877"],
      correos: ["carlos@example.com"],
    });
    (actions.crearEmpleado as jest.Mock).mockResolvedValue({ success: true, idEmpleado: 101 });

    render(<NuevoEmpleadoPage />);

    fireEvent.change(screen.getByLabelText(/DNI \(7 u 8 dígitos\)/i), {
      target: { value: "31222333" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre/i)).toHaveValue("Carlos");
      expect(screen.getByLabelText(/Apellido/i)).toHaveValue("López");
      expect(screen.getByLabelText(/Calle/i)).toHaveValue("Pellegrini");
      expect(screen.getByLabelText(/Altura/i)).toHaveValue("1240");
    });

    // Guardar
    const submitBtn = screen.getByRole("button", { name: /Guardar empleado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearEmpleado).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard/empleados");
    });
  });

  it("debe permitir ingresar datos manualmente para nuevo empleado y agregar teléfono", async () => {
    (actions.buscarEmpleadoPorDocumento as jest.Mock).mockResolvedValue(null);
    (actions.crearEmpleado as jest.Mock).mockResolvedValue({ success: true, idEmpleado: 102 });

    render(<NuevoEmpleadoPage />);

    fireEvent.change(screen.getByLabelText(/DNI \(7 u 8 dígitos\)/i), {
      target: { value: "35444555" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Laura" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/i), {
      target: { value: "Benítez" },
    });
    fireEvent.change(screen.getByLabelText(/Calle/i), {
      target: { value: "San Lorenzo" },
    });
    fireEvent.change(screen.getByLabelText(/Altura/i), {
      target: { value: "920" },
    });

    // Seleccionar ciudad
    const selectCiudadBtn = screen.getByRole("button", { name: /Seleccionar/i });
    fireEvent.click(selectCiudadBtn);
    const elegirBtns = screen.getAllByRole("button", { name: /Elegir/i });
    if (elegirBtns.length > 0 && elegirBtns[0]) {
      fireEvent.click(elegirBtns[0]);
    }

    // Agregar teléfono
    const telInput = screen.getByLabelText("Teléfono");
    fireEvent.change(telInput, { target: { value: "3415998877" } });
    const agregarTelBtn = screen.getAllByRole("button", { name: /Agregar/i })[0];
    if (agregarTelBtn) {
      fireEvent.click(agregarTelBtn);
    }

    // Guardar
    const submitBtn = screen.getByRole("button", { name: /Guardar empleado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearEmpleado).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard/empleados");
    });
  });

  it("permite hacer click en 'Buscar otro' para reiniciar la búsqueda", async () => {
    (actions.buscarEmpleadoPorDocumento as jest.Mock).mockResolvedValue(null);

    render(<NuevoEmpleadoPage />);

    fireEvent.change(screen.getByLabelText(/DNI \(7 u 8 dígitos\)/i), {
      target: { value: "35444555" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Buscar otro/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Buscar otro/i }));

    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
  });
});
