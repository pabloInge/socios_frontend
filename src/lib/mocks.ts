import type { SocioListItem, SocioDetalle } from "@/app/dashboard/socios/actions";
import { MOCK_CIUDADES } from "./ciudades";
import { MOCK_OBRAS_SOCIALES } from "./obras-sociales";

export const MOCK_USUARIO = {
  id_Usuario: 1,
  usuarioNombre: "CJR",
  estado: "Activo",
  id_Rol: 2,
  rolNombre: "Consultor",
  logueado: true,
  nombre: "CJR",
  rol: "Consultor",
};

export const MOCK_SOCIOS_BACKEND = [
  { idSocio: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", estado: "ACTIVO" },
  { idSocio: 2, nombre: "María", apellido: "Gómez", dni: "20123456", estado: "ACTIVO" },
  { idSocio: 3, nombre: "Carlos", apellido: "Rodríguez", dni: "34567890", estado: "INACTIVO" },
  { idSocio: 4, nombre: "Ana", apellido: "Martínez", dni: "45678901", estado: "ACTIVO" },
  { idSocio: 5, nombre: "Roberto", apellido: "López", dni: "20345678", estado: "ACTIVO" },
  { idSocio: 6, nombre: "Laura", apellido: "Fernández", dni: "56789012", estado: "INACTIVO" },
  { idSocio: 7, nombre: "Diego", apellido: "García", dni: "67890123", estado: "ACTIVO" },
  { idSocio: 8, nombre: "Patricia", apellido: "Sánchez", dni: "78901234", estado: "ACTIVO" },
  { idSocio: 9, nombre: "Fernando", apellido: "Torres", dni: "20456789", estado: "INACTIVO" },
  { idSocio: 10, nombre: "Verónica", apellido: "Ruiz", dni: "89012345", estado: "ACTIVO" },
];

export const MOCK_SOCIOS: SocioListItem[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    nroDocumento: "12345678",
    obraSocial: "PAMI",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    nroDocumento: "20123456",
    obraSocial: "OSDE",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    nroDocumento: "34567890",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    nroDocumento: "45678901",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Roberto",
    apellido: "López",
    nroDocumento: "20345678",
    obraSocial: "Jerárquicos Salud",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "6",
    nombre: "Laura",
    apellido: "Fernández",
    nroDocumento: "56789012",
    obraSocial: null,
    plan: "B",
    estado: "Baja",
  },
  {
    id: "7",
    nombre: "Diego",
    apellido: "García",
    nroDocumento: "67890123",
    obraSocial: "OSDE",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "8",
    nombre: "Patricia",
    apellido: "Sánchez",
    nroDocumento: "78901234",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "9",
    nombre: "Fernando",
    apellido: "Torres",
    nroDocumento: "20456789",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "10",
    nombre: "Verónica",
    apellido: "Ruiz",
    nroDocumento: "89012345",
    obraSocial: "Jerárquicos Salud",
    plan: "B",
    estado: "Activo",
  },
];

