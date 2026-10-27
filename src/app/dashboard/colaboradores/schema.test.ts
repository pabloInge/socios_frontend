import {
  colaboradorSchema,
  bajaColaboradorSchema,
  normalizeContacts,
} from "./schema";

describe("Colaboradores Schema Validation", () => {
  it("valida un colaborador correcto", () => {
    const data = {
      tipoDocumento: "DNI",
      documento: "12345678",
      nombre: "Carlos",
      apellido: "Benítez",
      prestacion: "Atención Médica",
      ciudad: "Rosario",
      calle: "San Martín",
      altura: "500",
      telefonos: ["3412345678"],
      correos: [{ value: "carlos@example.com" }],
    };

    const parsed = colaboradorSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it("falla si el tipo de documento no es DNI ni CUIT", () => {
    const data = {
      tipoDocumento: "PASAPORTE",
      documento: "12345678",
      nombre: "Carlos",
      apellido: "Benítez",
      prestacion: "Farmacia",
      ciudad: "Rosario",
      calle: "San Martín",
      altura: "500",
      telefonos: ["3412345678"],
    };

    const parsed = colaboradorSchema.safeParse(data);
    expect(parsed.success).toBe(false);
  });

  it("falla si el nombre tiene menos de 3 caracteres", () => {
    const data = {
      tipoDocumento: "DNI",
      documento: "12345678",
      nombre: "Ca",
      apellido: "Benítez",
      prestacion: "Farmacia",
      ciudad: "Rosario",
      calle: "San Martín",
      altura: "500",
      telefonos: ["3412345678"],
    };

    const parsed = colaboradorSchema.safeParse(data);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("al menos 3 caracteres");
    }
  });

  it("falla si no tiene teléfonos", () => {
    const data = {
      tipoDocumento: "DNI",
      documento: "12345678",
      nombre: "Carlos",
      apellido: "Benítez",
      prestacion: "Farmacia",
      ciudad: "Rosario",
      calle: "San Martín",
      altura: "500",
      telefonos: [],
    };

    const parsed = colaboradorSchema.safeParse(data);
    expect(parsed.success).toBe(false);
  });

  it("valida bajaColaboradorSchema", () => {
    expect(
      bajaColaboradorSchema.safeParse({ idEntidadTipo: 1, motivo: "Renuncia" }).success
    ).toBe(true);
    expect(
      bajaColaboradorSchema.safeParse({ idEntidadTipo: 1, motivo: "No" }).success
    ).toBe(false);
  });

  it("normaliza contactos correctamente", () => {
    const normalized = normalizeContacts([
      " 341111222 ",
      { value: "  341333444  " },
      "",
      { value: "" },
    ]);
    expect(normalized).toEqual(["341111222", "341333444"]);
  });
});
