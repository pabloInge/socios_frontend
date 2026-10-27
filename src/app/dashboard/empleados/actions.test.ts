import {
  obtenerEmpleados,
  obtenerEmpleadoDetalle,
  crearEmpleado,
  modificarEmpleado,
  darDeBajaEmpleado,
  buscarEmpleadoPorDocumento,
} from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Empleados Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as unknown as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "mock-token-xyz" }),
    });
  });

  describe("obtenerEmpleados", () => {
    it("obtiene lista y mapea correctamente los datos", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_Entidad: 101,
          id_EntidadTipo: 201,
          dni: "31222333",
          nombre: "Carlos",
          apellido: "López",
          estado: "ACTIVO",
          telefonos: ["3414998877"],
          emails: ["carlos@example.com"],
        },
        {
          id_Entidad: 102,
          dni: "32444555",
          nombre: "Mariana",
          apellido: "Ríos",
          estado: "INACTIVO",
          telefonos: [],
          emails: [],
        },
      ]);

      const result = await obtenerEmpleados("Carlos");

      expect(fetchAPI).toHaveBeenCalledWith(
        "/Empleados/buscar?busqueda=Carlos",
        "mock-token-xyz"
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "101",
        idEntidadTipo: 201,
        dni: "31222333",
        cuitCuil: undefined,
        nombre: "Carlos",
        apellido: "López",
        sexo: undefined,
        estado: "Activo",
        telefonos: ["3414998877"],
        emails: ["carlos@example.com"],
      });
      expect(result[1]?.estado).toBe("Inactivo");
    });

    it("retorna vacio si la API falla", async () => {
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("API Error"));
      const res = await obtenerEmpleados();
      expect(res).toEqual([]);
    });
  });

  describe("obtenerEmpleadoDetalle", () => {
    it("obtiene el detalle del empleado correctamente", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Entidad: 101,
        id_EntidadTipo: 201,
        dni: "31222333",
        nombre: "Carlos",
        apellido: "López",
        estado: "ACTIVO",
        nacimiento: "1988-04-12T00:00:00",
        ciudad: { id_Ciudad: 2, nombre: "Rosario" },
        calle: "Pellegrini",
        altura: 1240,
        observacion: "Nota",
        telefonos: ["3414998877"],
        emails: ["carlos@example.com"],
      });

      const res = await obtenerEmpleadoDetalle("101");

      expect(fetchAPI).toHaveBeenCalledWith("/Empleados/101", "mock-token-xyz");
      expect(res).not.toBeNull();
      expect(res?.nombre).toBe("Carlos");
      expect(res?.ciudad).toBe("Rosario");
      expect(res?.fechaNacimiento).toBe("1988-04-12");
      expect(res?.estado).toBe("Activo");
    });

    it("retorna null si la API falla o devuelve null", async () => {
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("Network error"));
      const res = await obtenerEmpleadoDetalle("999");
      expect(res).toBeNull();
    });
  });

  describe("crearEmpleado", () => {
    const validData = {
      dni: "31222333",
      nombre: "Carlos",
      apellido: "López",
      sexo: "Masculino",
      fechaNacimiento: "1988-04-12",
      ciudad: "Rosario",
      calle: "Pellegrini",
      altura: "1240",
      telefonos: ["3414998877"],
      correos: [{ value: "carlos@example.com" }],
    };

    it("envía payload formateado a /Empleados/alta", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({ id: 101, mensaje: "Creado" });

      const res = await crearEmpleado(validData);

      expect(res.success).toBe(true);
      expect(res.idEmpleado).toBe(101);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/Empleados/alta",
        "mock-token-xyz",
        expect.objectContaining({ method: "POST" })
      );
    });

    it("falla validación si datos son inválidos", async () => {
      const res = await crearEmpleado({ ...validData, dni: "123" });
      expect(res.success).toBe(false);
      expect(res.mensaje).toMatch(/7 u 8 dígitos/i);
    });
  });

  describe("modificarEmpleado", () => {
    const validData = {
      dni: "31222333",
      nombre: "Carlos",
      apellido: "López",
      sexo: "Masculino",
      fechaNacimiento: "1988-04-12",
      ciudad: "Rosario",
      calle: "Pellegrini",
      altura: "1240",
      telefonos: ["3414998877"],
      correos: [],
    };

    it("envía payload a /Empleados/modificar", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Modificado" });

      const res = await modificarEmpleado(101, validData);

      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/Empleados/modificar",
        "mock-token-xyz",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  describe("darDeBajaEmpleado", () => {
    it("envía PUT a /Empleados/baja/{id}", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "Dado de baja" });

      const res = await darDeBajaEmpleado(201, "Renuncia voluntaria");

      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/Empleados/baja/201",
        "mock-token-xyz",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ motivo: "Renuncia voluntaria" }),
        })
      );
    });
  });

  describe("buscarEmpleadoPorDocumento", () => {
    it("busca entidad por documento y normaliza resultado", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Entidad: 50,
        dni: "31222333",
        nombre: "Carlos",
        apellido: "López",
        ciudad: { id_Ciudad: 2, nombre: "Rosario" },
        calle: "Pellegrini",
        altura: 1240,
        nacimiento: "1988-04-12T00:00:00",
      });

      const res = await buscarEmpleadoPorDocumento("31222333");

      expect(res).not.toBeNull();
      expect(res?.nombre).toBe("Carlos");
      expect(res?.apellido).toBe("López");
      expect(res?.ciudad).toBe("Rosario");
    });
  });
});
