"use server"

import { redirect } from 'next/navigation';
import { SocioFormData } from './schema';
import { clearSociosCache } from '../actions';

const MOCK_SOCIOS: (SocioFormData & { id: string })[] = [
  {
    id: "1",
    tipoDocumento: "DNI",
    nroDocumento: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    fechaNacimiento: "1990-01-01",
    ciudad: "Buenos Aires",
    calle: "Falsa",
    altura: "123",
    fechaAlta: "2024-01-01",
    obraSocial: "PAMI",
    plan: "A",
    sepelio: "SI",
    cobrador: "NO",
    telefonos: ["3412345678"],
    correos: ["juan.perez@example.com"],
  },
  {
    id: "2",
    tipoDocumento: "CUIT",
    nroDocumento: "20123456789",
    nombre: "María",
    apellido: "Gómez",
    fechaNacimiento: "1985-05-15",
    ciudad: "Rosario",
    calle: "Córdoba",
    altura: "456",
    fechaAlta: "2023-06-12",
    obraSocial: "OSDE",
    plan: "B",
    sepelio: "NO",
    cobrador: "SI",
    telefonos: ["3418765432"],
    correos: ["maria.gomez@example.com"],
  }
];

export async function buscarSocioPorDocumento(
  tipoDocumento: string,
  nroDocumento: string
): Promise<SocioFormData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const socio = MOCK_SOCIOS.find(
    (s) => s.tipoDocumento === tipoDocumento && s.nroDocumento === nroDocumento
  );

  if (!socio) return null;

  return {
    tipoDocumento: socio.tipoDocumento,
    nroDocumento: socio.nroDocumento,
    nombre: socio.nombre,
    apellido: socio.apellido,
    fechaNacimiento: socio.fechaNacimiento,
    ciudad: socio.ciudad,
    calle: socio.calle,
    altura: socio.altura,
    fechaAlta: socio.fechaAlta,
    fechaBaja: socio.fechaBaja,
    obraSocial: socio.obraSocial,
    plan: socio.plan,
    sepelio: socio.sepelio,
    cobrador: socio.cobrador,
    telefonos: socio.telefonos,
    correos: socio.correos,
  };
}

export async function guardarSocio(data: SocioFormData) {
  try {
    await fetch('https://tu-api-dotnet.com/api/socios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.info("Simulación de guardado (sin backend activo):", error);
  }

  clearSociosCache();
  redirect('/dashboard/socios');
}
