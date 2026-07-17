import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColumnToggle, type ColumnToggleItem } from './column-toggle';

function makeItems(overrides: Partial<Record<string, boolean>> = {}): ColumnToggleItem[] {
  return [
    { key: 'nombre', label: 'Nombre', visible: overrides.nombre ?? true },
    { key: 'apellido', label: 'Apellido', visible: overrides.apellido ?? true },
    { key: 'documento', label: 'Documento', visible: overrides.documento ?? true },
  ];
}

describe('ColumnToggle', () => {
  it('renderiza un trigger con aria-label descriptivo y aria-haspopup', () => {
    render(<ColumnToggle items={makeItems()} onToggle={() => {}} />);
    const trigger = screen.getByRole('button', { name: /mostrar u ocultar columnas/i });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('al hacer clic en el trigger abre el menú con un ítem por columna', async () => {
    const user = userEvent.setup();
    render(<ColumnToggle items={makeItems()} onToggle={() => {}} />);

    await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));

    expect(await screen.findByRole('menuitemcheckbox', { name: /nombre/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: /apellido/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: /documento/i })).toBeInTheDocument();
  });

  it('marca cada ítem como checked según su estado visible', async () => {
    const user = userEvent.setup();
    render(
      <ColumnToggle
        items={makeItems({ documento: false })}
        onToggle={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));

    const nombre = await screen.findByRole('menuitemcheckbox', { name: /nombre/i });
    const documento = screen.getByRole('menuitemcheckbox', { name: /documento/i });
    expect(nombre).toHaveAttribute('aria-checked', 'true');
    expect(documento).toHaveAttribute('aria-checked', 'false');
  });

  it('al clickear un ítem llama a onToggle con el key de esa columna', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ColumnToggle items={makeItems()} onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: /apellido/i }));

    expect(onToggle).toHaveBeenCalledWith('apellido');
  });

  it('no permite ocultar la última columna visible (deshabilita el ítem)', async () => {
    const user = userEvent.setup();
    render(
      <ColumnToggle
        items={makeItems({ apellido: false, documento: false })}
        onToggle={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));
    const nombre = await screen.findByRole('menuitemcheckbox', { name: /nombre/i });
    expect(nombre).toHaveAttribute('aria-disabled', 'true');
    expect(nombre).toHaveAttribute('data-disabled');
  });

  it('cierra el menú al presionar Escape', async () => {
    const user = userEvent.setup();
    render(<ColumnToggle items={makeItems()} onToggle={() => {}} />);

    await user.click(screen.getByRole('button', { name: /mostrar u ocultar columnas/i }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();

    fireEvent.keyDown(menu, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
