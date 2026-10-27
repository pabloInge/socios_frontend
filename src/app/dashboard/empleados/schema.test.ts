import {
  empleadoSchema,
  bajaEmpleadoSchema,
  normalizeContacts,
  contactValue,
} from "./schema";

describe("Empleado Schema & Helpers", () => {
  describe("contactValue & normalizeContacts", () => {
    it("debe extraer el valor correcto de string u objeto", () => {
      expect(contactValue(" 123456 ")).toBe("123456");
      expect(contactValue({ value: " 654321 " })).toBe("654321");
    });

    it("debe normalizar listas de contactos removiendo vacíos", () => {
      const input = [" 3411111 ", { value: "   " }, { value: "3422222" }, ""];
      const result = normalizeContacts(input);
      expect(result).toEqual(["3411111", "3422222"]);
    });

    it("debe retornar arreglo vacío si items es undefined", () => {
      expect(normalizeContacts(undefined)).toEqual([]);
    });
  });

  describe("empleadoSchema", () => {
    const validData = {
      dni: "31222333",
      nombre: "Carlos",
      apellido: "López",
      sexo: "Masculino",
      fechaNacimiento: "1988-04-12",
      ciudad: "Rosario",
      calle: "Pellegrini",
      altura: "1240",
      observaciones: "Empleado contable",
      telefonos: ["3414998877"],
      correos: [{ value: "carlos@example.com" }],
    };

    it("valida exitosamente un empleado con datos completos", () => {
      const res = empleadoSchema.safeParse(validData);
      expect(res.success).toBe(true);
    });

    it("falla si el DNI no tiene 7 u 8 dígitos", () => {
      const invalidDni = { ...validData, dni: "123" };
      const res = empleadoSchema.safeParse(invalidDni);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toMatch(/7 u 8 dígitos/i);
      }
    });

    it("falla si el nombre o apellido tienen menos de 3 caracteres", () => {
      const invalidNombre = { ...validData, nombre: "Ca" };
      const res = empleadoSchema.safeParse(invalidNombre);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toMatch(/al menos 3 caracteres/i);
      }
    });

    it("falla si no tiene teléfonos", () => {
      const noTel = { ...validData, telefonos: [] };
      const res = empleadoSchema.safeParse(noTel);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toMatch(/al menos un teléfono/i);
      }
    });

    it("falla si el formato de correo es inválido", () => {
      const invalidEmail = { ...validData, correos: [{ value: "no-email" }] };
      const res = empleadoSchema.safeParse(invalidEmail);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toMatch(/Correo inválido/i);
      }
    });
  });

  describe("bajaEmpleadoSchema", () => {
    it("valida id positivo y motivo de al menos 3 caracteres", () => {
      const res = bajaEmpleadoSchema.safeParse({ idEntidadTipo: 5, motivo: "Jubilación" });
      expect(res.success).toBe(true);
    });

    it("falla si el motivo es muy corto", () => {
      const res = bajaEmpleadoSchema.safeParse({ idEntidadTipo: 5, motivo: "No" });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toMatch(/al menos 3 caracteres/i);
      }
    });
  });
});
