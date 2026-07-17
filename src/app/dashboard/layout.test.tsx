import { render, screen } from '@testing-library/react';
import DashboardLayout from './layout';

jest.mock('../../lib/auth', () => ({
  obtenerSesion: jest.fn(),
}));
jest.mock('../../lib/env', () => ({
  isMockMode: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('../../components/dashboard-layout-client', () => ({
  DashboardLayoutClient: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-shell">{children}</div>
  ),
}));

import { obtenerSesion } from '../../lib/auth';
import { isMockMode } from '../../lib/env';
import { redirect } from 'next/navigation';
import { useSociosService } from '@/lib/socios/service-context';

function SocioConsumer() {
  const svc = useSociosService();
  return <div data-testid="consumer">{svc ? 'has-service' : 'no-service'}</div>;
}

describe('DashboardLayout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sin sesión redirige a /login', async () => {
    (obtenerSesion as jest.Mock).mockResolvedValue(null);

    await DashboardLayout({ children: <p>hi</p> });

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('con sesión envuelve los children con el SociosServiceProvider', async () => {
    (obtenerSesion as jest.Mock).mockResolvedValue({
      logueado: true,
      nombre: 'Test',
      rol: 'admin',
    });
    (isMockMode as jest.Mock).mockReturnValue(true);

    const ui = await DashboardLayout({ children: <SocioConsumer /> });
    render(ui);

    expect(screen.getByTestId('layout-shell')).toBeInTheDocument();
    expect(screen.getByTestId('consumer')).toHaveTextContent('has-service');
    // El flag de mock se pasa serializable (no una instancia de clase)
    expect(isMockMode).toHaveBeenCalled();
  });
});
