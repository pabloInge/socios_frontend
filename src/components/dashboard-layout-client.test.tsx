import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardLayoutClient } from './dashboard-layout-client'
import { Usuario } from '@/lib/auth'

const mockPush = jest.fn()
const mockPathname = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}))

const mockUsuario = {
  id: "1",
  nombre: "Pablo Pérez",
  usuario: "pablo",
  rol: "admin",
  logueado: true
}

describe('DashboardLayoutClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname.mockReturnValue('/dashboard/usuarios')
  })

  it('debe renderizar las iniciales del usuario correctamente', () => {
    render(
      <DashboardLayoutClient usuario={mockUsuario as Usuario}>
        <div>Contenido</div>
      </DashboardLayoutClient>
    )
    
    expect(screen.getByText('PP')).toBeInTheDocument()
  })

  it('debe navegar al listado de socios al hacer clic en el botón Socios', () => {
    render(
      <DashboardLayoutClient usuario={mockUsuario as Usuario}>
        <div>Contenido</div>
      </DashboardLayoutClient>
    )
    
    const sociosBtn = screen.getByRole('button', { name: /socios/i })
    fireEvent.click(sociosBtn)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/socios')
  })

  it('no debe navegar al hacer clic en un ítem sin URL (como Usuarios)', () => {
    render(
      <DashboardLayoutClient usuario={mockUsuario as Usuario}>
        <div>Contenido</div>
      </DashboardLayoutClient>
    )
    
    const usuariosBtn = screen.getByRole('button', { name: /usuarios/i })
    fireEvent.click(usuariosBtn)
    
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('debe resaltar el ítem activo basado en el pathname', () => {
    mockPathname.mockReturnValue('/dashboard/socios')
    
    render(
      <DashboardLayoutClient usuario={mockUsuario as Usuario}>
        <div>Contenido</div>
      </DashboardLayoutClient>
    )
    
    const sociosBtn = screen.getByRole('button', { name: /socios/i })
    expect(sociosBtn).toHaveClass('bg-primary-container')
  })

})
