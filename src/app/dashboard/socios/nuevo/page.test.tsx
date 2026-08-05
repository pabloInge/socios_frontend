import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevoSocioPage from './page';
import { SociosServiceProvider, type SociosService } from '@/lib/socios/service-context';
import * as React from 'react';

const mockPush = jest.fn();
const mockUseSearchParams = jest.fn(() => new URLSearchParams());
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

interface MockSelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
}
interface MockSelectTriggerProps {
  children: React.ReactNode;
  label?: string;
  id?: string;
  disabled?: boolean;
}

jest.mock('../../../../components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: MockSelectProps) => {
    const kids = React.Children.toArray(children);
    const trigger = kids.find(
      (k): k is React.ReactElement<MockSelectTriggerProps> =>
        React.isValidElement(k) && typeof (k.props as MockSelectTriggerProps).label === 'string'
    );
    const triggerLabel = trigger?.props.label ?? '';
    return (
      <div
        data-testid={`mock-select-${triggerLabel}`}
        data-value={value || ''}
        onClick={() => {
          if (onValueChange) {
            if (/ciudad/i.test(triggerLabel)) onValueChange('Rosario');
            else if (/sexo/i.test(triggerLabel)) onValueChange('Hombre');
            else if (/sepelio/i.test(triggerLabel) || /cobrador/i.test(triggerLabel)) onValueChange('SI');
            else onValueChange('A');
          }
        }}
      >
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, label, id, disabled }: MockSelectTriggerProps) => (
    <button type="button" id={id} aria-label={label} disabled={disabled}>{children}</button>
  ),
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}));

jest.mock('../../../../components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dialog">{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function makeFake(overrides: Partial<SociosService> = {}): SociosService {
  return {
    list: jest.fn(),
    get: jest.fn(),
    findByDocumento: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn(),
    ...overrides,
  } as SociosService;
}

function renderPage(service: SociosService = makeFake()) {
  return render(
    <SociosServiceProvider mockMode={false} service={service}>
      <NuevoSocioPage />
    </SociosServiceProvider>
  );
}