export const MOCK_SOCIOS_DETALLE: SocioDetalle[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    nroDocumento: "12345678",
    fechaNacimiento: "1990-01-01",
    sexo: "Hombre",
    ciudad: "Buenos Aires",
    calle: "Falsa",
    altura: "123",
    fechaAlta: "2024-01-01",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-12345678",
    plan: "A",
    sepelio: "SI",
    cobrador: "NO",
    observaciones: "Socio con domicilio particular en Buenos Aires.",
    telefonos: ["3412345678"],
    correos: ["juan.perez@example.com"],
    codeudores: [
      { id: "2", nombre: "María", apellido: "Gómez", nroDocumento: "20123456" },
    ],
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    nroDocumento: "20123456",
    fechaNacimiento: "1985-05-15",
    sexo: "Mujer",
    ciudad: "Rosario",
    calle: "Córdoba",
    altura: "456",
    fechaAlta: "2023-06-12",
    obraSocial: "OSDE",
    nroAfiliadoObraSocial: "OSDE-20123456",
    plan: "B",
    sepelio: "NO",
    cobrador: "SI",
    telefonos: ["3418765432"],
    correos: ["maria.gomez@example.com"],
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    nroDocumento: "34567890",
    fechaNacimiento: "1962-11-20",
    sexo: "Hombre",
    ciudad: "Santa Fe",
    calle: "San Martín",
    altura: "789",
    fechaAlta: "2023-03-15",
    fechaBaja: "2024-12-01",
    obraSocial: "IAPOS",
    nroAfiliadoObraSocial: "IAPOS-34567890",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3421112233"],
    correos: ["carlos.rodriguez@example.com"],
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    nroDocumento: "45678901",
    fechaNacimiento: "1978-08-08",
    sexo: "Mujer",
    ciudad: "Paraná",
    calle: "Urquiza",
    altura: "321",
    fechaAlta: "2024-06-01",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-45678901",
    plan: "B",
    sepelio: "SI",
    cobrador: "NO",
    observaciones: "Prefiere ser contactada por correo electrónico.",
    telefonos: ["3434445566"],
    correos: ["ana.martinez@example.com"],
  },
  {
    id: "5",
    nombre: "Roberto",
    apellido: "López",
    nroDocumento: "20345678",
    fechaNacimiento: "1970-03-22",
    sexo: "Hombre",
    ciudad: "Córdoba",
    calle: "Rivadavia",
    altura: "654",
    fechaAlta: "2022-09-10",
    obraSocial: "Jerárquicos Salud",
    nroAfiliadoObraSocial: "JS-20345678",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3517778899"],
    correos: ["roberto.lopez@example.com"],
  },
  {
    id: "6",
    nombre: "Laura",
    apellido: "Fernández",
    nroDocumento: "56789012",
    fechaNacimiento: "1995-12-30",
    sexo: "Otro",
    ciudad: "Rafaela",
    calle: "Belgrano",
    altura: "147",
    fechaAlta: "2024-02-20",
    fechaBaja: "2024-10-15",
    plan: "B",
    sepelio: "NO",
    cobrador: "NO",
    telefonos: ["3492223344"],
    correos: ["laura.fernandez@example.com"],
  },
  {
    id: "7",
    nombre: "Diego",
    apellido: "García",
    nroDocumento: "67890123",
    fechaNacimiento: "1988-07-14",
    sexo: "Hombre",
    ciudad: "Venado Tuerto",
    calle: "Mitre",
    altura: "258",
    fechaAlta: "2023-11-05",
    obraSocial: "OSDE",
    nroAfiliadoObraSocial: "OSDE-67890123",
    plan: "A",
    sepelio: "SI",
    cobrador: "NO",
    telefonos: ["3462556677"],
    correos: ["diego.garcia@example.com"],
  },
  {
    id: "8",
    nombre: "Patricia",
    apellido: "Sánchez",
    nroDocumento: "78901234",
    fechaNacimiento: "1973-04-05",
    sexo: "Mujer",
    ciudad: "Rosario",
    calle: "Oroño",
    altura: "951",
    fechaAlta: "2022-01-15",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-78901234",
    plan: "B",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3418889900", "3411122334"],
    correos: ["patricia.sanchez@example.com", "patricia@personal.com"],
  },
  {
    id: "9",
    nombre: "Fernando",
    apellido: "Torres",
    nroDocumento: "20456789",
    fechaNacimiento: "1965-09-18",
    sexo: "Hombre",
    ciudad: "Firmat",
    calle: "Sarmiento",
    altura: "753",
    fechaAlta: "2023-04-01",
    fechaBaja: "2024-06-30",
    obraSocial: "IAPOS",
    nroAfiliadoObraSocial: "IAPOS-20456789",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3464778899"],
    correos: ["fernando.torres@example.com"],
  },
  {
    id: "10",
    nombre: "Verónica",
    apellido: "Ruiz",
    nroDocumento: "89012345",
    fechaNacimiento: "1992-11-25",
    sexo: "Mujer",
    ciudad: "Cañada de Gómez",
    calle: "Buenos Aires",
    altura: "486",
    fechaAlta: "2024-08-12",
    obraSocial: "Jerárquicos Salud",
    nroAfiliadoObraSocial: "JS-89012345",
    plan: "B",
    sepelio: "NO",
    cobrador: "NO",
    observaciones: "Socio desde agosto de 2024.",
    telefonos: ["3471556677"],
    correos: ["veronica.ruiz@example.com"],
    codeudores: [
      { id: "1", nombre: "Juan", apellido: "Pérez", nroDocumento: "12345678" },
      { id: "4", nombre: "Ana", apellido: "Martínez", nroDocumento: "45678901" },
    ],
  },
];

export const MOCK_USUARIOS = [
  {
    id_Usuario: 1,
    usuarioNombre: "CJR",
    usuario: "CJR",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "ACTIVO",
    descripcion: "Solo acceso a informes",
  },
  {
    id_Usuario: 2,
    usuarioNombre: "ADMIN_SISTEMA",
    usuario: "ADMIN_SISTEMA",
    rolNombre: "Secretaria",
    rol: "SECRETARIO",
    estado: "ACTIVO",
    descripcion: "Acceso total",
  },
  {
    id_Usuario: 3,
    usuarioNombre: "MPEREZ",
    usuario: "MPEREZ",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "ACTIVO",
    descripcion: "Solo informes",
  },
  {
    id_Usuario: 4,
    usuarioNombre: "JALVAREZ",
    usuario: "JALVAREZ",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "BAJA",
    descripcion: "Usuario inactivo",
  },
];

export const MOCK_PROVEEDORES = [
  {
    id_Proveedor: 1,
    cuitCuil: "30712345678",
    razonSocial: "Emergencias Médicas S.A.",
    prestacion: "Servicio de ambulancia y traslados",
    estado: "Activo",
    fechaNacimiento: "2010-03-15",
    ciudad: "Rosario",
    calle: "Córdoba",
    altura: 1540,
    observaciones: "Convenio vigente de emergencias",
    telefonos: ["3414201000", "3414201001"],
    emails: ["guardia@emergencias.com.ar"],
  },
  {
    id_Proveedor: 2,
    cuitCuil: "27254443334",
    razonSocial: "Dra. Marcela González",
    prestacion: "Atención médica clínica",
    estado: "Activo",
    fechaNacimiento: "1978-09-20",
    ciudad: "Roldán",
    calle: "San Martín",
    altura: 420,
    observaciones: "Consultorio lunes a jueves",
    telefonos: ["3413456789"],
    emails: ["marcelagonzalez@gmail.com"],
  },
  {
    id_Proveedor: 3,
    cuitCuil: "30558889992",
    razonSocial: "Ortopedia Central",
    prestacion: "Insumos ortopédicos y sillas de ruedas",
    estado: "Inactivo",
    fechaNacimiento: "2015-06-01",
    ciudad: "Funes",
    calle: "Santa Fe",
    altura: 1200,
    observaciones: "Contrato pausado",
    telefonos: ["3414930000"],
    emails: ["ventas@ortopediacentral.com"],
  },
];

