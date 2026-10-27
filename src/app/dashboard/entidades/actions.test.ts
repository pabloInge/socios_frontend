import { buscarEntidades, obtenerEntidadPorDni } from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Entidades Server Actions", () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = "stg";
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  describe("buscarEntidades", () => {
    it("sin token en stg devuelve array vacío", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await buscarEntidades();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("en develop (mock mode) sin cookie permite consultar mocks", async () => {
      process.env.ENV = "develop";
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      (fetchAPI as jest.Mock).mockResolvedValue([]);

      await buscarEntidades();
      expect(fetchAPI).toHaveBeenCalledWith("/buscarentidad/buscar", "mock-token");
    });

    it("con token consulta /buscarentidad/buscar con filtro y mapea personas físicas y jurídicas", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_Entidad: 1,
          cuitCuil: "20123456789",
          nombre: "Juan",
          apellido: "Pérez",
          razonSocial: null,
          sexo: "Hombre",
          nacimiento: "1990-01-01",
        },
        {
          id_Entidad: 2,
          cuitCuil: "30712345678",
          nombre: "",
          apellido: "",
          razonSocial: "Emergencias Médicas S.A.",
          sexo: "-",
          nacimiento: "2010-03-15",
        },
      ]);

      const res = await buscarEntidades("Juan");

      expect(res).toHaveLength(2);
      expect(res[0]?.id).toBe("1");
      expect(res[0]?.tipo).toBe("Física");
      expect(res[0]?.nombre).toBe("Juan");
      expect(res[1]?.id).toBe("2");
      expect(res[1]?.tipo).toBe("Jurídica");
      expect(res[1]?.razonSocial).toBe("Emergencias Médicas S.A.");
      expect(fetchAPI).toHaveBeenCalledWith("/buscarentidad/buscar?Busqueda=Juan", "tok");
    });

    it("si la API falla devuelve array vacío sin lanzar excepción", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("500"));

      const res = await buscarEntidades();
      expect(res).toEqual([]);
    });
  });

  describe("obtenerEntidadPorDni", () => {
    it("sin token devuelve null", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerEntidadPorDni("12345678");
      expect(res).toBeNull();
    });

    it("con token consulta /buscarentidad con DNI en el body", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Entidad: 1,
        cuitCuil: "20123456789",
        nombre: "Juan",
        apellido: "Pérez",
        razonSocial: null,
        sexo: "Hombre",
        nacimiento: "1990-01-01",
        ciudad: { id_Ciudad: 1, nombre: "Buenos Aires" },
        calle: "Falsa",
        altura: 123,
        observacion: "Socio activo",
      });

      const res = await obtenerEntidadPorDni("20123456789");

      expect(res).not.toBeNull();
      expect(res?.id).toBe("1");
      expect(res?.ciudad).toBe("Buenos Aires");
      expect(res?.calle).toBe("Falsa");
      expect(res?.altura).toBe("123");
      expect(res?.tipo).toBe("Física");
      expect(fetchAPI).toHaveBeenCalledWith(
        "/buscarentidad",
        "tok",
        expect.objectContaining({
          method: "GET",
          body: JSON.stringify({ dni: "20123456789" }),
        })
      );
    });
  });
});
