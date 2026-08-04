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
    reactivate: jest.fn(),
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

  it('el boton Eliminar abre la ventana emergente y al confirmar llama al service.remove y quita el socio', async () => {
    const remove = jest.fn().mockResolvedValue(true);
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]), remove }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /eliminar/i }));

    expect(await screen.findByText('¿Eliminar socio?')).toBeInTheDocument();
    expect(screen.getByText(/¿Está seguro de que desea eliminar a Juan Pérez?/i)).toBeInTheDocument();

    const dialogConfirmBtn = within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' });
    fireEvent.click(dialogConfirmBtn);

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith('42');
      expect(screen.queryByText('Juan')).not.toBeInTheDocument();
    });
  });

  it('no quita el socio si se cancela la confirmación en la ventana emergente', async () => {
    const remove = jest.fn().mockResolvedValue(true);
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]), remove }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /eliminar/i }));

    expect(await screen.findByText('¿Eliminar socio?')).toBeInTheDocument();

    const cancelBtn = within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText('¿Eliminar socio?')).not.toBeInTheDocument();
    });

    expect(remove).not.toHaveBeenCalled();
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });

  it('no quita el socio de la lista si remove falla', async () => {
    const remove = jest.fn().mockResolvedValue(false);
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]), remove }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /eliminar/i }));

    expect(await screen.findByText('¿Eliminar socio?')).toBeInTheDocument();

    const dialogConfirmBtn = within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' });
    fireEvent.click(dialogConfirmBtn);

    await waitFor(() => expect(remove).toHaveBeenCalledWith('42'));
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });

  it('un socio dado de baja muestra solo el boton Reactivar y no Editar/Eliminar', async () => {
    const socioBaja = { ...socio42, estado: 'Baja' as const };
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socioBaja]) }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;

    expect(within(row).getByRole('button', { name: /reactivar/i })).toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: /eliminar/i })).not.toBeInTheDocument();
  });

  it('un socio activo muestra Editar y Eliminar pero no Reactivar', async () => {
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socio42]) }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;

    expect(within(row).getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(within(row).getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: /reactivar/i })).not.toBeInTheDocument();
  });

  it('al hacer clic en Reactivar llama al service.reactivate y actualiza el estado a Activo', async () => {
    const reactivate = jest.fn().mockResolvedValue(true);
    const socioBaja = { ...socio42, estado: 'Baja' as const };
    renderPage(makeFake({ list: jest.fn().mockResolvedValue([socioBaja]), reactivate }));

    await screen.findByText('Juan');
    const row = screen.getByText('Juan').closest('tr')!;
    fireEvent.click(within(row).getByRole('button', { name: /reactivar/i }));

    await waitFor(() => expect(reactivate).toHaveBeenCalledWith('42'));
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.queryByText('Baja')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reactivar/i })).not.toBeInTheDocument();
  });
});
