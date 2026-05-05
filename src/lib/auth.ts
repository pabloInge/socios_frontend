export interface Usuario {
  logueado: boolean;
  nombre: string;
  rol: string;
}

export async function obtenerSesion(): Promise<Usuario | null> {
  if (process.env.NODE_ENV === 'development') {
    return { logueado: true, nombre: 'Juan Pérez', rol: 'admin' };
  }

  return null;
}
