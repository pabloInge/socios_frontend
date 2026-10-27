jest.mock("../../../lib/auth", () => ({
  getAuthToken: jest.fn(),
}));

jest.mock("../../../lib/ciudades", () => ({
  buscarCiudades: jest.fn(),
}));

jest.mock("../../../lib/obras-sociales", () => ({
  buscarObrasSociales: jest.fn(),
}));

import { buscarCiudades, buscarObrasSociales } from "./actions";
import { getAuthToken } from "../../../lib/auth";
import { buscarCiudades as buscarCiudadesLib } from "../../../lib/ciudades";
import { buscarObrasSociales as buscarObrasSocialesLib } from "../../../lib/obras-sociales";

describe("Catalogos Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buscarCiudades", () => {
    it("debe obtener el token de auth y delegar a buscarCiudades con el término de búsqueda", async () => {
      (getAuthToken as jest.Mock).mockResolvedValueOnce("mock-token-123");
      (buscarCiudadesLib as jest.Mock).mockResolvedValueOnce([
        { id: "1", nombre: "Buenos Aires" },
      ]);

      const res = await buscarCiudades("Buenos");
      expect(getAuthToken).toHaveBeenCalled();
      expect(buscarCiudadesLib).toHaveBeenCalledWith("Buenos", "mock-token-123");
      expect(res).toEqual([{ id: "1", nombre: "Buenos Aires" }]);
    });
  });

  describe("buscarObrasSociales", () => {
    it("debe obtener el token de auth y delegar a buscarObrasSociales con el término de búsqueda", async () => {
      (getAuthToken as jest.Mock).mockResolvedValueOnce("mock-token-456");
      (buscarObrasSocialesLib as jest.Mock).mockResolvedValueOnce([
        { id: "1", nombre: "PAMI" },
      ]);

      const res = await buscarObrasSociales("PAMI");
      expect(getAuthToken).toHaveBeenCalled();
      expect(buscarObrasSocialesLib).toHaveBeenCalledWith("PAMI", "mock-token-456");
      expect(res).toEqual([{ id: "1", nombre: "PAMI" }]);
    });
  });
});
