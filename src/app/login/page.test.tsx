import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginPage from './page';
import { loginAction } from './actions';

jest.mock('./actions', () => ({
  loginAction: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    (loginAction as jest.Mock).mockResolvedValue({});

    render(<LoginPage />);
    
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('debe mostrar un error si el Server Action devuelve un mensaje de fallo', async () => {
    (loginAction as jest.Mock).mockResolvedValue({ error: 'Credenciales inválidas' });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'pablo' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'clave_mala' } });
    
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
    
    expect(loginAction).toHaveBeenCalled();
  });

  it('no debe volver a mostrar el error mientras se reenvía el formulario', async () => {
    let resolveSecond: (v: { error?: string }) => void = () => {};
    const pendingSecond = new Promise<{ error?: string }>((r) => {
      resolveSecond = r;
    });

    (loginAction as jest.Mock)
      .mockResolvedValueOnce({ error: 'Credenciales inválidas' })
      .mockReturnValueOnce(pendingSecond);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'pablo' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'mala' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Credenciales inválidas')).not.toBeInTheDocument();
    });

    act(() => {
      resolveSecond({});
    });
  });
});