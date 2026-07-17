import '@testing-library/jest-dom';

process.env.ENV = 'develop';
process.env.NEXT_PUBLIC_ENV = 'develop';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';

global.fetch = jest.fn(() =>
  Promise.reject(
    new Error(
      'Los tests no deben realizar llamadas reales a la red. ' +
        'Mockeá fetch en el test o usá ENV=develop.'
    )
  )
) as jest.Mock;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
