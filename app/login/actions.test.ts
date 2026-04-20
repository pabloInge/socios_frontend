import { loginAction } from './actions';
import { fetchAPI } from '../../lib/apiClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('../../lib/apiClient');
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('loginAction Server Action', () => {
  let mockCookiesSet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookiesSet = jest.fn();
    (cookies as jest.Mock).mockResolvedValue({ set: mockCookiesSet });
  });

  it('debe retornar error si faltan credenciales', async () => {
    const formData = new FormData();
    const result = await loginAction({}, formData);

    expect(result).toEqual({ error: "El usuario y la contraseña son obligatorios." });
    expect(fetchAPI).not.toHaveBeenCalled();
  });

  it('debe retornar el error de la API si las credenciales son incorrectas', async () => {
    const formData = new FormData();
    formData.append('username', 'pablo');
    formData.append('password', 'clave_mala');

    (fetchAPI as jest.Mock).mockRejectedValueOnce(new Error('Credenciales inválidas'));

    const result = await loginAction({}, formData);

    expect(result).toEqual({ error: 'Credenciales inválidas' });
    expect(mockCookiesSet).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('debe guardar la cookie HTTP-Only y redirigir en un login exitoso', async () => {
    const formData = new FormData();
    formData.append('username', 'admin');
    formData.append('password', '1234');

    (fetchAPI as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'Admin' });

    await loginAction({}, formData);

    expect(mockCookiesSet).toHaveBeenCalledWith(
      'authToken',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
