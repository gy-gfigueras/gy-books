import { NextRequest, NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/settings', '/dashboard'];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si la ruta está en la lista de protegidas, verifica la sesión
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Verifica si existe la cookie de sesión de Auth0
    const hasSession = req.cookies.has('appSession');

    // Si no hay sesión, redirige al login
    if (!hasSession) {
      const url = new URL('/api/auth/login', req.url);
      url.searchParams.set('returnTo', pathname);
      url.searchParams.set('prompt', 'login');
      return NextResponse.redirect(url);
    }

    // Si hay sesión, permite el acceso
    return NextResponse.next();
  }

  // Para el resto de rutas, permite el acceso sin autenticación
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|api/public|api/books|_next/static|_next/image|gy-logo.ico).*)',
  ],
};
