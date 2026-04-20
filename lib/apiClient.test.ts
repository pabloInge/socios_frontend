import { fetchAPI } from './apiClient';

global.fetch = jest.fn();

describe('fetchAPI HTTP Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe agregar el header Authorization si se provee un token en base64', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, name: 'Socio Test' })
        });

        const fakeTokenBase64 = 'dXNlcjpwYXNzd29yZA==';

        await fetchAPI('/me', fakeTokenBase64);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/me',
            expect.objectContaining({
                headers: expect.any(Headers)
            })
        );

        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        const headersPassed = callArgs[1].headers as Headers;
        expect(headersPassed.get('Authorization')).toBe(`Basic ${fakeTokenBase64}`);
    });

    it('debe lanzar un error si la respuesta HTTP no es ok', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(fetchAPI('/me')).rejects.toThrow('Error en la API: 401 Unauthorized');
    });
});
