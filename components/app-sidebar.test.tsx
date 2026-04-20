import { render, screen } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from './ui/sidebar'; 

describe('AppSidebar (Menú Principal)', () => {
  it('debe renderizar los módulos principales del centro de jubilados', () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );
    
    expect(screen.getByText(/usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/empleados/i)).toBeInTheDocument();
    expect(screen.getByText(/socios/i)).toBeInTheDocument();
    expect(screen.getByText(/colaboradores/i)).toBeInTheDocument();
    expect(screen.getByText(/proveedores/i)).toBeInTheDocument();
    expect(screen.getByText(/caja/i)).toBeInTheDocument();
  });
});
