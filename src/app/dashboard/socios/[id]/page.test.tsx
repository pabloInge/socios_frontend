import { render, screen, waitFor } from '@testing-library/react';
import SocioDetallePage from './page';
import { SociosServiceProvider, type SociosService } from '@/lib/socios/service-context';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

jest.mock('../../../../components/ui/socio-detalle', () => ({
  SocioDetalleCard: ({ socio }: { socio: { nombre: string; apellido: string } }) => (
    <div data-testid="socio-detalle-card">{socio.nombre} {socio.apellido}</div>
  ),
}));

const socioDetalle = {
  id: '1',
  nombre: 'Juan',
  apellido: 'Pérez',
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

function makeFake(get: jest.Mock): SociosService {
  return {
    list: jest.fn(),
    get,
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as SociosService;
}

function renderPage(service: SociosService) {
  return render(
    <SociosServiceProvider mockMode={false} service={service}>
      <SocioDetallePage />
    </SociosServiceProvider>
  );
}

describe('Módulo de Socios - Detalle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debe mostrar el título y el botón de volver mientras carga', () => {
    renderPage(makeFake(jest.fn().mockReturnValue(new Promise(() => {}))));

    expect(screen.getByText('Detalle del Socio')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debe mostrar los datos del socio cuando se completa la carga', async () => {
    renderPage(makeFake(jest.fn().mockResolvedValue(socioDetalle)));

    await waitFor(() => {
      expect(screen.getByTestId('socio-detalle-card')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de no encontrado cuando el socio no existe', async () => {
    renderPage(makeFake(jest.fn().mockResolvedValue(null)));

    await waitFor(() => {
      expect(screen.getByText('Socio no encontrado')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /volver al listado/i })).toBeInTheDocument();
  });

  it('debe llamar al service.get con el id correcto', async () => {
    const get = jest.fn().mockResolvedValue(socioDetalle);
    renderPage(makeFake(get));

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith('1');
    });
  });
});
