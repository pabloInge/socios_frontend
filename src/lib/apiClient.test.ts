import { fetchAPI, isMockMode } from './apiClient';

global.fetch = jest.fn();

describe('fetchAPI HTTP Client', () => {
  const originalEnv = process.env.ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  describe('modo develop (mocks)', () => {
    beforeEach(() => {
      process.env.ENV = 'develop';
    });

    it('no debe llamar a fetch y debe devolver el mock del endpoint', async () => {
      const me = await fetchAPI<{ nombre: string; rol: string }>('/me');
      expect(global.fetch).not.toHaveBeenCalled();
      expect(me).toEqual({ nombre: 'Juan Pérez', rol: 'admin' });
    });

    it('debe devolver el listado de socios mockeado', async () => {
      const socios = await fetchAPI<unknown[]>('/socios');
      expect(Array.isArray(socios)).toBe(true);
      expect(socios.length).toBeGreaterThan(0);
    });
  });

  describe('rama no-develop (fetch mockeado, sin red)', () => {
    beforeEach(() => {
      process.env.ENV = 'stg';
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';
    });

    it('debe agregar el header Authorization si se provee un token en base64', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, name: 'Socio Test' }),
      });

      const fakeTokenBase64 = 'dXNlcjpwYXNzd29yZA==';
      await fetchAPI('/me', fakeTokenBase64);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/me',
        expect.objectContaining({
          headers: expect.any(Headers),
          cache: 'no-store',
        })
      );

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const headersPassed = callArgs[1].headers as Headers;
      expect(headersPassed.get('Authorization')).toBe(`Basic ${fakeTokenBase64}`);
    });

    it('debe lanzar un error si la respuesta HTTP no es ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(fetchAPI('/me')).rejects.toThrow(
        'Error en la API: 401 Unauthorized'
      );
    });

    it('debe lanzar un error si NEXT_PUBLIC_API_URL no está definida', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      await expect(fetchAPI('/me')).rejects.toThrow(/NEXT_PUBLIC_API_URL/);
    });
  });

  describe('isMockMode', () => {
    it('debe ser true solo cuando ENV es develop', () => {
      process.env.ENV = 'develop';
      expect(isMockMode()).toBe(true);
      process.env.ENV = 'stg';
      expect(isMockMode()).toBe(false);
      process.env.ENV = 'prod';
      expect(isMockMode()).toBe(false);
    });
  });
});
