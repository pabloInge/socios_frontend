"use server";

import { getAuthToken } from "@/lib/auth";
import { buscarCiudades as buscarCiudadesLib, type Ciudad } from "@/lib/ciudades";
import { buscarObrasSociales as buscarObrasSocialesLib, type ObraSocial } from "@/lib/obras-sociales";

export async function buscarCiudades(busqueda?: string): Promise<Ciudad[]> {
  const token = await getAuthToken();
  return buscarCiudadesLib(busqueda, token);
}

export async function buscarObrasSociales(busqueda?: string): Promise<ObraSocial[]> {
  const token = await getAuthToken();
  return buscarObrasSocialesLib(busqueda, token);
}
