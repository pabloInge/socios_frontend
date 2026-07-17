import { guardarSocio, actualizarSocio, buscarSocioPorDocumento } from './actions';

jest.mock('../../../../lib/apiClient', () => ({
  fetchAPI: jest.fn(),
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from '../../../../lib/apiClient';
import { cookies } from 'next/headers';

const datosSocio = {
  tipoDocumento: 'DNI' as const,
  nroDocumento: '12345678',
  nombre: 'Juan',
  apellido: 'Pérez',
  fechaNacimiento: '1990-01-01',
  ciudad: 'Buenos Aires',
  calle: 'Falsa',
  altura: '123',
  fechaAlta: '2024-01-01',
  plan: 'A',
  cobrador: 'NO',
};

describe('Acciones del Servidor para Nuevo Socio (API real)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('buscarSocioPorDocumento', () => {
    it('con token debe consultar el endpoint de busqueda', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue(datosSocio);

      const socio = await buscarSocioPorDocumento('DNI', '12345678');

      expect(socio).toEqual(datosSocio);
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('/socios?tipoDocumento=DNI&nroDocumento=12345678'),
        'tok'
      );
    });

    it('sin token debe devolver null sin llamar a la API', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      const socio = await buscarSocioPorDocumento('DNI', '12345678');

      expect(socio).toBeNull();
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it('si la API falla debe devolver null', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error('404'));

      await expect(buscarSocioPorDocumento('DNI', '99999999')).resolves.toBeNull();
    });
  });

  describe('guardarSocio', () => {
    it('con token debe hacer POST al endpoint', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });

      await guardarSocio(datosSocio);

      expect(fetchAPI).toHaveBeenCalledWith('/socios', 'tok', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(datosSocio),
      }));
    });

    it('sin token no debe llamar a la API', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      await guardarSocio(datosSocio);

      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe('actualizarSocio', () => {
    it('con token debe hacer PUT al endpoint del socio', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });

      await actualizarSocio('5', datosSocio);

      expect(fetchAPI).toHaveBeenCalledWith('/socios/5', 'tok', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(datosSocio),
      }));
    });

    it('propaga el error si el backend falla (para que la UI lo maneje)', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error('network'));

      await expect(actualizarSocio('5', datosSocio)).rejects.toThrow('network');
    });
  });
});
