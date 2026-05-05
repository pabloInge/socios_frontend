import { guardarSocio } from './actions';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
global.fetch = jest.fn();

describe('Acción del Servidor: guardarSocio', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debe enviar los datos al backend y redirigir a la lista', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const datosSocio = { nombre: 'Juan', apellido: 'Pérez', dni: '12345678' };
    
    await guardarSocio(datosSocio);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/socios'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(datosSocio)
      })
    );
    
    expect(redirect).toHaveBeenCalledWith('/dashboard/socios');
  });
});
