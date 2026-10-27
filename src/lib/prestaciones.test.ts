import {
  MOCK_PRESTACIONES,
  findPrestacionIdByName,
  findPrestacionNameById,
} from "./prestaciones";

describe("Prestaciones Catalog", () => {
  it("debe contener el catálogo inicial de prestaciones", () => {
    expect(MOCK_PRESTACIONES.length).toBeGreaterThan(0);
    expect(MOCK_PRESTACIONES.some((p) => p.nombre === "Atención Médica")).toBe(true);
  });

  it("findPrestacionIdByName devuelve el id correcto", () => {
    expect(findPrestacionIdByName("Farmacia")).toBe(2);
    expect(findPrestacionIdByName("desconocido")).toBe(1);
    expect(findPrestacionIdByName(undefined)).toBe(1);
  });

  it("findPrestacionNameById devuelve el nombre correcto", () => {
    expect(findPrestacionNameById(2)).toBe("Farmacia");
    expect(findPrestacionNameById("3")).toBe("Enfermería");
    expect(findPrestacionNameById(undefined)).toBe("Atención Médica");
  });
});