export const MOCK_NICHOS = [
  {
    id_Nicho: 1,
    id_Entidad: 1,
    entidadNombre: "Oldan, Luciano",
    nroNicho: "45",
    sector: "A",
    ocupado: "SI",
    conLapida: "SI",
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interesMensual: 0.05,
    interes: 0.05,
    socio: {
      id_Socio: 1,
      nombre: "Luciano",
      apellido: "Oldan",
    },
  },
  {
    id_Nicho: 2,
    id_Entidad: null,
    entidadNombre: null,
    nroNicho: "46",
    sector: "A",
    ocupado: "NO",
    conLapida: "NO",
    valorNicho: 50000,
    valorLapida: 0,
    cuotas: 0,
    interesMensual: 0,
    interes: 0,
    socio: null,
  },
  {
    id_Nicho: 3,
    id_Entidad: 2,
    entidadNombre: "Gómez, María",
    nroNicho: "12",
    sector: "B",
    ocupado: "SI",
    conLapida: "SI",
    valorNicho: 60000,
    valorLapida: 18000,
    cuotas: 24,
    interesMensual: 0.08,
    interes: 0.08,
    socio: {
      id_Socio: 2,
      nombre: "María",
      apellido: "Gómez",
    },
  },
  {
    id_Nicho: 4,
    id_Entidad: null,
    entidadNombre: null,
    nroNicho: "13",
    sector: "B",
    ocupado: "NO",
    conLapida: "NO",
    valorNicho: 60000,
    valorLapida: 0,
    cuotas: 0,
    interesMensual: 0,
    interes: 0,
    socio: null,
  },
];

export const MOCK_COLABORADORES = [
  {
    id_Colaborador: 1,
    id_Entidad: 10,
    tipoDocumento: "DNI",
    documento: "28111222",
    dni: "28111222",
    cuitCuil: null,
    nombre: "Esteban",
    apellido: "Quito",
    razonSocial: null,
    sexo: "Hombre",
    nacimiento: "1980-04-12",
    fechaNacimiento: "1980-04-12",
    prestacion: "Atención Médica",
    idPrestacion: 1,
    estado: "Activo",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Corrientes",
    altura: 450,
    observacion: "Atiende por la mañana",
    telefonos: ["3414556677"],
    emails: ["esteban.quito@example.com"],
  },
  {
    id_Colaborador: 2,
    id_Entidad: 11,
    tipoDocumento: "CUIT",
    documento: "30708090102",
    dni: null,
    cuitCuil: "30708090102",
    nombre: "Farmacia",
    apellido: "Central",
    razonSocial: "Farmacia Central S.R.L.",
    sexo: "-",
    nacimiento: "2012-08-20",
    fechaNacimiento: "2012-08-20",
    prestacion: "Farmacia",
    idPrestacion: 2,
    estado: "Inactivo",
    ciudad: { id_Ciudad: 1, nombre: "Buenos Aires" },
    calle: "Rivadavia",
    altura: 1200,
    observacion: null,
    telefonos: ["1144556677"],
    emails: ["contacto@farmaciacentral.com"],
  },
];

export const MOCK_EMPLEADOS = [
  {
    id_Entidad: 101,
    id_EntidadTipo: 101,
    dni: "31222333",
    cuitCuil: "20312223334",
    nombre: "Carlos",
    apellido: "López",
    sexo: "Masculino",
    nacimiento: "1988-04-12",
    estado: "Activo",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Pellegrini",
    altura: 1240,
    observacion: "Empleado del área contable",
    telefonos: ["3414998877"],
    emails: ["carlos.lopez@example.com"],
  },
  {
    id_Entidad: 102,
    id_EntidadTipo: 102,
    dni: "32444555",
    cuitCuil: "27324445558",
    nombre: "Mariana",
    apellido: "Ríos",
    sexo: "Femenino",
    nacimiento: "1992-09-20",
    estado: "Inactivo",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Corrientes",
    altura: 780,
    observacion: null,
    telefonos: ["3415123456"],
    emails: ["mariana.rios@example.com"],
  },
];

export const MOCK_SOCIOS_ASIGNABLES_NICHO = [
  {
    idSocio: 1,
    idEntidad: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
  },
  {
    idSocio: 2,
    idEntidad: 2,
    nombre: "María",
    apellido: "Gómez",
    dni: "20123456",
  },
  {
    idSocio: 4,
    idEntidad: 4,
    nombre: "Ana",
    apellido: "Martínez",
    dni: "45678901",
  },
  {
    idSocio: 5,
    idEntidad: 5,
    nombre: "Roberto",
    apellido: "López",
    dni: "20345678",
  },
];

export const MOCK_ENTIDADES = [
  {
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
  },
  {
    id_Entidad: 2,
    cuitCuil: "27201234564",
    nombre: "María",
    apellido: "Gómez",
    razonSocial: null,
    sexo: "Mujer",
    nacimiento: "1985-05-15",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Mitre",
    altura: 450,
    observacion: null,
  },
  {
    id_Entidad: 3,
    cuitCuil: "30712345678",
    nombre: "",
    apellido: "",
    razonSocial: "Emergencias Médicas S.A.",
    sexo: "-",
    nacimiento: "2010-03-15",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Córdoba",
    altura: 1540,
    observacion: "Proveedor de salud",
  },
];

