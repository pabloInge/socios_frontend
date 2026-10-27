import {
  crearNichoSchema,
  asignarNichoSchema,
  bajaNichoSchema,
} from "./schema";

describe("Nichos Schemas Validation", () => {
  describe("crearNichoSchema", () => {
    it("valida correctamente con datos requeridos", () => {
      const data = { sector: "A", nroNicho: "101" };
      const parsed = crearNichoSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("falla si falta el sector", () => {
      const data = { sector: "", nroNicho: "101" };
      const parsed = crearNichoSchema.safeParse(data);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toContain("El sector es obligatorio");
      }
    });

    it("falla si falta el número de nicho", () => {
      const data = { sector: "B", nroNicho: "  " };
      const parsed = crearNichoSchema.safeParse(data);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toContain("El número de nicho es obligatorio");
      }
    });
  });

  describe("asignarNichoSchema", () => {
    it("valida correctamente asignación sin lápida", () => {
      const data = {
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "NO",
      };
      const parsed = asignarNichoSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("valida correctamente asignación con lápida y valor de lápida", () => {
      const data = {
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "SI",
        valorLapida: 15000,
      };
      const parsed = asignarNichoSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("falla si conLapida es SI pero no se informa valor de lápida", () => {
      const data = {
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 12,
        interesPorCuota: 0.05,
        conLapida: "SI",
      };
      const parsed = asignarNichoSchema.safeParse(data);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toContain("El valor de la lápida es obligatorio");
      }
    });

    it("falla si la cantidad de cuotas es menor a 1", () => {
      const data = {
        idNicho: 2,
        idEntidad: 1,
        valorTotal: 50000,
        cuotas: 0,
        interesPorCuota: 0,
        conLapida: "NO",
      };
      const parsed = asignarNichoSchema.safeParse(data);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toContain("al menos 1");
      }
    });
  });

  describe("bajaNichoSchema", () => {
    it("valida correctamente con id válido", () => {
      const parsed = bajaNichoSchema.safeParse({ idNicho: 5 });
      expect(parsed.success).toBe(true);
    });

    it("falla con id negativo o 0", () => {
      const parsed = bajaNichoSchema.safeParse({ idNicho: 0 });
      expect(parsed.success).toBe(false);
    });
  });
});
