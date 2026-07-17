import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isMockMode } from '@/lib/env';

export function proxy(request: NextRequest) {
  if (isMockMode()) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
