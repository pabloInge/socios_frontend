import { render } from '@testing-library/react';
import { useSociosService, SociosServiceProvider } from './service-context';

function Consumer() {
  useSociosService();
  return null;
}

describe('useSociosService', () => {
  it('lanza si se usa fuera de <SociosServiceProvider>', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/SociosServiceProvider/);
    spy.mockRestore();
  });

  it('dentro del provider expone un servicio construido a partir del flag', () => {
    // mockMode se decide en el servidor; aca solo validamos que el provider
    // construye y expone el servicio a partir del flag sin lanzar.
    const { unmount } = render(
      <SociosServiceProvider mockMode={false}>
        <Consumer />
      </SociosServiceProvider>
    );
    unmount();
  });
});
