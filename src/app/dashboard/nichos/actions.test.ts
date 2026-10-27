import {
  obtenerNichos,
  buscarSociosAsignablesNicho,
  crearNicho,
  darDeBajaNicho,
  asignarNicho,
} from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Nichos Server Actions", () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = "stg";
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  describe("obtenerNichos", () => {
    it("sin token en stg devuelve array vacío sin llamar a la API", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      const res = await obtenerNichos();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("en develop (mock mode) sin cookie permite consultar mocks", async () => {
      process.env.ENV = "develop";
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      (fetchAPI as jest.Mock).mockResolvedValue([]);

      await obtenerNichos();
      expect(fetchAPI).toHaveBeenCalledWith("/nichos", "mock-token");
    });

    it("con token consulta /nichos y mapea los nichos correctamente", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_Nicho: 1,
          nroNicho: 45,
          sector: "A",
          ocupado: "SI",
          conLapida: "SI",
          valorNicho: 50000,
          valorLapida: 15000,
          cuotas: 12,
          interesMensual: 0.05,
          socio: {
            id_Socio: 1,
            nombre: "Luciano",
            apellido: "Oldan",
          },
        },
      ]);

      const res = await obtenerNichos();
      expect(fetchAPI).toHaveBeenCalledWith("/nichos", "tok");
      expect(res).toHaveLength(1);
      expect(res[0]?.nroNicho).toBe("45");
      expect(res[0]?.ocupado).toBe(true);
      expect(res[0]?.conLapida).toBe(true);
      expect(res[0]?.socio?.nombre).toBe("Luciano");
    });

    it("envía query params si se especifican filtros", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "tok" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([]);

      await obtenerNichos({ busqueda: "Oldan", sectorNumero: "A", ocupado: false });
      expect(fetchAPI).toHaveBeenCalledWith(
        "/nichos?Busqueda=Oldan&SectorNumero=A&Ocupado=false",
        "tok"
      );
    });
  });

  describe("buscarSociosAsignablesNicho", () => {
    it("retorna lista de socios elegibles llamando a /socios/asignables-nicho", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "tok" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          idSocio: 1,
          idEntidad: 1,
          nombre: "Luciano",
          apellido: "Oldan",
          dni: "20123456",
        },
      ]);

      const res = await buscarSociosAsignablesNicho("Oldan");
      expect(fetchAPI).toHaveBeenCalledWith("/socios/asignables-nicho?busqueda=Oldan", "tok");
      expect(res).toHaveLength(1);
      expect(res[0]?.dni).toBe("20123456");
    });

    it("retorna array vacío sin token", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await buscarSociosAsignablesNicho();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe("crearNicho", () => {
    it("falla validación si sector está vacío", async () => {
      const res = await crearNicho({ sector: "", nroNicho: "10" });
      expect(res.success).toBe(false);
      expect(res.mensaje).toContain("El sector es obligatorio");
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("llama a POST /nichos/crear con éxito", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "tok" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ idNicho: 7 });

      const res = await crearNicho({ sector: "C", nroNicho: "25" });
      expect(res.success).toBe(true);
      expect(res.idNicho).toBe(7);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/nichos/crear",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ sector: "C", nroNicho: "25" }),
        })
      );
    });
  });

  describe("darDeBajaNicho", () => {
    it("falla con id inválido", async () => {
      const res = await darDeBajaNicho(0);
      expect(res.success).toBe(false);
    });

    it("llama a POST /nichos/baja con éxito", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "tok" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Nicho eliminado" });

      const res = await darDeBajaNicho(4);
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/nichos/baja",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ idNicho: 4 }),
        })
      );
    });
  });

  describe("asignarNicho", () => {
    it("falla validación si falta lápida cuando conLapida es SI", async () => {
      const res = await asignarNicho({
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "SI",
      });
      expect(res.success).toBe(false);
      expect(res.mensaje).toContain("El valor de la lápida es obligatorio");
    });

    it("llama a POST /nichos/asignar con éxito", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: () => ({ value: "tok" }),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Nicho asignado" });

      const res = await asignarNicho({
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "NO",
      });
      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/nichos/asignar",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            idNicho: 2,
            idEntidad: 1,
            valorTotal: 50000,
            cuotas: 12,
            interesPorCuota: 0.05,
            conLapida: "NO",
            valorLapida: 0,
          }),
        })
      );
    });
  });
});
