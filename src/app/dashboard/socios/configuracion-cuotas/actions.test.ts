import {
  obtenerConfiguracionCuotas,
  modificarImporteSocio,
  modificarSepelioConTope,
  modificarSepelioSinTope,
} from "./actions";

jest.mock("../../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Configuración de Cuotas Server Actions", () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = "stg";
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  describe("obtenerConfiguracionCuotas", () => {
    it("sin token en stg devuelve array vacío", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerConfiguracionCuotas();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("en develop (mock mode) sin cookie permite consultar mocks con token mock", async () => {
      process.env.ENV = "develop";
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      (fetchAPI as jest.Mock).mockResolvedValue([]);

      await obtenerConfiguracionCuotas();
      expect(fetchAPI).toHaveBeenCalledWith("/configuracion-cuotas", "mock-token");
    });

    it("con token y filtro de concepto consulta endpoint con query string", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token123" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_TipoCuota: 1,
          concepto: "SOCIO",
          importe: 4500,
          edad: "SIN TOPE",
          plan: "-",
          ultimaModificacion: "2026-03-10T00:00:00",
        },
      ]);

      const res = await obtenerConfiguracionCuotas("SOCIO");
      expect(fetchAPI).toHaveBeenCalledWith(
        "/configuracion-cuotas?Concepto=SOCIO",
        "token123"
      );
      expect(res).toHaveLength(1);
      expect(res[0]?.concepto).toBe("SOCIO");
    });

    it("retorna array vacío ante error en fetchAPI", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("Network error"));

      const res = await obtenerConfiguracionCuotas();
      expect(res).toEqual([]);
    });
  });

  describe("modificarImporteSocio", () => {
    it("falla validación con importe negativo", async () => {
      const res = await modificarImporteSocio({ id_TipoCuota: 1, importe: -100 });
      expect(res.success).toBe(false);
      expect(res.mensaje).toContain("El importe no puede ser negativo");
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("modifica importe de socio exitosamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "El importe de la cuota de socio fue modificado correctamente.",
      });

      const res = await modificarImporteSocio({ id_TipoCuota: 1, importe: 5000 });
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/configuracion-cuotas/modificar-socio",
        "token123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ id_TipoCuota: 1, importe: 5000 }),
        })
      );
    });

    it("maneja error devuelto por la API", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("Tipo de cuota no encontrado"));

      const res = await modificarImporteSocio({ id_TipoCuota: 99, importe: 5000 });
      expect(res.success).toBe(false);
      expect(res.mensaje).toBe("Tipo de cuota no encontrado");
    });
  });

  describe("modificarSepelioConTope", () => {
    it("falla validación con edadTope <= 0", async () => {
      const res = await modificarSepelioConTope({
        id_TipoCuota: 2,
        importe: 10000,
        edadTope: 0,
      });
      expect(res.success).toBe(false);
      expect(res.mensaje).toContain("El tope de edad debe ser mayor a cero");
    });

    it("modifica sepelio con tope exitosamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "La cuota de sepelio (con tope) fue modificada correctamente.",
      });

      const res = await modificarSepelioConTope({
        id_TipoCuota: 2,
        importe: 11000,
        edadTope: 70,
      });
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/configuracion-cuotas/modificar-sepelio-con-tope",
        "token123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ id_TipoCuota: 2, importe: 11000, edadTope: 70 }),
        })
      );
    });
  });

  describe("modificarSepelioSinTope", () => {
    it("falla validación con importe negativo", async () => {
      const res = await modificarSepelioSinTope({
        id_TipoCuota: 4,
        importe: -50,
      });
      expect(res.success).toBe(false);
      expect(res.mensaje).toContain("El importe no puede ser negativo");
    });

    it("modifica sepelio sin tope exitosamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "token123" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "La cuota de sepelio (más de) fue modificada correctamente.",
      });

      const res = await modificarSepelioSinTope({
        id_TipoCuota: 4,
        importe: 13500,
      });
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/configuracion-cuotas/modificar-sepelio-sin-tope",
        "token123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ id_TipoCuota: 4, importe: 13500 }),
        })
      );
    });
  });
});
