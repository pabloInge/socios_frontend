import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NuevoColaboradorPage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../actions", () => ({
  crearColaborador: jest.fn(),
  buscarColaboradorPorDocumento: jest.fn(),
}));

describe("NuevoColaboradorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar el campo de búsqueda inicial de documento", () => {
    render(<NuevoColaboradorPage />);

    expect(screen.getByText("Nuevo colaborador")).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancelar")).toBeInTheDocument();
  });

  it("debe validar formato de documento al buscar", async () => {
    render(<NuevoColaboradorPage />);

    const searchBtn = screen.getByLabelText("Buscar");
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/El documento es obligatorio/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Número de documento/i), {
      target: { value: "123" },
    });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/El documento debe tener entre 7 y 11 dígitos/i)).toBeInTheDocument();
    });
  });

  it("debe autocompletar datos si la entidad existe y permitir enviar el formulario", async () => {
    (actions.buscarColaboradorPorDocumento as jest.Mock).mockResolvedValue({
      documento: "28111222",
      tipoDocumento: "DNI",
      nombre: "Esteban",
      apellido: "Quito",
      razonSocial: "",
      ciudad: "Rosario",
      calle: "San Martín",
      altura: "500",
      fechaNacimiento: "1980-05-10",
      prestacion: "Atención Médica",
      telefonos: ["3414112233"],
      correos: ["esteban@example.com"],
    });
    (actions.crearColaborador as jest.Mock).mockResolvedValue({ success: true, idColaborador: 20 });

    render(<NuevoColaboradorPage />);

    fireEvent.change(screen.getByLabelText(/Número de documento/i), {
      target: { value: "28111222" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre/i)).toHaveValue("Esteban");
      expect(screen.getByLabelText(/Apellido/i)).toHaveValue("Quito");
      expect(screen.getByLabelText(/Calle/i)).toHaveValue("San Martín");
      expect(screen.getByLabelText(/Altura/i)).toHaveValue("500");
    });

    // Guardar
    const submitBtn = screen.getByRole("button", { name: /Guardar colaborador/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearColaborador).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard/colaboradores");
    });
  });

  it("debe permitir ingresar datos manualmente para nuevo colaborador y agregar teléfono", async () => {
    (actions.buscarColaboradorPorDocumento as jest.Mock).mockResolvedValue(null);
    (actions.crearColaborador as jest.Mock).mockResolvedValue({ success: true, idColaborador: 21 });

    render(<NuevoColaboradorPage />);

    fireEvent.change(screen.getByLabelText(/Número de documento/i), {
      target: { value: "35444555" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "María" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/i), {
      target: { value: "González" },
    });
    fireEvent.change(screen.getByLabelText(/Calle/i), {
      target: { value: "Mitre" },
    });
    fireEvent.change(screen.getByLabelText(/Altura/i), {
      target: { value: "850" },
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
    fireEvent.change(telInput, { target: { value: "3415112233" } });
    const agregarTelBtn = screen.getAllByRole("button", { name: /Agregar/i })[0];
    if (agregarTelBtn) {
      fireEvent.click(agregarTelBtn);
    }

    // Guardar
    const submitBtn = screen.getByRole("button", { name: /Guardar colaborador/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearColaborador).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard/colaboradores");
    });
  });

  it("permite hacer click en 'Buscar otro' para reiniciar la búsqueda", async () => {
    (actions.buscarColaboradorPorDocumento as jest.Mock).mockResolvedValue(null);

    render(<NuevoColaboradorPage />);

    fireEvent.change(screen.getByLabelText(/Número de documento/i), {
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
