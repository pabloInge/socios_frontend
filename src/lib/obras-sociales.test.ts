jest.mock("./apiClient", () => ({
  fetchAPI: jest.fn(),
  isMockMode: jest.fn(),
}));

import { findObraSocialIdByName, buscarObrasSociales, MOCK_OBRAS_SOCIALES } from "./obras-sociales";
import { fetchAPI } from "./apiClient";

describe("obras-sociales utility & service", () => {
  describe("findObraSocialIdByName", () => {
    it("debe retornar undefined si el nombre es indefinido o vacío", () => {
      expect(findObraSocialIdByName(undefined)).toBeUndefined();
      expect(findObraSocialIdByName("")).toBeUndefined();
    });

    it("debe retornar el id correspondiente sin importar mayúsculas o espacios", () => {
      expect(findObraSocialIdByName("PAMI")).toBe(1);
      expect(findObraSocialIdByName("  pami  ")).toBe(1);
      expect(findObraSocialIdByName("OSDE")).toBe(3);
      expect(findObraSocialIdByName("iapos")).toBe(2);
    });

    it("debe retornar undefined si la obra social no existe en el catálogo", () => {
      expect(findObraSocialIdByName("Obra Social Inexistente")).toBeUndefined();
    });
  });

  describe("buscarObrasSociales", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("debe procesar respuesta directa de la API cuando fetchAPI responde con DTOs", async () => {
      (fetchAPI as jest.Mock).mockResolvedValueOnce([
        { id_ObraSocial: 10, nombreObraSocial: "Swiss Medical" },
        { idObraSocial: 11, nombre: "Galeno" },
      ]);

      const resultados = await buscarObrasSociales("Swiss", "test-token");
      expect(fetchAPI).toHaveBeenCalledWith("/obrassociales/buscar?Busqueda=Swiss", "test-token");
      expect(resultados).toEqual([
        { id: "10", nombre: "Swiss Medical" },
        { id: "11", nombre: "Galeno" },
      ]);
    });

    it("debe usar fallback local si fetchAPI falla con búsqueda", async () => {
      (fetchAPI as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const resultados = await buscarObrasSociales("PAMI");
      expect(resultados).toEqual([
        { id: "1", nombre: "PAMI" },
      ]);
    });

    it("debe usar fallback local completo si fetchAPI falla y no hay búsqueda", async () => {
      (fetchAPI as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const resultados = await buscarObrasSociales();
      expect(resultados).toEqual(MOCK_OBRAS_SOCIALES);
    });

    it("debe llamar a /obrassociales/buscar sin query string si no hay búsqueda", async () => {
      (fetchAPI as jest.Mock).mockResolvedValueOnce([
        { id_ObraSocial: 1, nombreObraSocial: "PAMI" },
      ]);

      const resultados = await buscarObrasSociales(undefined, "tok");
      expect(fetchAPI).toHaveBeenCalledWith("/obrassociales/buscar", "tok");
      expect(resultados).toEqual([{ id: "1", nombre: "PAMI" }]);
    });
  });
});
