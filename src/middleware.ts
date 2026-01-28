import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_token';

// Routes that require authentication
const PROTECTED_ROUTES = ['/games/predictor/my-predictions'];

// Routes that should not be accessible when logged in
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Redirect logged-in users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && token) {
    // Redirect to home page if already logged in
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if the current path matches any protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/games/predictor/my-predictions/:path*', '/login/:path*', '/register/:path*'],
};
