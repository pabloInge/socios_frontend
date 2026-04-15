import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './page';

describe('Pantalla de Login', () => {
    it('debe mostrar el título principal de Iniciar Sesión', () => {
        // 1. Renderizamos la página
        render(<LoginPage />);

        // 2. Buscamos un elemento <h1> que contenga "Iniciar Sesión"
        const titulo = screen.getByRole('heading', { level: 1, name: /iniciar sesión/i });

        // 3. Verificamos que el título exista en el documento
        expect(titulo).toBeInTheDocument();
    });
});