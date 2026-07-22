import { createSociosService, type SociosService } from './service';
import type { SocioFormData } from '@/app/dashboard/socios/nuevo/schema';

jest.mock('../dev-store', () => ({
  devGetSocios: jest.fn(),
  devGetSocioDetalle: jest.fn(),
  devFindSocioByDocumento: jest.fn(),
  devAddSocio: jest.fn(),
  devUpdateSocio: jest.fn(),
  devRemoveSocio: jest.fn(),
}));
jest.mock('../../app/dashboard/socios/actions', () => ({
  obtenerSocios: jest.fn(),
  obtenerSocioDetalle: jest.fn(),
  eliminarSocio: jest.fn(),
}));
jest.mock('../../app/dashboard/socios/nuevo/actions', () => ({
  guardarSocio: jest.fn(),
  actualizarSocio: jest.fn(),
  buscarSocioPorDocumento: jest.fn(),
}));

import * as devStore from '../dev-store';
import * as sociosActions from '../../app/dashboard/socios/actions';
import * as nuevoActions from '../../app/dashboard/socios/nuevo/actions';

const socioData = {
  nombre: 'Test',
  apellido: 'Apellido',
  nroDocumento: '1',
  fechaNacimiento: '1990-01-01',
  ciudad: 'Rosario',
  calle: 'Calle',
  altura: '100',
  fechaAlta: '2024-01-01',
  plan: 'A',
  sepelio: 'NO',
  cobrador: 'NO',
} as SocioFormData;

describe('SociosService (DI por flag mockMode)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('factory createSociosService', () => {
    it('con mockMode=true devuelve la implementacion mock', () => {
      expect(createSociosService(true).constructor.name).toBe('MockSociosService');
    });

    it('con mockMode=false devuelve la implementacion de API', () => {
      expect(createSociosService(false).constructor.name).toBe('ApiSociosService');
    });

    it('por defecto (sin flag) usa la implementacion de API', () => {
      expect(createSociosService().constructor.name).toBe('ApiSociosService');
    });
  });

  describe('MockSociosService delega al dev-store', () => {
    let svc: SociosService;

    beforeEach(() => {
      (devStore.devGetSocios as jest.Mock).mockReturnValue([]);
      (devStore.devGetSocioDetalle as jest.Mock).mockReturnValue(null);
      (devStore.devFindSocioByDocumento as jest.Mock).mockReturnValue(null);
      svc = createSociosService(true);
    });

    it('list/get/findByDocumento/create/update/remove llaman al dev-store', async () => {
      await svc.list();
      await svc.get('1');
      await svc.findByDocumento('12345678');
      await svc.create(socioData);
      await svc.update('1', socioData);
      await svc.remove('1');

      expect(devStore.devGetSocios).toHaveBeenCalled();
      expect(devStore.devGetSocioDetalle).toHaveBeenCalledWith('1');
      expect(devStore.devFindSocioByDocumento).toHaveBeenCalledWith('12345678');
      expect(devStore.devAddSocio).toHaveBeenCalledWith(socioData);
      expect(devStore.devUpdateSocio).toHaveBeenCalledWith('1', socioData);
      expect(devStore.devRemoveSocio).toHaveBeenCalledWith('1');
    });
  });

  describe('ApiSociosService delega a las server actions', () => {
    let svc: SociosService;

    beforeEach(() => {
      (sociosActions.obtenerSocios as jest.Mock).mockResolvedValue([]);
      (sociosActions.obtenerSocioDetalle as jest.Mock).mockResolvedValue(null);
      (sociosActions.eliminarSocio as jest.Mock).mockResolvedValue(false);
      (nuevoActions.guardarSocio as jest.Mock).mockResolvedValue(undefined);
      (nuevoActions.actualizarSocio as jest.Mock).mockResolvedValue(undefined);
      (nuevoActions.buscarSocioPorDocumento as jest.Mock).mockResolvedValue(null);
      svc = createSociosService(false);
    });

    it('list/get/remove llaman a las acciones de socios', async () => {
      await svc.list();
      await svc.get('1');
      await svc.remove('1');

      expect(sociosActions.obtenerSocios).toHaveBeenCalled();
      expect(sociosActions.obtenerSocioDetalle).toHaveBeenCalledWith('1');
      expect(sociosActions.eliminarSocio).toHaveBeenCalledWith('1');
    });

    it('findByDocumento/create/update llaman a las acciones de nuevo', async () => {
      await svc.findByDocumento('12345678');
      await svc.create(socioData);
      await svc.update('1', socioData);

      expect(nuevoActions.buscarSocioPorDocumento).toHaveBeenCalledWith('12345678');
      expect(nuevoActions.guardarSocio).toHaveBeenCalledWith(socioData);
      expect(nuevoActions.actualizarSocio).toHaveBeenCalledWith('1', socioData);
    });
  });
});
