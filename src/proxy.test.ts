import { proxy } from './proxy';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

describe('Proxy de Seguridad', () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = 'production';
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  it('debe permitir el acceso directo si ENV es develop', () => {
    process.env.ENV = 'develop';
    const req = {
      nextUrl: { pathname: '/dashboard' },
      cookies: { get: jest.fn().mockReturnValue(undefined) },
      url: 'http://localhost:3000/dashboard'
    } as unknown as NextRequest;

    proxy(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('debe redirigir a /login si intenta entrar a /dashboard sin token y no es develop', () => {
    const req = {
      nextUrl: { pathname: '/dashboard' },
      cookies: { get: jest.fn().mockReturnValue(undefined) },
      url: 'http://localhost:3000/dashboard'
    } as unknown as NextRequest;

    proxy(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', req.url));
  });

  it('debe permitir el acceso si el usuario tiene el authToken', () => {
    const req = {
      nextUrl: { pathname: '/dashboard' },
      cookies: { get: jest.fn().mockReturnValue({ value: 'token-valido' }) },
      url: 'http://localhost:3000/dashboard'
    } as unknown as NextRequest;

    proxy(req);
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
