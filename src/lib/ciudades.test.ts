jest.mock("./apiClient", () => ({
  fetchAPI: jest.fn(),
  isMockMode: jest.fn(),
}));

import { findCiudadIdByName, buscarCiudades, MOCK_CIUDADES } from "./ciudades";
import { fetchAPI } from "./apiClient";

describe("ciudades utility & service", () => {
  describe("findCiudadIdByName", () => {
    it("debe retornar 1 si el nombre es indefinido o vacío", () => {
      expect(findCiudadIdByName(undefined)).toBe(1);
      expect(findCiudadIdByName("")).toBe(1);
    });

    it("debe retornar el id correspondiente sin importar mayúsculas o espacios", () => {
      expect(findCiudadIdByName("Rosario")).toBe(3);
      expect(findCiudadIdByName("  rosario  ")).toBe(3);
      expect(findCiudadIdByName("Córdoba")).toBe(2);
      expect(findCiudadIdByName("buenos aires")).toBe(1);
    });

    it("debe retornar 1 si la ciudad no existe en el catálogo", () => {
      expect(findCiudadIdByName("Ciudad Inexistente")).toBe(1);
    });
  });

  describe("buscarCiudades", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("debe procesar respuesta directa de la API cuando fetchAPI responde con DTOs", async () => {
      (fetchAPI as jest.Mock).mockResolvedValueOnce([
        { id_Ciudad: 42, nombre: "Mendoza" },
        { idCiudad: 43, nombre: "San Juan" },
      ]);

      const resultados = await buscarCiudades("Mendoza", "test-token");
      expect(fetchAPI).toHaveBeenCalledWith("/ciudades/buscar?Busqueda=Mendoza", "test-token");
      expect(resultados).toEqual([
        { id: "42", nombre: "Mendoza" },
        { id: "43", nombre: "San Juan" },
      ]);
    });

    it("debe usar fallback local si fetchAPI falla", async () => {
      (fetchAPI as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const resultados = await buscarCiudades("Rosario");
      expect(resultados).toEqual([
        { id: "3", nombre: "Rosario" },
      ]);
    });

    it("debe usar fallback local completo si fetchAPI falla y no hay búsqueda", async () => {
      (fetchAPI as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const resultados = await buscarCiudades();
      expect(resultados).toEqual(MOCK_CIUDADES);
    });

    it("debe llamar a /ciudades/buscar sin query string si no hay búsqueda", async () => {
      (fetchAPI as jest.Mock).mockResolvedValueOnce([
        { id_Ciudad: 1, nombre: "Buenos Aires" },
      ]);

      const resultados = await buscarCiudades(undefined, "tok");
      expect(fetchAPI).toHaveBeenCalledWith("/ciudades/buscar", "tok");
      expect(resultados).toEqual([{ id: "1", nombre: "Buenos Aires" }]);
    });
  });
});
