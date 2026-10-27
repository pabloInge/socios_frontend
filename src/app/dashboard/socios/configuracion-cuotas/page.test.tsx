import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ConfiguracionCuotasPage from "./page";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  obtenerConfiguracionCuotas: jest.fn(),
  modificarImporteSocio: jest.fn(),
  modificarSepelioConTope: jest.fn(),
  modificarSepelioSinTope: jest.fn(),
}));

const mockCuotasData = [
  {
    id_TipoCuota: 1,
    concepto: "SOCIO",
    importe: 4500,
    edad: "SIN TOPE",
    plan: "-",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 2,
    concepto: "SEPELIO",
    importe: 10000,
    edad: "HASTA 65",
    plan: "A",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 4,
    concepto: "SEPELIO",
    importe: 12000,
    edad: "MAS DE 65",
    plan: "A",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
];

describe("ConfiguracionCuotasPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar y renderizar las tarjetas de métricas y la tabla de cuotas", async () => {
    (actions.obtenerConfiguracionCuotas as jest.Mock).mockResolvedValue(mockCuotasData);

    render(<ConfiguracionCuotasPage />);

    expect(screen.getByText("Configuración de Cuotas")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total de Tipos de Cuota")).toBeInTheDocument();
      expect(screen.getByText("Planes de Sepelio")).toBeInTheDocument();
      expect(screen.getByText("Cuota Social Vigente")).toBeInTheDocument();

      // Verificar que los conceptos aparecen
      expect(screen.getAllByText("SOCIO").length).toBeGreaterThan(0);
      expect(screen.getAllByText("SEPELIO").length).toBeGreaterThan(0);
      expect(screen.getByText("HASTA 65")).toBeInTheDocument();
      expect(screen.getByText("MAS DE 65")).toBeInTheDocument();
    });
  });

  it("permite abrir el diálogo de edición para cuota de socio y guardar cambios", async () => {
    (actions.obtenerConfiguracionCuotas as jest.Mock).mockResolvedValue(mockCuotasData);
    (actions.modificarImporteSocio as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Actualizado correctamente",
    });

    render(<ConfiguracionCuotasPage />);

    await waitFor(() => {
      expect(screen.getAllByTitle("Editar").length).toBeGreaterThan(0);
    });

    const editBtns = screen.getAllByTitle("Editar");
    fireEvent.click(editBtns[0]!);

    await waitFor(() => {
      expect(screen.getByText("Modificar Cuota")).toBeInTheDocument();
    });

    const importeInput = screen.getByLabelText(/Importe de la Cuota/i);
    expect(importeInput).toHaveValue(4500);

    fireEvent.change(importeInput, { target: { value: "5200" } });
    expect(importeInput).toHaveValue(5200);

    const submitBtn = screen.getByRole("button", { name: /Guardar Cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.modificarImporteSocio).toHaveBeenCalledWith({
        id_TipoCuota: 1,
        importe: 5200,
      });
    });
  });

  it("permite editar sepelio con tope mostrando el campo de tope de edad", async () => {
    (actions.obtenerConfiguracionCuotas as jest.Mock).mockResolvedValue(mockCuotasData);
    (actions.modificarSepelioConTope as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Actualizado correctamente",
    });

    render(<ConfiguracionCuotasPage />);

    await waitFor(() => {
      expect(screen.getAllByTitle("Editar").length).toBe(3);
    });

    // El segundo botón es sepelio con tope (HASTA 65)
    const editBtns = screen.getAllByTitle("Editar");
    fireEvent.click(editBtns[1]!);

    await waitFor(() => {
      expect(screen.getByLabelText(/Tope de Edad/i)).toBeInTheDocument();
    });

    const edadInput = screen.getByLabelText(/Tope de Edad/i);
    expect(edadInput).toHaveValue(65);

    fireEvent.change(edadInput, { target: { value: "70" } });

    const submitBtn = screen.getByRole("button", { name: /Guardar Cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.modificarSepelioConTope).toHaveBeenCalledWith({
        id_TipoCuota: 2,
        importe: 10000,
        edadTope: 70,
      });
    });
  });

  it("muestra mensaje de error si la acción falla", async () => {
    (actions.obtenerConfiguracionCuotas as jest.Mock).mockResolvedValue(mockCuotasData);
    (actions.modificarImporteSocio as jest.Mock).mockResolvedValue({
      success: false,
      mensaje: "No se puede actualizar el importe",
    });

    render(<ConfiguracionCuotasPage />);

    await waitFor(() => {
      expect(screen.getAllByTitle("Editar").length).toBeGreaterThan(0);
    });

    const editBtns = screen.getAllByTitle("Editar");
    fireEvent.click(editBtns[0]!);

    const submitBtn = screen.getByRole("button", { name: /Guardar Cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("No se puede actualizar el importe")).toBeInTheDocument();
    });
  });
});
