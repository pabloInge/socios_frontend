import { eliminarSocio } from './actions';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';

describe('Acciones del Servidor - eliminarSocio (API)', () => {
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

  it('sin token no debe llamar a la API y devuelve false', async () => {
    (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
    global.fetch = jest.fn();

    await expect(eliminarSocio('1')).resolves.toBe(false);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('con token debe hacer DELETE al endpoint del socio y devolver true', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: (name: string) =>
        name === 'authToken' ? { value: 'dXNlcjpwYXNz' } : undefined,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => undefined,
    }) as jest.Mock;

    await expect(eliminarSocio('7')).resolves.toBe(true);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/socios/7',
      expect.objectContaining({
        method: 'DELETE',
        cache: 'no-store',
      })
    );
  });

  it('no debe lanzar si el endpoint falla y devuelve false (endpoint no listo)', async () => {
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
