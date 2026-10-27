import {
  MockUsuariosService,
  ApiUsuariosService,
  createUsuariosService,
} from "./service";
import { _resetDevStoreForTests } from "@/lib/dev-store";
import { validarPassword } from "./types";

jest.mock("../../app/dashboard/usuarios/actions", () => ({
  obtenerUsuarios: jest.fn(),
  crearUsuario: jest.fn(),
  cambiarRolUsuario: jest.fn(),
  cambiarPasswordUsuario: jest.fn(),
  cambiarEstadoUsuario: jest.fn(),
}));

import * as actions from "../../app/dashboard/usuarios/actions";

describe("validarPassword", () => {
  it("debe rechazar contraseñas vacías", () => {
    expect(validarPassword("").valido).toBe(false);
    expect(validarPassword("   ").valido).toBe(false);
  });

  it("debe rechazar contraseñas de menos de 8 caracteres", () => {
    const res = validarPassword("Ab1!");
    expect(res.valido).toBe(false);
    expect(res.mensaje).toContain("8 caracteres");
  });

  it("debe rechazar contraseñas sin carácter especial", () => {
    const res = validarPassword("123456789Pass");
    expect(res.valido).toBe(false);
    expect(res.mensaje).toContain("carácter especial");
  });

  it("debe aceptar contraseñas válidas (>= 8 caracteres y 1 especial)", () => {
    expect(validarPassword("Password123!").valido).toBe(true);
    expect(validarPassword("ClaveSegura#2026").valido).toBe(true);
  });
});

describe("MockUsuariosService", () => {
  let service: MockUsuariosService;

  beforeEach(() => {
    _resetDevStoreForTests();
    service = new MockUsuariosService();
  });

  it("list() debe retornar la lista inicial de usuarios", async () => {
    const usuarios = await service.list();
    expect(usuarios.length).toBeGreaterThan(0);
    expect(usuarios[0]).toHaveProperty("id_Usuario");
    expect(usuarios[0]).toHaveProperty("usuario");
    expect(usuarios[0]).toHaveProperty("rol");
    expect(usuarios[0]).toHaveProperty("estado");
  });

  it("create() debe agregar un usuario al dev store", async () => {
    const nuevo = await service.create({
      usuario: "testuser",
      rol: "ADMINISTRADOR",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(nuevo).not.toBeNull();
    expect(nuevo?.usuario).toBe("testuser");
    expect(nuevo?.rol).toBe("ADMINISTRADOR");
    expect(nuevo?.estado).toBe("ACTIVO");

    const list = await service.list();
    expect(list.some((u) => u.usuario === "testuser")).toBe(true);
  });

  it("updateRol() debe actualizar el rol del usuario", async () => {
    const list = await service.list();
    const target = list[0]!;
    const ok = await service.updateRol({ id_Usuario: target.id_Usuario, rol: "CONSULTOR" });

    expect(ok).toBe(true);
    const updatedList = await service.list();
    const updated = updatedList.find((u) => u.id_Usuario === target.id_Usuario);
    expect(updated?.rol).toBe("CONSULTOR");
  });

  it("updatePassword() debe retornar true para usuario existente", async () => {
    const list = await service.list();
    const target = list[0]!;
    const ok = await service.updatePassword({
      id_Usuario: target.id_Usuario,
      password: "NewPassword123!",
      confirmPassword: "NewPassword123!",
    });

    expect(ok).toBe(true);
  });

  it("toggleEstado() debe alternar el estado del usuario", async () => {
    const list = await service.list();
    const target = list[0]!;
    const estadoInicial = target.estado;

    const ok = await service.toggleEstado(target.id_Usuario);
    expect(ok).toBe(true);

    const updatedList = await service.list();
    const updated = updatedList.find((u) => u.id_Usuario === target.id_Usuario);
    expect(updated?.estado).toBe(estadoInicial === "ACTIVO" ? "BAJA" : "ACTIVO");
  });
});

describe("ApiUsuariosService", () => {
  let service: ApiUsuariosService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ApiUsuariosService();
  });

  it("debe invocar obtenerUsuarios() en list()", async () => {
    (actions.obtenerUsuarios as jest.Mock).mockResolvedValue([
      { id_Usuario: 1, usuario: "API_USER", rol: "ADMIN", estado: "ACTIVO" },
    ]);

    const result = await service.list();
    expect(actions.obtenerUsuarios).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]!.usuario).toBe("API_USER");
  });

  it("debe invocar crearUsuario() en create()", async () => {
    const dto = { usuario: "NEW", rol: "ADMIN", password: "P1!", confirmPassword: "P1!" };
    (actions.crearUsuario as jest.Mock).mockResolvedValue({ id_Usuario: 99, ...dto, estado: "ACTIVO" });

    const res = await service.create(dto);
    expect(actions.crearUsuario).toHaveBeenCalledWith(dto);
    expect(res?.id_Usuario).toBe(99);
  });
});

describe("createUsuariosService factory", () => {
  it("debe retornar MockUsuariosService en mockMode=true", () => {
    const s = createUsuariosService(true);
    expect(s).toBeInstanceOf(MockUsuariosService);
  });

  it("debe retornar ApiUsuariosService en mockMode=false", () => {
    const s = createUsuariosService(false);
    expect(s).toBeInstanceOf(ApiUsuariosService);
  });
});
