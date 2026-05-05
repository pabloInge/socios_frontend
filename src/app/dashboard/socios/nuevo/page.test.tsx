import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevoSocioPage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));


const mockGuardarSocio = jest.fn();
jest.mock('./actions', () => ({
  guardarSocio: (...args: unknown[]) => mockGuardarSocio(...args),
}));

jest.mock('../../../../components/ui/select', () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange?: (v: string) => void }) => (
    <div onClick={() => onValueChange && onValueChange('A')}>{children}</div>
  ),
  SelectTrigger: ({ children, label, id }: { children: React.ReactNode; label?: string; id?: string }) => (
    <button type="button" id={id} aria-label={label}>{children}</button>
  ),
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}));

jest.mock('../../../../components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dialog">{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Módulo de Socios - Registro (Comportamiento)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debe ejecutar la acción de guardado al completar el formulario', async () => {
    render(<NuevoSocioPage />);

    await userEvent.type(screen.getAllByLabelText(/nombre/i)[0], 'Juan');
    await userEvent.type(screen.getAllByLabelText(/apellido/i)[0], 'Pérez');
    await userEvent.type(screen.getAllByLabelText(/dni/i)[0], '12345678');
    fireEvent.change(screen.getAllByLabelText(/fecha de nacimiento/i)[0], { target: { value: '1990-01-01' } });
    await userEvent.type(screen.getAllByLabelText(/ciudad/i)[0], 'Buenos Aires');
    await userEvent.type(screen.getAllByLabelText(/calle/i)[0], 'Falsa');
    await userEvent.type(screen.getAllByLabelText(/altura/i)[0], '123');
    fireEvent.change(screen.getAllByLabelText(/fecha de alta/i)[0], { target: { value: '2024-01-01' } });
    
    fireEvent.click(await screen.findByLabelText(/plan/i));
    fireEvent.click(await screen.findByLabelText(/cobrador/i));
    
    await userEvent.type((await screen.findAllByLabelText(/teléfono/i))[0], '12345678');
    const agregarButtons = screen.getAllByRole('button', { name: /agregar/i });
    await userEvent.click(agregarButtons[0]);

    await userEvent.type((await screen.findAllByLabelText(/correo electrónico/i))[0], 'test@example.com');
    await userEvent.click(agregarButtons[1]);

    const grabarBtn = await screen.findByRole('button', { name: /grabar/i });
    fireEvent.click(grabarBtn);

    await waitFor(() => {
      expect(mockGuardarSocio).toHaveBeenCalledWith(expect.objectContaining({
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        telefonos: ['12345678'],
        correos: ['test@example.com']
      }));
    });
  }, 15000);

  it('debe mostrar errores de validación y no guardar si el formulario está vacío', async () => {
    render(<NuevoSocioPage />);

    const buttons = await screen.findAllByRole('button');
    const grabarBtn = buttons.find(b => /grabar/i.test(b.textContent || ''));
    if (grabarBtn) fireEvent.click(grabarBtn);

    await waitFor(() => {
      expect(mockGuardarSocio).not.toHaveBeenCalled();

      expect(screen.getByText(/el nombre debe tener al menos 2 letras/i)).toBeInTheDocument();
      expect(screen.getByText(/la ciudad es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('debe navegar al listado al hacer clic en cancelar', async () => {
    render(<NuevoSocioPage />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/socios');
  });
});

