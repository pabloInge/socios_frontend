import {
  devGetSocios,
  devGetSocioDetalle,
  devFindSocioByDocumento,
  devAddSocio,
  devUpdateSocio,
  devRemoveSocio,
  _resetDevStoreForTests,
} from './dev-store';
import type { SocioFormData, ContactField } from '@/app/dashboard/socios/nuevo/schema';

const baseSocio: SocioFormData = {
  nombre: 'Test',
  apellido: 'Apellido',
  nroDocumento: '99999999',
  fechaNacimiento: '1990-01-01',
  ciudad: 'Rosario',
  calle: 'Calle',
  altura: '100',
  fechaAlta: '2024-01-01',
  plan: 'A',
  sepelio: 'NO',
  cobrador: 'NO',
  telefonos: ['3411234567'],
  correos: ['test@example.com'],
};

describe('dev-store', () => {
  beforeEach(() => {
    _resetDevStoreForTests();
    jest.restoreAllMocks();
  });

  describe('devGetSocios / devGetSocioDetalle', () => {
    it('debe devolver los socios sembrados desde los mocks', () => {
      const socios = devGetSocios();
      expect(socios.length).toBeGreaterThan(0);
      expect(socios[0]).toHaveProperty('id');
      expect(socios[0]).toHaveProperty('estado');
    });

    it('devGetSocioDetalle debe devolver el detalle existente y null si no existe', () => {
      expect(devGetSocioDetalle('1')).not.toBeNull();
      expect(devGetSocioDetalle('inexistente')).toBeNull();
    });

    it('no debe devolver referencias mutables a la data interna', () => {
      const detalle = devGetSocioDetalle('1')!;
      detalle.nombre = 'Mutado';
      expect(devGetSocioDetalle('1')!.nombre).not.toBe('Mutado');
    });
  });

  describe('devFindSocioByDocumento', () => {
    it('debe encontrar un socio por numero de documento', () => {
      const detalle = devFindSocioByDocumento('12345678');
      expect(detalle).not.toBeNull();
      expect(detalle!.nombre).toBe('Juan');
    });

    it('debe devolver null si no existe', () => {
      expect(devFindSocioByDocumento('00000000')).toBeNull();
    });
  });

  describe('devAddSocio', () => {
    it('debe agregar el socio al listado y al detalle y devolver un id nuevo', () => {
      const before = devGetSocios().length;
      const id = devAddSocio(baseSocio);

      expect(devGetSocios().length).toBe(before + 1);
      const detalle = devGetSocioDetalle(id);
      expect(detalle).not.toBeNull();
      expect(detalle!.nombre).toBe('Test');
      expect(detalle!.telefonos).toEqual(['3411234567']);
      expect(detalle!.correos).toEqual(['test@example.com']);
    });

    it('los ids generados deben ser incrementales y unicos', () => {
      const id1 = devAddSocio(baseSocio);
      const id2 = devAddSocio(baseSocio);
      expect(id1).not.toBe(id2);
      expect(Number(id2)).toBeGreaterThan(Number(id1));
    });

    it('debe normalizar telefonos y correos con formato { value }', () => {
      const id = devAddSocio({
        ...baseSocio,
        telefonos: [{ value: '111' }, '222'] as ContactField[],
        correos: [{ value: 'a@b.com' }] as ContactField[],
      });
      const detalle = devGetSocioDetalle(id)!;
      expect(detalle.telefonos).toEqual(['111', '222']);
      expect(detalle.correos).toEqual(['a@b.com']);
    });
  });

  describe('devUpdateSocio', () => {
    it('debe actualizar los campos de un socio existente', () => {
      const id = devAddSocio(baseSocio);
      const ok = devUpdateSocio(id, { ...baseSocio, nombre: 'Actualizado' });

      expect(ok).toBe(true);
      expect(devGetSocioDetalle(id)!.nombre).toBe('Actualizado');
      expect(devGetSocios().find((s) => s.id === id)!.nombre).toBe('Actualizado');
    });

    it('debe devolver false si el socio no existe', () => {
      expect(devUpdateSocio('inexistente', baseSocio)).toBe(false);
    });
  });

  describe('devRemoveSocio', () => {
    it('debe eliminar el socio del listado y del detalle', () => {
      const id = devAddSocio(baseSocio);
      const before = devGetSocios().length;

      const ok = devRemoveSocio(id);

      expect(ok).toBe(true);
      expect(devGetSocios().length).toBe(before - 1);
      expect(devGetSocioDetalle(id)).toBeNull();
    });

    it('debe devolver false si el socio no existe', () => {
      expect(devRemoveSocio('inexistente')).toBe(false);
    });

    it('_resetDevStoreForTests debe volver al estado sembrado', () => {
      const original = devGetSocios().length;
      devAddSocio(baseSocio);
      devAddSocio(baseSocio);
      expect(devGetSocios().length).toBe(original + 2);
      _resetDevStoreForTests();
      expect(devGetSocios().length).toBe(original);
    });
  });
});
