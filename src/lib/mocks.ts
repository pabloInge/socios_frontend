import type { SocioListItem } from "@/app/dashboard/socios/actions";

export const MOCK_USUARIO = {
  logueado: true,
  nombre: "Juan Pérez",
  rol: "admin",
};

export const MOCK_SOCIOS: SocioListItem[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "DNI",
    nroDocumento: "12345678",
    obraSocial: "PAMI",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    tipoDocumento: "CUIT",
    nroDocumento: "20123456789",
    obraSocial: "OSDE",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    tipoDocumento: "DNI",
    nroDocumento: "34567890",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    tipoDocumento: "DNI",
    nroDocumento: "45678901",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Roberto",
    apellido: "López",
    tipoDocumento: "CUIT",
    nroDocumento: "20345678901",
    obraSocial: "Jerárquicos Salud",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "6",
    nombre: "Laura",
    apellido: "Fernández",
    tipoDocumento: "DNI",
    nroDocumento: "56789012",
    obraSocial: null,
    plan: "B",
    estado: "Baja",
  },
  {
    id: "7",
    nombre: "Diego",
    apellido: "García",
    tipoDocumento: "DNI",
    nroDocumento: "67890123",
    obraSocial: "OSDE",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "8",
    nombre: "Patricia",
    apellido: "Sánchez",
    tipoDocumento: "DNI",
    nroDocumento: "78901234",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "9",
    nombre: "Fernando",
    apellido: "Torres",
    tipoDocumento: "CUIT",
    nroDocumento: "20456789012",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "10",
    nombre: "Verónica",
    apellido: "Ruiz",
    tipoDocumento: "DNI",
    nroDocumento: "89012345",
    obraSocial: "Jerárquicos Salud",
    plan: "B",
    estado: "Activo",
  },
];

export function getMockResponse(endpoint: string): unknown {
  if (endpoint === "/me" || endpoint.startsWith("/me")) {
    return { nombre: MOCK_USUARIO.nombre, rol: MOCK_USUARIO.rol };
  }
  if (endpoint === "/socios" || endpoint.startsWith("/socios")) {
    return MOCK_SOCIOS;
  }
  throw new Error(`No hay mock definido para el endpoint: ${endpoint}`);
}
