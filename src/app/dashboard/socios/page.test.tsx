import { render, screen } from '@testing-library/react';
import SociosPage from './page';

describe('Módulo de Socios - Lista', () => {
  it('debe tener un botón FAB (+) que enlace a la vista de registro', () => {
    render(<SociosPage />);
    
    const fabLink = screen.getByRole('link', { name: /nuevo socio/i });
    expect(fabLink).toBeInTheDocument();
    expect(fabLink).toHaveAttribute('href', '/dashboard/socios/nuevo');
  });
});
