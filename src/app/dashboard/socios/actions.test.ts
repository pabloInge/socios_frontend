import { eliminarSocio, obtenerSocios, obtenerSocioDetalle, modificarSocio } from './actions';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';

describe('Acciones del Servidor - Socios (API)', () => {
  const originalEnv = process.env.ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = 'stg';
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  describe('obtenerSocios', () => {
    it('sin token devuelve array vacio', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerSocios();
      expect(res).toEqual([]);
    });

    it('con token llama a /socios y mapea formato de backend .NET', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === 'authToken' ? { value: 'dXNlcjpwYXNz' } : undefined),
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify([
            { idSocio: 1, nombre: 'Luciano', apellido: 'Oldan', dni: '32127057', estado: 'ACTIVO' },
            { idSocio: 2, nombre: 'Carlos', apellido: 'Gómez', dni: '30111222', estado: 'INACTIVO' },
          ]),
      }) as jest.Mock;

      const res = await obtenerSocios();
      expect(res).toHaveLength(2);
      expect(res[0]).toEqual({
        id: '1',
        nombre: 'Luciano',
        apellido: 'Oldan',
        nroDocumento: '32127057',
        obraSocial: null,
        plan: '',
        estado: 'Activo',
      });
      expect(res[1]?.estado).toBe('Baja');
    });
  });

  describe('eliminarSocio', () => {
    it('sin token no debe llamar a la API y devuelve false', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      global.fetch = jest.fn();

      await expect(eliminarSocio('1')).resolves.toBe(false);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('con token debe hacer POST a /socios/baja con idSocio y motivo', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) =>
          name === 'authToken' ? { value: 'dXNlcjpwYXNz' } : undefined,
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ mensaje: 'El socio fue dado de baja correctamente.' }),
      }) as jest.Mock;

      await expect(eliminarSocio('7')).resolves.toBe(true);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/socios/baja',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ idSocio: 7, motivo: 'RENUNCIA' }),
          cache: 'no-store',
        })
      );
    });

    it('no debe lanzar si el endpoint falla y devuelve false', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) =>
          name === 'authToken' ? { value: 'token' } : undefined,
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      }) as jest.Mock;

      await expect(eliminarSocio('3')).resolves.toBe(false);
    });
  });

  describe('obtenerSocioDetalle', () => {
    it('sin token devuelve null', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerSocioDetalle('1');
      expect(res).toBeNull();
    });

    it('con token hace GET a /socios/:id y mapea los campos', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === 'authToken' ? { value: 'token' } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            idSocio: 1,
            dni: '32127057',
            nombre: 'Luciano',
            apellido: 'Oldan',
            fechaNacimiento: '1959-07-12',
            sexo: 'Hombre',
            ciudad: 'Roldán',
            calle: 'Independencia',
            altura: 250,
            estado: 'ACTIVO',
            fechaAlta: '1995-01-18',
            obraSocial: 'PAMI',
            numeroAfiliado: '123',
            plan: 'A',
            sepelio: 'SI',
            cobrador: 'NO',
            telefonos: ['3413458966'],
            emails: ['luciano@test.com'],
          }),
      }) as jest.Mock;

      const res = await obtenerSocioDetalle('1');
      expect(res).not.toBeNull();
      expect(res?.id).toBe('1');
      expect(res?.nroDocumento).toBe('32127057');
      expect(res?.altura).toBe('250');
      expect(res?.nroAfiliadoObraSocial).toBe('123');
      expect(res?.correos).toEqual(['luciano@test.com']);
    });
  });

  describe('modificarSocio', () => {
    it('sin token devuelve success false', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await modificarSocio('1', {
        ciudad: 'Rosario',
        calle: 'San Martín',
        altura: '500',
        telefonos: ['341123456'],
      });
      expect(res.success).toBe(false);
      expect(res.mensaje).toBe('No autenticado');
    });

    it('con token envía PUT a /socios/modificar con payload correcto', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === 'authToken' ? { value: 'token123' } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ mensaje: 'El socio fue modificado correctamente.' }),
      }) as jest.Mock;

      const res = await modificarSocio('1', {
        ciudad: 'Rosario',
        calle: 'Mitre',
        altura: '100',
        plan: 'A',
        sepelio: 'SI',
        cobrador: 'NO',
        telefonos: [{ value: '3415556677' }],
        correos: ['test@example.com'],
      });

      expect(res.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/socios/modificar',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            idSocio: 1,
            idCiudad: 3,
            calle: 'Mitre',
            altura: 100,
            observaciones: undefined,
            idObraSocial: undefined,
            numeroAfiliado: undefined,
            plan: 'A',
            sepelio: 'SI',
            cobrador: 'NO',
            telefonos: ['3415556677'],
            emails: ['test@example.com'],
          }),
        })
      );
    });
  });
});

