import {
  devGetSocios,
  devGetSocioDetalle,
  devFindSocioByDocumento,
  devAddSocio,
  devUpdateSocio,
  devRemoveSocio,
  devReactivateSocio,
  _resetDevStoreForTests,
} from './dev-store';
import type { SocioFormData, ContactField } from '@/app/dashboard/socios/nuevo/schema';

const baseSocio: SocioFormData = {
  nombre: 'Test',
  apellido: 'Apellido',
  nroDocumento: '99999999',
  fechaNacimiento: '1990-01-01',
  sexo: 'Hombre',
  ciudad: 'Rosario',
  calle: 'Calle',
  altura: '100',
  fechaAlta: '2024-01-01',
  plan: 'A',
  sepelio: 'NO',
  cobrador: 'NO',
  observaciones: 'Observación de prueba',
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
      if (detalle.codeudores?.[0]) {
        detalle.codeudores[0].nombre = 'Mutado';
      }
      expect(devGetSocioDetalle('1')!.nombre).not.toBe('Mutado');
      expect(devGetSocioDetalle('1')!.codeudores?.[0]!.nombre).not.toBe('Mutado');
    });

    it('devGetSocioDetalle debe incluir los codeudores sembrados', () => {
      const detalle = devGetSocioDetalle('1')!;
      expect(detalle.codeudores).toEqual([
        { id: '2', nombre: 'María', apellido: 'Gómez', nroDocumento: '20123456' },
      ]);
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
      expect(detalle!.sexo).toBe('Hombre');
      expect(detalle!.observaciones).toBe('Observación de prueba');
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

    it('debe persistir los codeudores', () => {
      const id = devAddSocio({
        ...baseSocio,
        codeudores: [
          { id: '2', nombre: 'María', apellido: 'Gómez', nroDocumento: '20123456' },
        ],
      });
      const detalle = devGetSocioDetalle(id)!;
      expect(detalle.codeudores).toEqual([
        { id: '2', nombre: 'María', apellido: 'Gómez', nroDocumento: '20123456' },
      ]);
    });

    it('debe guardar codeudores vacios si no se envían', () => {
      const id = devAddSocio(baseSocio);
      expect(devGetSocioDetalle(id)!.codeudores).toEqual([]);
    });
  });

  describe('devUpdateSocio', () => {
    it('debe actualizar los campos de un socio existente', () => {
      const id = devAddSocio(baseSocio);
      const ok = devUpdateSocio(id, {
        ...baseSocio,
        nombre: 'Actualizado',
        sexo: 'Mujer',
        nroAfiliadoObraSocial: 'OS-999',
        observaciones: 'Nueva observación',
        codeudores: [
          { id: '3', nombre: 'Carlos', apellido: 'Rodríguez', nroDocumento: '34567890' },
        ],
      });

      expect(ok).toBe(true);
      expect(devGetSocioDetalle(id)!.nombre).toBe('Actualizado');
      expect(devGetSocioDetalle(id)!.sexo).toBe('Mujer');
      expect(devGetSocioDetalle(id)!.nroAfiliadoObraSocial).toBe('OS-999');
      expect(devGetSocioDetalle(id)!.observaciones).toBe('Nueva observación');
      expect(devGetSocioDetalle(id)!.codeudores).toEqual([
        { id: '3', nombre: 'Carlos', apellido: 'Rodríguez', nroDocumento: '34567890' },
      ]);
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

  describe('devReactivateSocio', () => {
    it('debe quitar la fecha de baja y marcar el socio como Activo', () => {
      const id = devAddSocio({ ...baseSocio, fechaBaja: '2025-01-01' });
      expect(devGetSocios().find((s) => s.id === id)!.estado).toBe('Baja');

      const ok = devReactivateSocio(id);

      expect(ok).toBe(true);
      expect(devGetSocios().find((s) => s.id === id)!.estado).toBe('Activo');
      expect(devGetSocioDetalle(id)!.fechaBaja).toBeUndefined();
    });

    it('debe devolver false si el socio no existe', () => {
      expect(devReactivateSocio('inexistente')).toBe(false);
    });
  });
});
