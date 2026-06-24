import { render, screen, waitFor } from '@testing-library/react';
import SociosPage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockObtenerSocios = jest.fn();
jest.mock('./actions', () => ({
  obtenerSocios: () => mockObtenerSocios(),
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
        onClick={() => {
          if (onValueChange) onValueChange('Todos');
        }}
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

describe('Módulo de Socios - Lista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe tener un botón FAB (+) que enlace a la vista de registro', () => {
    mockObtenerSocios.mockResolvedValue([]);
    render(<SociosPage />);

    const fabLink = screen.getByRole('link', { name: /nuevo socio/i });
    expect(fabLink).toBeInTheDocument();
    expect(fabLink).toHaveAttribute('href', '/dashboard/socios/nuevo');
  });

  it('debe mostrar skeletons mientras carga y luego la tabla con socios', async () => {
    mockObtenerSocios.mockResolvedValue([
      {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        tipoDocumento: 'DNI',
        nroDocumento: '12345678',
        obraSocial: 'PAMI',
        plan: 'A',
        estado: 'Activo',
      },
    ]);

    render(<SociosPage />);

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('Pérez')).toBeInTheDocument();
      expect(screen.getByText('DNI 12345678')).toBeInTheDocument();
      expect(screen.getByText('PAMI')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay resultados', async () => {
    mockObtenerSocios.mockResolvedValue([]);

    render(<SociosPage />);

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron socios/i)).toBeInTheDocument();
    });
  });
});
