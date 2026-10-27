export interface Prestacion {
  id: string;
  nombre: string;
}

export const MOCK_PRESTACIONES: Prestacion[] = [
  { id: "1", nombre: "Atención Médica" },
  { id: "2", nombre: "Farmacia" },
  { id: "3", nombre: "Enfermería" },
  { id: "4", nombre: "Comisión Cobrador" },
];

export function findPrestacionIdByName(nombre?: string): number {
  if (!nombre) return 1;
  const found = MOCK_PRESTACIONES.find(
    (p) => p.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  return found ? Number(found.id) : 1;
}

export function findPrestacionNameById(id?: number | string): string {
  if (!id) return "Atención Médica";
  const found = MOCK_PRESTACIONES.find((p) => p.id === String(id));
  return found ? found.nombre : "Atención Médica";
}
