import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EntidadesPage from "./page";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  buscarEntidades: jest.fn(),
  obtenerEntidadPorDni: jest.fn(),
}));

const mockEntidades = [
  {
    id: "1",
    cuitCuil: "20304050607",
    nombre: "Juan",
    apellido: "Pérez",
    razonSocial: "",
    sexo: "M",
    fechaNacimiento: "1985-05-15",
    tipo: "Física" as const,
  },
  {
    id: "2",
    cuitCuil: "30712345678",
    nombre: "",
    apellido: "",
    razonSocial: "Acme Corporación S.A.",
    sexo: "-",
    fechaNacimiento: "2010-01-01",
    tipo: "Jurídica" as const,
  },
];

const mockDetalle = {
  id: "1",
  cuitCuil: "20304050607",
  nombre: "Juan",
  apellido: "Pérez",
  razonSocial: "",
  sexo: "M",
  fechaNacimiento: "1985-05-15",
  ciudad: "Rosario",
  calle: "Av. Corrientes",
  altura: "1234",
  tipo: "Física" as const,
  observaciones: "Entidad activa",
};

describe("EntidadesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar y renderizar las métricas y la tabla de entidades", async () => {
    (actions.buscarEntidades as jest.Mock).mockResolvedValue(mockEntidades);

    render(<EntidadesPage />);

    expect(screen.getByText("Padrón General de Entidades")).toBeInTheDocument();

    await waitFor(() => {
      // Métricas
      expect(screen.getByText("Total de Entidades")).toBeInTheDocument();
      expect(screen.getByText("Personas Físicas")).toBeInTheDocument();
      expect(screen.getByText("Personas Jurídicas")).toBeInTheDocument();

      // Filas
      expect(screen.getByText("20304050607")).toBeInTheDocument();
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
      expect(screen.getByText("30712345678")).toBeInTheDocument();
      expect(screen.getByText("Acme Corporación S.A.")).toBeInTheDocument();
    });
  });

  it("debe abrir el modal de ficha al hacer click en ver ficha", async () => {
    (actions.buscarEntidades as jest.Mock).mockResolvedValue(mockEntidades);
    (actions.obtenerEntidadPorDni as jest.Mock).mockResolvedValue(mockDetalle);

    render(<EntidadesPage />);

    await waitFor(() => {
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
    });

    const verFichaButtons = screen.getAllByRole("button", { name: /ver ficha/i });
    fireEvent.click(verFichaButtons[0]!);

    await waitFor(() => {
      expect(actions.obtenerEntidadPorDni).toHaveBeenCalledWith("20304050607");
      expect(screen.getByText("Ficha de Entidad")).toBeInTheDocument();
      expect(screen.getByText("Av. Corrientes 1234, Rosario")).toBeInTheDocument();
      expect(screen.getByText("Entidad activa")).toBeInTheDocument();
    });

    // Cerrar modal
    const cerrarBtn = screen.getByRole("button", { name: "Cerrar" });
    fireEvent.click(cerrarBtn);
  });

  it("debe manejar la visualización cuando no hay entidades registradas", async () => {
    (actions.buscarEntidades as jest.Mock).mockResolvedValue([]);

    render(<EntidadesPage />);

    await waitFor(() => {
      expect(screen.getByText("No se encontraron entidades")).toBeInTheDocument();
    });
  });
});
