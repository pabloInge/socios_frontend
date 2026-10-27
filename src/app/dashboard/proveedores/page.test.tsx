import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProveedoresPage from "./page";
import * as actions from "./actions";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./actions", () => ({
  obtenerProveedores: jest.fn(),
  darDeBajaProveedor: jest.fn(),
  reactivarProveedor: jest.fn(),
}));

const mockProveedoresList = [
  {
    id: "1",
    cuitCuil: "30712345678",
    razonSocial: "Emergencias Médicas S.A.",
    prestacion: "Servicio de ambulancia",
    estado: "Activo" as const,
    telefonos: ["3414201000"],
    emails: ["guardia@emergencias.com"],
  },
  {
    id: "2",
    cuitCuil: "30558889992",
    razonSocial: "Ortopedia Central",
    prestacion: "Insumos ortopédicos",
    estado: "Inactivo" as const,
    telefonos: ["3414930000"],
    emails: ["ventas@ortopedia.com"],
  },
];

describe("ProveedoresPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (actions.obtenerProveedores as jest.Mock).mockResolvedValue(mockProveedoresList);
  });

  it("debe cargar y renderizar la lista de proveedores y el botón flotante FAB", async () => {
    render(<ProveedoresPage />);

    expect(screen.getByText("Listado de Proveedores")).toBeInTheDocument();
    expect(screen.getByLabelText("Nuevo proveedor")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Emergencias Médicas S.A.")).toBeInTheDocument();
      expect(screen.getByText("Ortopedia Central")).toBeInTheDocument();
      expect(screen.getByText("30712345678")).toBeInTheDocument();
    });
  });

  it("debe navegar a editar al hacer click en el botón de editar", async () => {
    render(<ProveedoresPage />);

    await waitFor(() => {
      expect(screen.getByText("Emergencias Médicas S.A.")).toBeInTheDocument();
    });

    const editBtns = screen.getAllByLabelText("Editar");
    fireEvent.click(editBtns[0]!);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/proveedores/nuevo?edit=1");
  });

  it("debe abrir diálogo y dar de baja al proveedor activo", async () => {
    (actions.darDeBajaProveedor as jest.Mock).mockResolvedValue(true);
    render(<ProveedoresPage />);

    await waitFor(() => {
      expect(screen.getByText("Emergencias Médicas S.A.")).toBeInTheDocument();
    });

    const bajaBtn = screen.getByLabelText("Dar de baja");
    fireEvent.click(bajaBtn);

    expect(screen.getByText("¿Dar de baja proveedor?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Dar de baja" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.darDeBajaProveedor).toHaveBeenCalledWith("1");
    });
  });

  it("debe abrir diálogo y reactivar al proveedor inactivo", async () => {
    (actions.reactivarProveedor as jest.Mock).mockResolvedValue(true);
    render(<ProveedoresPage />);

    await waitFor(() => {
      expect(screen.getByText("Ortopedia Central")).toBeInTheDocument();
    });

    const reactivarBtn = screen.getByLabelText("Reactivar");
    fireEvent.click(reactivarBtn);

    expect(screen.getByText("¿Reactivar proveedor?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Reactivar" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(actions.reactivarProveedor).toHaveBeenCalledWith("2");
    });
  });
});