describe('Módulo de Socios - Registro (Comportamiento)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('debe pedir primero el documento, verificar que no existe y permitir guardar', async () => {
    const findByDocumento = jest.fn().mockResolvedValue(null);
    const create = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ findByDocumento, create }));

    expect(screen.queryByLabelText(/^nombre$/i)).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(findByDocumento).toHaveBeenCalledWith('12345678');
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/^nombre$/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: '1990-01-01' } });
    fireEvent.click(screen.getByTestId('mock-select-Sexo'));
    const ciudadRow = screen.getByText('Rosario').closest('tr');
    fireEvent.click(within(ciudadRow!).getByRole('button', { name: /elegir/i }));
    expect(screen.getByLabelText(/^ciudad$/i)).toHaveValue('Rosario');
    await userEvent.type(screen.getByLabelText(/calle/i), 'Falsa');
    await userEvent.type(screen.getByLabelText(/altura/i), '123');
    fireEvent.change(screen.getByLabelText(/fecha de alta/i), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByLabelText(/plan/i));
    fireEvent.click(screen.getByLabelText(/cobrador/i));

    await userEvent.type(screen.getByLabelText(/nº de afiliado de la obra social/i), 'PAMI-12345678');

    await userEvent.type((await screen.findAllByLabelText(/teléfono/i))[0]!, '12345678');
    const agregarButtons = screen.getAllByRole('button', { name: /agregar/i });
    await userEvent.click(agregarButtons[0]!);

    await userEvent.type((await screen.findAllByLabelText(/correo electrónico/i))[0]!, 'test@example.com');
    await userEvent.click(agregarButtons[1]!);

    await userEvent.type(screen.getByLabelText(/^observaciones$/i), 'Socio de prueba');

    fireEvent.click(await screen.findByRole('button', { name: /grabar/i }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith(expect.objectContaining({
        nroDocumento: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        sexo: 'Hombre',
        ciudad: 'Rosario',
        nroAfiliadoObraSocial: 'PAMI-12345678',
        observaciones: 'Socio de prueba',
        telefonos: ['12345678'],
        correos: ['test@example.com'],
      }));
    });
  }, 15000);

  it('debe autocompletar el formulario si encuentra el socio con el documento ingresado', async () => {
    const findByDocumento = jest.fn().mockResolvedValue({
      nroDocumento: '12345678',
      nombre: 'Carlos',
      apellido: 'González',
      fechaNacimiento: '1975-06-18',
      sexo: 'Hombre',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '980',
      fechaAlta: '2023-01-10',
      obraSocial: 'OSDE',
      nroAfiliadoObraSocial: 'OSDE-12345678',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'SI',
      observaciones: 'Socio existente',
      telefonos: ['341500600'],
      correos: ['carlos@test.com'],
    });

    const create = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ findByDocumento, create }));

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toHaveValue('Carlos');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('González');
      expect(screen.getByLabelText(/^ciudad$/i)).toHaveValue('Rosario');
      expect(screen.getByTestId('mock-select-Sexo')).toHaveAttribute('data-value', 'Hombre');
      expect(screen.getByLabelText(/nº de afiliado de la obra social/i)).toHaveValue('OSDE-12345678');
      expect(screen.getByLabelText(/^observaciones$/i)).toHaveValue('Socio existente');
    });

    fireEvent.click(screen.getByRole('button', { name: /grabar/i }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith(expect.objectContaining({
        nroDocumento: '12345678',
        nombre: 'Carlos',
        apellido: 'González',
        sexo: 'Hombre',
        nroAfiliadoObraSocial: 'OSDE-12345678',
        observaciones: 'Socio existente',
      }));
    });
  });

  it('debe colapsar el formulario y limpiar campos al presionar Buscar otro', async () => {
    const findByDocumento = jest.fn().mockResolvedValue({
      nroDocumento: '12345678',
      nombre: 'Carlos',
      apellido: 'González',
      fechaNacimiento: '1975-06-18',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '980',
      fechaAlta: '2023-01-10',
      obraSocial: 'OSDE',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'SI',
      telefonos: [],
      correos: [],
    });

    renderPage(makeFake({ findByDocumento }));

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /buscar otro/i }));

    expect(screen.queryByLabelText(/^nombre$/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^documento$/i)).toHaveValue('');
  });

  it('debe mostrar errores de validación y no guardar si el formulario está vacío tras búsqueda', async () => {
    const create = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ create }));

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /grabar/i }));

    await waitFor(() => {
      expect(create).not.toHaveBeenCalled();
      expect(screen.getByText(/el nombre debe tener al menos 2 letras/i)).toBeInTheDocument();
      expect(screen.getByText(/la ciudad es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/el sexo es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('debe navegar al listado al hacer clic en cancelar antes de buscar', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard/socios');
  });

  it('en modo edicion muestra "Editar socio" y precarga el socio via service.get', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('edit=1'));
    const get = jest.fn().mockResolvedValue({
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
      nroAfiliadoObraSocial: 'PAMI-12345678',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'NO',
      observaciones: 'Observaciones de edición',
      telefonos: ['3412345678'],
      correos: ['juan.perez@example.com'],
    });
    renderPage(makeFake({ get }));

    expect(screen.getByRole('heading', { name: /editar socio/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith('1');
      expect(screen.getByLabelText(/^nombre$/i)).toHaveValue('Juan');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('Pérez');
      expect(screen.getByTestId('mock-select-Sexo')).toHaveAttribute('data-value', 'Hombre');
      expect(screen.getByLabelText(/^observaciones$/i)).toHaveValue('Observaciones de edición');
    });
  });

  it('debe permitir elegir codeudores de la lista de socios y guardarlos', async () => {
    const findByDocumento = jest.fn().mockResolvedValue({
      nroDocumento: '12345678',
      nombre: 'Carlos',
      apellido: 'González',
      fechaNacimiento: '1975-06-18',
      sexo: 'Hombre',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '980',
      fechaAlta: '2023-01-10',
      obraSocial: 'OSDE',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'SI',
      telefonos: [],
      correos: [],
      codeudores: [],
    });
    const list = jest.fn().mockResolvedValue([
      { id: '2', nombre: 'María', apellido: 'Gómez', nroDocumento: '20123456', obraSocial: 'OSDE', plan: 'B', estado: 'Activo' },
      { id: '3', nombre: 'Carlos', apellido: 'Rodríguez', nroDocumento: '34567890', obraSocial: 'IAPOS', plan: 'A', estado: 'Baja' },
    ]);
    const create = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ findByDocumento, list, create }));

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toHaveValue('Carlos');
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar codeudor/i }));

    const row = (await screen.findByText('Gómez')).closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /elegir/i }));

    expect(screen.getByText(/Gómez, María — DNI 20123456/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /grabar/i }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith(expect.objectContaining({
        codeudores: [{ id: '2', nombre: 'María', apellido: 'Gómez', nroDocumento: '20123456' }],
      }));
    });
  });

  it('debe precargar los codeudores existentes al editar y no mostrarlos como disponibles', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('edit=10'));
    const get = jest.fn().mockResolvedValue({
      id: '10',
      nombre: 'Verónica',
      apellido: 'Ruiz',
      nroDocumento: '89012345',
      fechaNacimiento: '1992-11-25',
      sexo: 'Mujer',
      ciudad: 'Cañada de Gómez',
      calle: 'Buenos Aires',
      altura: '486',
      fechaAlta: '2024-08-12',
      obraSocial: 'Jerárquicos Salud',
      plan: 'B',
      sepelio: 'NO',
      cobrador: 'NO',
      telefonos: [],
      correos: [],
      codeudores: [
        { id: '1', nombre: 'Juan', apellido: 'Pérez', nroDocumento: '12345678' },
      ],
    });
    const list = jest.fn().mockResolvedValue([
      { id: '1', nombre: 'Juan', apellido: 'Pérez', nroDocumento: '12345678', obraSocial: 'PAMI', plan: 'A', estado: 'Activo' },
      { id: '4', nombre: 'Ana', apellido: 'Martínez', nroDocumento: '45678901', obraSocial: 'PAMI', plan: 'B', estado: 'Activo' },
    ]);
    const update = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ get, list, update }));

    await waitFor(() => {
      expect(screen.getByText(/Pérez, Juan — DNI 12345678/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar codeudor/i }));

    expect(screen.queryByText('Pérez')).not.toBeInTheDocument();
    expect(screen.getByText('Martínez')).toBeInTheDocument();
  });

  it('en modo edicion, Grabar llama a service.update con el id y los datos', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('edit=1'));
    const get = jest.fn().mockResolvedValue({
      id: '7',
      nombre: 'Juan',
      apellido: 'Pérez',
      nroDocumento: '12345678',
      fechaNacimiento: '1990-01-01',
      sexo: 'Mujer',
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
    const update = jest.fn().mockResolvedValue(undefined);
    renderPage(makeFake({ get, update }));

    await waitFor(() => expect(screen.getByLabelText(/^nombre$/i)).toHaveValue('Juan'));

    fireEvent.click(screen.getByRole('button', { name: /grabar/i }));

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith('1', expect.objectContaining({
        nombre: 'Juan',
        apellido: 'Pérez',
        nroDocumento: '12345678',
        sexo: 'Mujer',
      }));
    });
  });
});