export const MOCK_CONFIGURACION_CUOTAS = [
  {
    id_TipoCuota: 1,
    concepto: "SOCIO",
    importe: 4500,
    edad: "SIN TOPE",
    plan: "-",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 2,
    concepto: "SEPELIO",
    importe: 10000,
    edad: "HASTA 65",
    plan: "A",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 3,
    concepto: "SEPELIO",
    importe: 12000,
    edad: "HASTA 65",
    plan: "B",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 4,
    concepto: "SEPELIO",
    importe: 12000,
    edad: "MAS DE 65",
    plan: "A",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 5,
    concepto: "SEPELIO",
    importe: 14000,
    edad: "MAS DE 65",
    plan: "B",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
  {
    id_TipoCuota: 6,
    concepto: "NICHO",
    importe: 300000,
    edad: "SIN TOPE",
    plan: "-",
    ultimaModificacion: "2026-03-10T00:00:00",
  },
];

export function getMockResponse(endpoint: string, options?: RequestInit): unknown {
  if (endpoint === "/me" || endpoint.startsWith("/me")) {
    return {
      id_Usuario: MOCK_USUARIO.id_Usuario,
      usuarioNombre: MOCK_USUARIO.usuarioNombre,
      estado: MOCK_USUARIO.estado,
      id_Rol: MOCK_USUARIO.id_Rol,
      rolNombre: MOCK_USUARIO.rolNombre,
      nombre: MOCK_USUARIO.nombre,
      rol: MOCK_USUARIO.rol,
    };
  }
  if (endpoint === "/socios/crear") {
    return { idSocio: 14 };
  }
  if (endpoint === "/socios/baja") {
    return { mensaje: "El socio fue dado de baja correctamente." };
  }
  if (endpoint === "/socios/modificar") {
    let body: {
      idSocio?: number;
      calle?: string;
      altura?: number;
      observaciones?: string;
      plan?: string;
      sepelio?: string;
      cobrador?: string;
      telefonos?: string[];
      emails?: string[];
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const socio = MOCK_SOCIOS_DETALLE.find((s) => s.id === String(body.idSocio));
    if (socio) {
      socio.calle = body.calle ?? socio.calle;
      socio.altura = body.altura ? String(body.altura) : socio.altura;
      socio.observaciones = body.observaciones ?? socio.observaciones;
      socio.plan = body.plan ?? socio.plan;
      socio.sepelio = body.sepelio ?? socio.sepelio;
      socio.cobrador = body.cobrador ?? socio.cobrador;
      if (body.telefonos) socio.telefonos = body.telefonos;
      if (body.emails) socio.correos = body.emails;
    }
    return { mensaje: "El socio fue modificado correctamente." };
  }
  if (endpoint === "/socios") {
    let filtro: { busqueda?: string; dni?: string; incluirInactivos?: boolean } = {};
    if (options?.body) {
      try {
        filtro = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    let result = [...MOCK_SOCIOS_BACKEND];
    if (filtro.incluirInactivos === false) {
      result = result.filter((s) => s.estado === "ACTIVO");
    }
    if (filtro.busqueda) {
      const b = filtro.busqueda.toLowerCase().trim();
      result = result.filter(
        (s) => s.nombre.toLowerCase().includes(b) || s.apellido.toLowerCase().includes(b)
      );
    }
    if (filtro.dni) {
      const d = filtro.dni.trim();
      result = result.filter((s) => s.dni.includes(d));
    }
    return result;
  }
  if (endpoint.startsWith("/socios/asignables-nicho")) {
    const query = endpoint.includes("?") ? endpoint.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const busqueda = (params.get("busqueda") || "").toLowerCase().trim();
    if (!busqueda) return MOCK_SOCIOS_ASIGNABLES_NICHO;
    return MOCK_SOCIOS_ASIGNABLES_NICHO.filter(
      (s) =>
        s.nombre.toLowerCase().includes(busqueda) ||
        s.apellido.toLowerCase().includes(busqueda) ||
        s.dni.includes(busqueda)
    );
  }
  if (endpoint.startsWith("/socios/")) {
    const id = endpoint.split("/socios/")[1];
    const socio = MOCK_SOCIOS_DETALLE.find((s) => s.id === id);
    if (!socio) {
      throw new Error(`No se encontró el socio solicitado.`);
    }
    return {
      idSocio: Number(socio.id),
      tipoDocumento: "DNI",
      dni: socio.nroDocumento,
      nombre: socio.nombre,
      apellido: socio.apellido,
      fechaNacimiento: socio.fechaNacimiento,
      sexo: socio.sexo,
      idCiudad: 1,
      ciudad: socio.ciudad,
      calle: socio.calle,
      altura: Number(socio.altura) || 0,
      observaciones: socio.observaciones ?? null,
      estado: socio.fechaBaja ? "INACTIVO" : "ACTIVO",
      fechaAlta: socio.fechaAlta,
      fechaBaja: socio.fechaBaja ?? null,
      idObraSocial: socio.obraSocial ? 1 : null,
      obraSocial: socio.obraSocial ?? null,
      numeroAfiliado: socio.nroAfiliadoObraSocial ?? "",
      plan: socio.plan,
      sepelio: socio.sepelio ?? "NO",
      cobrador: socio.cobrador ?? "NO",
      telefonos: socio.telefonos,
      emails: socio.correos,
      codeudores: socio.codeudores,
    };
  }
  if (endpoint === "/usuarios/alta") {
    return {
      id_Usuario: 5,
      usuarioNombre: "nuevo",
      password: "$2a$11$mockhash",
      estado: "Activo",
      id_Rol: 1,
      rol: { id_Rol: 1, rolNombre: "Secretaria", descripcion: "Secretaria" },
    };
  }
  if (endpoint.startsWith("/usuarios/baja/")) {
    return { mensaje: "Usuario dado de baja correctamente", usuario: {} };
  }
  if (endpoint.startsWith("/usuarios/modificar/")) {
    return { mensaje: "Usuario modificado correctamente", usuario: {} };
  }
  if (endpoint === "/usuarios" || endpoint.startsWith("/usuarios/buscar") || endpoint.startsWith("/usuarios")) {
    return MOCK_USUARIOS;
  }
  if (endpoint.startsWith("/ciudades/buscar")) {
    const queryIdx = endpoint.indexOf("?");
    let busqueda = "";
    if (queryIdx !== -1) {
      const params = new URLSearchParams(endpoint.slice(queryIdx));
      busqueda = (params.get("Busqueda") || params.get("busqueda") || "").toLowerCase().trim();
    }
    const filtered = busqueda
      ? MOCK_CIUDADES.filter((c) => c.nombre.toLowerCase().includes(busqueda))
      : MOCK_CIUDADES;
    return filtered.map((c) => ({ id_Ciudad: Number(c.id), nombre: c.nombre }));
  }
  if (endpoint.startsWith("/obrassociales/buscar")) {
    const queryIdx = endpoint.indexOf("?");
    let busqueda = "";
    if (queryIdx !== -1) {
      const params = new URLSearchParams(endpoint.slice(queryIdx));
      busqueda = (params.get("Busqueda") || params.get("busqueda") || "").toLowerCase().trim();
    }
    const filtered = busqueda
      ? MOCK_OBRAS_SOCIALES.filter((o) => o.nombre.toLowerCase().includes(busqueda))
      : MOCK_OBRAS_SOCIALES;
    return filtered.map((o) => ({ id_ObraSocial: Number(o.id), nombreObraSocial: o.nombre }));
  }
  if (endpoint.startsWith("/buscarentidad/buscar")) {
    const queryIdx = endpoint.indexOf("?");
    let busqueda = "";
    if (queryIdx !== -1) {
      const params = new URLSearchParams(endpoint.slice(queryIdx));
      busqueda = (params.get("Busqueda") || params.get("busqueda") || params.get("filtro") || "").toLowerCase().trim();
    }
    const filtered = busqueda
      ? MOCK_ENTIDADES.filter((e) =>
          e.nombre.toLowerCase().includes(busqueda) ||
          e.apellido.toLowerCase().includes(busqueda) ||
          e.cuitCuil.includes(busqueda)
        )
      : MOCK_ENTIDADES;
    return filtered;
  }
  if (endpoint.startsWith("/buscarentidad")) {
    return MOCK_ENTIDADES[0];
  }
  if (endpoint === "/codeudores/crear") {
    return { idEntidad: 15 };
  }
  if (endpoint.startsWith("/proveedores/crear")) {
    return { idProveedor: 4 };
  }
  if (endpoint.startsWith("/proveedores/baja")) {
    let id: number | undefined;
    if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {
        // fallback
      }
    }
    if (id) {
      const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
      if (found) {
        found.estado = "Inactivo";
      }
    }
    return { mensaje: "Proveedor dado de baja correctamente" };
  }
  if (endpoint.startsWith("/proveedores/reactivar")) {
    let id: number | undefined;
    if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {
        // fallback
      }
    }
    if (id) {
      const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
      if (found) {
        found.estado = "Activo";
      }
    }
    return { mensaje: "Proveedor reactivado correctamente" };
  }
  if (endpoint.startsWith("/proveedores/eliminar") || (endpoint.match(/^\/proveedores\/\d+$/) && options?.method === "DELETE")) {
    let id: number | undefined;
    const match = endpoint.match(/^\/proveedores\/(\d+)$/);
    if (match) {
      id = Number(match[1]);
    } else if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {}
    }
    if (id) {
      const idx = MOCK_PROVEEDORES.findIndex((p) => p.id_Proveedor === id);
      if (idx !== -1) {
        MOCK_PROVEEDORES.splice(idx, 1);
      }
    }
    return { mensaje: "Proveedor eliminado correctamente" };
  }
  if (endpoint.startsWith("/proveedores/modificar")) {
    return { mensaje: "Proveedor modificado correctamente" };
  }
  if (endpoint.match(/^\/proveedores\/\d+$/)) {
    const id = Number(endpoint.replace("/proveedores/", ""));
    const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
    return found || MOCK_PROVEEDORES[0];
  }
  if (endpoint.startsWith("/proveedores")) {
    const queryIdx = endpoint.indexOf("?");
    let busqueda = "";
    if (queryIdx !== -1) {
      const params = new URLSearchParams(endpoint.slice(queryIdx));
      busqueda = (params.get("Busqueda") || params.get("busqueda") || params.get("filtro") || "").toLowerCase().trim();
    }
    const filtered = busqueda
      ? MOCK_PROVEEDORES.filter((p) =>
          (p.razonSocial && p.razonSocial.toLowerCase().includes(busqueda)) ||
          p.cuitCuil.includes(busqueda)
        )
      : MOCK_PROVEEDORES;
    return filtered;
  }
  if (endpoint === "/nichos/crear") {
    let body: { sector?: string; nroNicho?: string } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const nextId = Math.max(...MOCK_NICHOS.map((n) => n.id_Nicho), 0) + 1;
    const nuevo = {
      id_Nicho: nextId,
      id_Entidad: null,
      entidadNombre: null,
      sector: String(body.sector || "A"),
      nroNicho: String(body.nroNicho || nextId),
      valorNicho: 0,
      valorLapida: 0,
      conLapida: "NO",
      ocupado: "NO",
      cuotas: 0,
      interesMensual: 0,
      interes: 0,
      socio: null,
    };
    MOCK_NICHOS.push(nuevo);
    return { idNicho: nextId };
  }
  if (endpoint === "/nichos/baja") {
    let body: { idNicho?: number } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const idx = MOCK_NICHOS.findIndex((n) => n.id_Nicho === body.idNicho);
    if (idx !== -1) {
      MOCK_NICHOS.splice(idx, 1);
    }
    return { mensaje: "El nicho fue eliminado correctamente." };
  }
  if (endpoint === "/nichos/asignar") {
    let body: {
      idNicho?: number;
      idEntidad?: number;
      valorTotal?: number;
      cuotas?: number;
      interesPorCuota?: number;
      conLapida?: string;
      valorLapida?: number;
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const nicho = MOCK_NICHOS.find((n) => n.id_Nicho === body.idNicho);
    if (nicho) {
      nicho.ocupado = "SI";
      nicho.id_Entidad = body.idEntidad ?? null;
      const socioFound = MOCK_SOCIOS_ASIGNABLES_NICHO.find((s) => s.idEntidad === body.idEntidad);
      if (socioFound) {
        nicho.entidadNombre = `${socioFound.apellido}, ${socioFound.nombre}`;
        nicho.socio = {
          id_Socio: socioFound.idSocio,
          nombre: socioFound.nombre,
          apellido: socioFound.apellido,
        };
      }
      nicho.valorNicho = Number(body.valorTotal) || 0;
      nicho.cuotas = Number(body.cuotas) || 0;
      nicho.interesMensual = Number(body.interesPorCuota) || 0;
      nicho.interes = nicho.interesMensual;
      nicho.conLapida = body.conLapida === "SI" ? "SI" : "NO";
      nicho.valorLapida = Number(body.valorLapida) || 0;
    }
    return { mensaje: "El nicho fue asignado correctamente." };
  }
  if (endpoint.startsWith("/nichos/buscar") || endpoint.startsWith("/nichos")) {
    const query = endpoint.includes("?") ? endpoint.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const busqueda = (params.get("Busqueda") || params.get("busqueda") || "").toLowerCase().trim();
    const sectorNumero = (params.get("SectorNumero") || params.get("sectorNumero") || "").toLowerCase().trim();
    const ocupadoParam = params.get("Ocupado") || params.get("ocupado");

    let result = [...MOCK_NICHOS];
    if (busqueda) {
      result = result.filter(
        (n) =>
          (n.entidadNombre && n.entidadNombre.toLowerCase().includes(busqueda)) ||
          (n.socio &&
            (n.socio.nombre.toLowerCase().includes(busqueda) ||
              n.socio.apellido.toLowerCase().includes(busqueda)))
      );
    }
    if (sectorNumero) {
      result = result.filter(
        (n) =>
          n.sector.toLowerCase().includes(sectorNumero) ||
          String(n.nroNicho).includes(sectorNumero)
      );
    }
    if (ocupadoParam !== null && ocupadoParam !== undefined) {
      const soloLibres = ocupadoParam === "false";
      if (soloLibres) {
        result = result.filter((n) => n.ocupado === "NO" || String(n.ocupado).toUpperCase() === "NO");
      }
    }
    return result;
  }
  if (endpoint.startsWith("/configuracion-cuotas/modificar-socio")) {
    let body: { id_TipoCuota?: number; importe?: number } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const cuota = MOCK_CONFIGURACION_CUOTAS.find((c) => c.id_TipoCuota === body.id_TipoCuota);
    if (cuota) {
      cuota.importe = Number(body.importe);
      cuota.ultimaModificacion = new Date().toISOString();
    }
    return { mensaje: "El importe de la cuota de socio fue modificado correctamente." };
  }
  if (endpoint.startsWith("/configuracion-cuotas/modificar-sepelio-con-tope")) {
    let body: { id_TipoCuota?: number; importe?: number; edadTope?: number } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const cuota = MOCK_CONFIGURACION_CUOTAS.find((c) => c.id_TipoCuota === body.id_TipoCuota);
    if (cuota) {
      cuota.importe = Number(body.importe);
      cuota.edad = `HASTA ${body.edadTope}`;
      cuota.ultimaModificacion = new Date().toISOString();
      const hermana = MOCK_CONFIGURACION_CUOTAS.find(
        (c) => c.concepto === "SEPELIO" && c.plan === cuota.plan && c.edad.startsWith("MAS DE")
      );
      if (hermana) {
        hermana.edad = `MAS DE ${body.edadTope}`;
      }
    }
    return { mensaje: "La cuota de sepelio (con tope) fue modificada correctamente." };
  }
  if (endpoint.startsWith("/configuracion-cuotas/modificar-sepelio-sin-tope")) {
    let body: { id_TipoCuota?: number; importe?: number } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const cuota = MOCK_CONFIGURACION_CUOTAS.find((c) => c.id_TipoCuota === body.id_TipoCuota);
    if (cuota) {
      cuota.importe = Number(body.importe);
      cuota.ultimaModificacion = new Date().toISOString();
    }
    return { mensaje: "La cuota de sepelio (más de) fue modificada correctamente." };
  }
  if (endpoint.startsWith("/configuracion-cuotas")) {
    const query = endpoint.includes("?") ? endpoint.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const concepto = params.get("Concepto") || params.get("concepto");
    if (concepto && concepto.toLowerCase() !== "todos") {
      return MOCK_CONFIGURACION_CUOTAS.filter(
        (c) => c.concepto.toLowerCase() === concepto.toLowerCase()
      );
    }
    return MOCK_CONFIGURACION_CUOTAS;
  }
  if (endpoint === "/colaboradores/crear") {
    let body: {
      tipoDocumento?: string;
      documento?: string;
      nombre?: string;
      apellido?: string;
      razonSocial?: string;
      fechaNacimiento?: string;
      prestacion?: string;
      idPrestacion?: number;
      idCiudad?: number;
      calle?: string;
      altura?: number;
      observaciones?: string;
      telefonos?: string[];
      emails?: string[];
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const nextColabId = Math.max(...MOCK_COLABORADORES.map((c) => c.id_Colaborador), 0) + 1;
    const nextEntidadId = Math.max(...MOCK_COLABORADORES.map((c) => c.id_Entidad), 0) + 1;
    const nuevo = {
      id_Colaborador: nextColabId,
      id_Entidad: nextEntidadId,
      tipoDocumento: body.tipoDocumento || "DNI",
      documento: body.documento || "",
      dni: body.tipoDocumento === "DNI" ? body.documento : null,
      cuitCuil: body.tipoDocumento === "CUIT" ? body.documento : null,
      nombre: body.nombre || "",
      apellido: body.apellido || "",
      razonSocial: body.razonSocial || null,
      sexo: "Otro",
      nacimiento: body.fechaNacimiento || "1990-01-01",
      fechaNacimiento: body.fechaNacimiento || "1990-01-01",
      prestacion: body.prestacion || "Atención Médica",
      idPrestacion: body.idPrestacion || 1,
      estado: "Activo",
      ciudad: { id_Ciudad: body.idCiudad || 1, nombre: "Rosario" },
      calle: body.calle || "",
      altura: Number(body.altura) || 0,
      observacion: body.observaciones || null,
      telefonos: body.telefonos || [],
      emails: body.emails || [],
    };
    MOCK_COLABORADORES.push(nuevo as any);
    return { idColaborador: nextColabId };
  }
  if (endpoint.startsWith("/colaboradores/baja/")) {
    const idEntidadTipo = Number(endpoint.replace("/colaboradores/baja/", ""));
    const colab = MOCK_COLABORADORES.find(
      (c) => c.id_Colaborador === idEntidadTipo || c.id_Entidad === idEntidadTipo
    );
    if (colab) {
      colab.estado = "Inactivo";
    }
    return { mensaje: "Colaborador dado de baja correctamente" };
  }
  if (endpoint.startsWith("/colaboradores/reactivar")) {
    let body: { idEntidad?: number } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const colab = MOCK_COLABORADORES.find(
      (c) => c.id_Entidad === body.idEntidad || c.id_Colaborador === body.idEntidad
    );
    if (colab) {
      colab.estado = "Activo";
    }
    return { mensaje: "El colaborador fue reactivado correctamente." };
  }
  if (endpoint.startsWith("/colaboradores/modificar")) {
    let body: {
      idEntidad?: number;
      nombre?: string;
      apellido?: string;
      razonSocial?: string;
      calle?: string;
      altura?: number;
      observaciones?: string;
      telefonos?: string[];
      emails?: string[];
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const colab = MOCK_COLABORADORES.find(
      (c) => c.id_Entidad === body.idEntidad || c.id_Colaborador === body.idEntidad
    );
    if (colab) {
      colab.nombre = body.nombre ?? colab.nombre;
      colab.apellido = body.apellido ?? colab.apellido;
      colab.razonSocial = body.razonSocial ?? colab.razonSocial;
      colab.calle = body.calle ?? colab.calle;
      colab.altura = body.altura ?? colab.altura;
      colab.observacion = body.observaciones ?? colab.observacion;
      if (body.telefonos) colab.telefonos = body.telefonos;
      if (body.emails) colab.emails = body.emails;
    }
    return { mensaje: "El colaborador fue modificado correctamente." };
  }
  if (endpoint.match(/^\/colaboradores\/\d+$/)) {
    const id = Number(endpoint.replace("/colaboradores/", ""));
    const found = MOCK_COLABORADORES.find(
      (c) => c.id_Entidad === id || c.id_Colaborador === id
    );
    return found || MOCK_COLABORADORES[0];
  }
  if (endpoint.startsWith("/colaboradores/buscar") || endpoint.startsWith("/colaboradores")) {
    const query = endpoint.includes("?") ? endpoint.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const busqueda = (params.get("busqueda") || "").toLowerCase().trim();
    if (!busqueda) return MOCK_COLABORADORES;
    return MOCK_COLABORADORES.filter(
      (c) =>
        (c.nombre && c.nombre.toLowerCase().includes(busqueda)) ||
        (c.apellido && c.apellido.toLowerCase().includes(busqueda)) ||
        (c.razonSocial && c.razonSocial.toLowerCase().includes(busqueda)) ||
        (c.dni && c.dni.includes(busqueda)) ||
        (c.cuitCuil && c.cuitCuil.includes(busqueda))
    );
  }
  if (endpoint.startsWith("/Empleados/alta") || endpoint.startsWith("/empleados/alta")) {
    let body: {
      dni?: string;
      nombre?: string;
      apellido?: string;
      sexo?: string;
      nacimiento?: string;
      idCiudad?: number;
      calle?: string;
      altura?: number;
      observaciones?: string;
      telefonos?: string[];
      emails?: string[];
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const nextId =
      MOCK_EMPLEADOS.length > 0
        ? Math.max(...MOCK_EMPLEADOS.map((e) => e.id_Entidad)) + 1
        : 101;
    const nuevo = {
      id_Entidad: nextId,
      id_EntidadTipo: nextId,
      dni: body.dni || "",
      cuitCuil: body.dni ? `20${body.dni}9` : null,
      nombre: body.nombre || "",
      apellido: body.apellido || "",
      sexo: body.sexo || "Otro",
      nacimiento: body.nacimiento || "1990-01-01",
      estado: "Activo",
      ciudad: { id_Ciudad: body.idCiudad || 1, nombre: "Rosario" },
      calle: body.calle || "",
      altura: Number(body.altura) || 0,
      observacion: body.observaciones || null,
      telefonos: body.telefonos || [],
      emails: body.emails || [],
    };
    MOCK_EMPLEADOS.push(nuevo as any);
    return { id: nextId, mensaje: `Empleado ${body.nombre} ${body.apellido} creado correctamente.` };
  }
  if (endpoint.startsWith("/Empleados/baja/") || endpoint.startsWith("/empleados/baja/")) {
    const rawId = endpoint.replace(/^\/[eE]mpleados\/baja\//, "");
    const idEntidadTipo = Number(rawId);
    let motivo = "Baja solicitada";
    if (options?.body) {
      try {
        const parsed = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        if (parsed.motivo) motivo = parsed.motivo;
      } catch {}
    }
    const emp = MOCK_EMPLEADOS.find(
      (e) => e.id_EntidadTipo === idEntidadTipo || e.id_Entidad === idEntidadTipo
    );
    if (emp) {
      emp.estado = "Inactivo";
    }
    return { mensaje: `Empleado dado de baja correctamente con motivo: ${motivo}` };
  }
  if (endpoint.startsWith("/Empleados/modificar") || endpoint.startsWith("/empleados/modificar")) {
    let body: {
      idEntidad?: number;
      nombre?: string;
      apellido?: string;
      sexo?: string;
      nacimiento?: string;
      idCiudad?: number;
      calle?: string;
      altura?: number;
      observaciones?: string;
      telefonos?: string[];
      emails?: string[];
    } = {};
    if (options?.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch {}
    }
    const emp = MOCK_EMPLEADOS.find((e) => e.id_Entidad === body.idEntidad);
    if (emp) {
      emp.nombre = body.nombre ?? emp.nombre;
      emp.apellido = body.apellido ?? emp.apellido;
      emp.sexo = body.sexo ?? emp.sexo;
      emp.nacimiento = body.nacimiento ?? emp.nacimiento;
      emp.calle = body.calle ?? emp.calle;
      emp.altura = body.altura ?? emp.altura;
      emp.observacion = body.observaciones ?? emp.observacion;
      if (body.telefonos) emp.telefonos = body.telefonos;
      if (body.emails) emp.emails = body.emails;
    }
    return { mensaje: `Empleado ${body.idEntidad} modificado correctamente.` };
  }
  if (endpoint.match(/^\/[eE]mpleados\/\d+$/)) {
    const id = Number(endpoint.replace(/^\/[eE]mpleados\//, ""));
    const found = MOCK_EMPLEADOS.find(
      (e) => e.id_Entidad === id || e.id_EntidadTipo === id
    );
    return found || MOCK_EMPLEADOS[0];
  }
  if (endpoint.startsWith("/Empleados/buscar") || endpoint.startsWith("/empleados/buscar") || endpoint.startsWith("/Empleados") || endpoint.startsWith("/empleados")) {
    const query = endpoint.includes("?") ? endpoint.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const busqueda = (params.get("busqueda") || "").toLowerCase().trim();
    if (!busqueda) return MOCK_EMPLEADOS;
    return MOCK_EMPLEADOS.filter(
      (e) =>
        (e.nombre && e.nombre.toLowerCase().includes(busqueda)) ||
        (e.apellido && e.apellido.toLowerCase().includes(busqueda)) ||
        (e.dni && e.dni.includes(busqueda)) ||
        (e.cuitCuil && e.cuitCuil.includes(busqueda))
    );
  }
  throw new Error(`No hay mock definido para el endpoint: ${endpoint}`);
}
