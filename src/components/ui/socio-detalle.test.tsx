import { render, screen } from '@testing-library/react';
import { SocioDetalleCard } from './socio-detalle';
import type { SocioDetalle } from '@/app/dashboard/socios/actions';

const mockSocio: SocioDetalle = {
  id: '1',
  nombre: 'Juan',
  apellido: 'Pérez',
  tipoDocumento: 'DNI',
  nroDocumento: '12345678',
  fechaNacimiento: '1990-01-01',
  ciudad: 'Buenos Aires',
  calle: 'Falsa',
  altura: '123',
  fechaAlta: '2024-01-01',
  obraSocial: 'PAMI',
  plan: 'A',
  sepelio: 'SI',
  cobrador: 'NO',
  telefonos: ['3412345678'],
  correos: ['juan.perez@example.com'],
};

describe('SocioDetalleCard', () => {
  it('debe mostrar el nombre y apellido del socio', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getByText('Pérez, Juan')).toBeInTheDocument();
    expect(screen.getByText('DNI 12345678')).toBeInTheDocument();
  });

  it('debe mostrar las secciones de información', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getByText('Información Personal')).toBeInTheDocument();
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('Plan y Cobertura')).toBeInTheDocument();
  });

  it('debe mostrar los chips de resumen', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getAllByText('PAMI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Plan A')).toBeInTheDocument();
    expect(screen.getByText('Sepelio incluido')).toBeInTheDocument();
    expect(screen.getByText('Sin cobrador')).toBeInTheDocument();
  });

  it('debe mostrar los teléfonos y correos', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getByText('3412345678')).toBeInTheDocument();
    expect(screen.getByText('juan.perez@example.com')).toBeInTheDocument();
  });

  it('debe mostrar "Sin obra social" cuando obraSocial no está definida', () => {
    const sinObra = { ...mockSocio, obraSocial: undefined };
    render(<SocioDetalleCard socio={sinObra} />);
    expect(screen.getByText('Sin obra social')).toBeInTheDocument();
  });

  it('debe mostrar los datos de dirección', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    expect(screen.getByText('Falsa')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('debe mostrar la fecha de baja si existe', () => {
    const conBaja = { ...mockSocio, fechaBaja: '2024-12-01' };
    render(<SocioDetalleCard socio={conBaja} />);
    expect(screen.getByText('2024-12-01')).toBeInTheDocument();
  });

  it('debe mostrar múltiples teléfonos', () => {
    const multiTel = { ...mockSocio, telefonos: ['3412345678', '3418765432'] };
    render(<SocioDetalleCard socio={multiTel} />);
    expect(screen.getByText('3412345678')).toBeInTheDocument();
    expect(screen.getByText('3418765432')).toBeInTheDocument();
  });

  it('debe mostrar todos los campos del formulario de registro', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('DNI')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Incluido')).toBeInTheDocument();
    expect(screen.getByText('No asignado')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('debe mostrar los chips con pointer-events-none', () => {
    render(<SocioDetalleCard socio={mockSocio} />);
    const chips = screen.getAllByRole('button');
    chips.forEach((chip) => {
      expect(chip.className).toContain('pointer-events-none');
    });
  });
});
