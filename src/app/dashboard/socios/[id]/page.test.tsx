import { render, screen, waitFor } from '@testing-library/react';
import SocioDetallePage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

const mockObtenerSocioDetalle = jest.fn();
jest.mock('../actions', () => ({
  obtenerSocioDetalle: (...args: unknown[]) => mockObtenerSocioDetalle(...args),
}));

jest.mock('../../../../components/ui/socio-detalle', () => ({
  SocioDetalleCard: ({ socio }: { socio: { nombre: string; apellido: string } }) => (
    <div data-testid="socio-detalle-card">{socio.nombre} {socio.apellido}</div>
  ),
}));

describe('Módulo de Socios - Detalle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el título y el botón de volver mientras carga', () => {
    mockObtenerSocioDetalle.mockReturnValue(new Promise(() => {}));
    render(<SocioDetallePage />);

    expect(screen.getByText('Detalle del Socio')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debe mostrar los datos del socio cuando se completa la carga', async () => {
    mockObtenerSocioDetalle.mockResolvedValue({
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
    });

    render(<SocioDetallePage />);

    await waitFor(() => {
      expect(screen.getByTestId('socio-detalle-card')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de no encontrado cuando el socio no existe', async () => {
    mockObtenerSocioDetalle.mockResolvedValue(null);

    render(<SocioDetallePage />);

    await waitFor(() => {
      expect(screen.getByText('Socio no encontrado')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /volver al listado/i })).toBeInTheDocument();
  });

  it('debe llamar a obtenerSocioDetalle con el id correcto', async () => {
    mockObtenerSocioDetalle.mockResolvedValue({
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
    });

    render(<SocioDetallePage />);

    await waitFor(() => {
      expect(mockObtenerSocioDetalle).toHaveBeenCalledWith('1');
    });
  });
});
