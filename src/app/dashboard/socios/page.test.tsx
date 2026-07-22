import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import SociosPage from './page';
import { SociosServiceProvider, type SociosService } from '@/lib/socios/service-context';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

interface MockSelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (v: string) => void;
}
interface MockSelectTriggerProps {
  children: React.ReactNode;
  label?: string;
  id?: string;
}

jest.mock('../../../components/ui/select', () => ({
  Select: ({ children, onValueChange }: MockSelectProps) => {
    const triggerProps = (children as React.ReactElement<MockSelectTriggerProps>)?.props;
    const triggerLabel = triggerProps?.label || '';
    return (
      <div
        data-testid={`mock-select-${triggerLabel}`}
        onClick={() => onValueChange?.('Todos')}
      >
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, label, id }: MockSelectTriggerProps) => (
    <button type="button" id={id} aria-label={label}>{children}</button>
  ),
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}));

const socio42 = {
  id: '42',
  nombre: 'Juan',
  apellido: 'Pérez',
  nroDocumento: '12345678',
  obraSocial: 'PAMI',
  plan: 'A',
  estado: 'Activo' as const,
};

function makeFake(overrides: Partial<SociosService> = {}): SociosService {
  return {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    ...overrides,
  } as SociosService;
}

function renderPage(service: SociosService) {
  return render(
    <SociosServiceProvider mockMode={false} service={service}>
      <SociosPage />
    </SociosServiceProvider>
  );
}

describe('Módulo de Socios - Lista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('debe tener un botón FAB (+) que enlace a la vista de registro', () => {
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([]) }));

    const fabLink = screen.getByRole('link', { name: /nuevo socio/i });
    expect(fabLink).toBeInTheDocument();
    expect(fabLink).toHaveAttribute('href', '/dashboard/socios/nuevo');
  });

  it('debe mostrar skeletons mientras carga y luego la tabla con socios', async () => {
    const list = jest.fn().mockResolvedValue([socio42]);
    renderPage(makeFake({ list }));

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('Pérez')).toBeInTheDocument();
      expect(screen.getByText('12345678')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay resultados', async () => {
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([]) }));

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron socios/i)).toBeInTheDocument();
    });
  });

  it('el boton Editar debe navegar a la pantalla de edicion con el id', async () => {
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]) }));

    const editarBtn = await screen.findByRole('button', { name: /editar/i });
    fireEvent.click(editarBtn);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/socios/nuevo?edit=42');
  });

  it('el boton Eliminar llama al service.remove y quita el socio de la lista', async () => {
    const remove = jest.fn().mockResolvedValue(true);
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]), remove }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /eliminar/i }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith('42');
      expect(screen.queryByText('Juan')).not.toBeInTheDocument();
    });
  });

  it('no quita el socio de la lista si remove falla', async () => {
    const remove = jest.fn().mockResolvedValue(false);
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]), remove }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /eliminar/i }));

    await waitFor(() => expect(remove).toHaveBeenCalledWith('42'));
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });
});
