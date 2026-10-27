import {
  obtenerColaboradores,
  obtenerColaboradorDetalle,
  crearColaborador,
  modificarColaborador,
  darDeBajaColaborador,
  reactivarColaborador,
  buscarColaboradorPorDocumento,
} from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Colaboradores Server Actions", () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = "stg";
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  describe("obtenerColaboradores", () => {
    it("devuelve array vacío sin token en stg", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerColaboradores();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("consulta /colaboradores/buscar con query param", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_Entidad: 10,
          documento: "28111222",
          nombre: "Esteban",
          apellido: "Quito",
          prestacion: "Atención Médica",
          estado: "Activo",
          telefonos: ["3414556677"],
          emails: [],
        },
      ]);

      const res = await obtenerColaboradores("Esteban");
      expect(fetchAPI).toHaveBeenCalledWith(
        "/colaboradores/buscar?busqueda=Esteban",
        "token123"
      );
      expect(res).toHaveLength(1);
      expect(res[0]?.nombre).toBe("Esteban");
    });
  });

  describe("obtenerColaboradorDetalle", () => {
    it("obtiene detalle de colaborador", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Entidad: 10,
        documento: "28111222",
        nombre: "Esteban",
        apellido: "Quito",
        ciudad: { id_Ciudad: 2, nombre: "Rosario" },
        calle: "Corrientes",
        altura: 450,
        telefonos: ["3414556677"],
        emails: [],
      });

      const res = await obtenerColaboradorDetalle("10");
      expect(fetchAPI).toHaveBeenCalledWith("/colaboradores/10", "token123");
      expect(res?.nombre).toBe("Esteban");
      expect(res?.ciudad).toBe("Rosario");
    });
  });

  describe("crearColaborador", () => {
    it("falla validación con datos inválidos", async () => {
      const res = await crearColaborador({
        tipoDocumento: "DNI",
        documento: "123",
        nombre: "E",
        apellido: "Q",
        prestacion: "Farmacia",
        ciudad: "Rosario",
        calle: "Corrientes",
        altura: "450",
        telefonos: [],
      });
      expect(res.success).toBe(false);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("crea colaborador exitosamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ idColaborador: 5 });

      const res = await crearColaborador({
        tipoDocumento: "DNI",
        documento: "28111222",
        nombre: "Esteban",
        apellido: "Quito",
        prestacion: "Atención Médica",
        ciudad: "Rosario",
        calle: "Corrientes",
        altura: "450",
        telefonos: ["3414556677"],
      });
      expect(res.success).toBe(true);
      expect(res.idColaborador).toBe(5);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/colaboradores/crear",
        "token123",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  describe("darDeBajaColaborador", () => {
    it("falla si el motivo es muy corto", async () => {
      const res = await darDeBajaColaborador(10, "No");
      expect(res.success).toBe(false);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("da de baja con éxito", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Baja confirmada" });

      const res = await darDeBajaColaborador(10, "Cierre de consultorio");
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/colaboradores/baja/10",
        "token123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ motivo: "Cierre de consultorio" }),
        })
      );
    });
  });

  describe("reactivarColaborador", () => {
    it("reactiva colaborador exitosamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Reactivado" });

      const res = await reactivarColaborador(10);
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/colaboradores/reactivar",
        "token123",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ idEntidad: 10 }),
        })
      );
    });
  });

  describe("buscarColaboradorPorDocumento", () => {
    it("consulta /buscarentidad y autocompleta datos", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        nombre: "Esteban",
        apellido: "Quito",
        ciudad: { id_Ciudad: 2, nombre: "Rosario" },
        calle: "Corrientes",
        altura: 450,
      });

      const res = await buscarColaboradorPorDocumento("28111222");
      expect(res?.nombre).toBe("Esteban");
      expect(res?.ciudad).toBe("Rosario");
    });
  });
});
