import { isMockMode, getApiUrl, getClientEnv } from './env';

describe('env (config central de entorno)', () => {
  const originalEnv = process.env.ENV;
  const originalPublicEnv = process.env.NEXT_PUBLIC_ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => {
    process.env.ENV = originalEnv;
    process.env.NEXT_PUBLIC_ENV = originalPublicEnv;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  describe('isMockMode (servidor, basado en ENV)', () => {
    it('es true solo cuando ENV es develop', () => {
      process.env.ENV = 'develop';
      expect(isMockMode()).toBe(true);
      process.env.ENV = 'stg';
      expect(isMockMode()).toBe(false);
      process.env.ENV = 'prod';
      expect(isMockMode()).toBe(false);
    });

    it('es false si ENV no esta definido (fail-safe a API real)', () => {
      delete process.env.ENV;
      expect(isMockMode()).toBe(false);
    });

    it('NO se ve afectado por NEXT_PUBLIC_ENV (separacion cliente/servidor)', () => {
      delete process.env.ENV;
      process.env.NEXT_PUBLIC_ENV = 'develop';
      // Aunque el cliente crea que es develop, el servidor no entra en mock
      // si ENV no lo dice. Esto es lo que protege las decisiones de seguridad.
      expect(isMockMode()).toBe(false);
    });
  });

  describe('getClientEnv (cliente, basado en NEXT_PUBLIC_ENV)', () => {
    it('devuelve el entorno del cliente', () => {
      process.env.NEXT_PUBLIC_ENV = 'stg';
      expect(getClientEnv()).toBe('stg');
    });

    it('devuelve undefined si NEXT_PUBLIC_ENV no es un entorno valido', () => {
      process.env.NEXT_PUBLIC_ENV = 'otra';
      expect(getClientEnv()).toBeUndefined();
      delete process.env.NEXT_PUBLIC_ENV;
      expect(getClientEnv()).toBeUndefined();
    });
  });

  it('getApiUrl expone NEXT_PUBLIC_API_URL en vivo', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://example/api';
    expect(getApiUrl()).toBe('http://example/api');
  });
});
