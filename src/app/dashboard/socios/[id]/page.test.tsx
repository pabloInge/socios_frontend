import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SocioDetallePage from './page';
import { SociosServiceProvider, type SociosService } from '@/lib/socios/service-context';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useParams: () => ({ id: '1' }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('../../../../components/ui/socio-detalle', () => ({
  SocioDetalleCard: ({
    socio,
    onEditar,
  }: {
    socio: { nombre: string; apellido: string };
    onEditar?: () => void;
  }) => (
    <div data-testid="socio-detalle-card">
      {socio.nombre} {socio.apellido}
      {onEditar && <button onClick={onEditar}>Editar</button>}
    </div>
  ),
}));

const socioDetalle = {
  id: '1',
  nombre: 'Juan',
  apellido: 'Pérez',
  nroDocumento: '12345678',
  fechaNacimiento: '1990-01-01',
  sexo: 'Hombre',
  ciudad: 'Buenos Aires',
  calle: 'Falsa',
  altura: '123',
  fechaAlta: '2024-01-01',
  obraSocial: 'PAMI',
  nroAfiliadoObraSocial: '123',
  plan: 'A',
  sepelio: 'SI',
  cobrador: 'NO',
  observaciones: 'Observación',
  telefonos: ['3412345678'],
  correos: ['juan.perez@example.com'],
};

function makeFake(get: jest.Mock, update = jest.fn()): SociosService {
  return {
    list: jest.fn(),
    get,
    findByDocumento: jest.fn(),
    create: jest.fn(),
    update,
    remove: jest.fn(),
    reactivate: jest.fn(),
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('debe mostrar el título y el botón de volver mientras carga', () => {
    renderPage(makeFake(jest.fn().mockReturnValue(new Promise(() => {}))));

    expect(screen.getByText('Detalle del Socio')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument();
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

  it('permite alternar a modo edición, modificar la calle y guardar los cambios', async () => {
    const update = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake(jest.fn().mockResolvedValue(socioDetalle), update));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

    expect(screen.getByText('Editar Socio')).toBeInTheDocument();

    const calleInput = screen.getByLabelText(/Calle/i);
    expect(calleInput).toHaveValue('Falsa');
    fireEvent.change(calleInput, { target: { value: 'San Martín' } });

    const guardarBtn = screen.getByRole('button', { name: /Guardar cambios/i });
    fireEvent.click(guardarBtn);

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          calle: 'San Martín',
        })
      );
      expect(screen.getByText('Detalle del Socio')).toBeInTheDocument();
    });
  });

  it('permite cancelar el modo edición y volver a ver detalle', async () => {
    renderPage(makeFake(jest.fn().mockResolvedValue(socioDetalle)));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(screen.getByText('Editar Socio')).toBeInTheDocument();

    const cancelarBtn = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelarBtn);

    expect(screen.getByText('Detalle del Socio')).toBeInTheDocument();
  });
});
