import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const PROTECTED_PATHS = ['/', '/commit', '/generate', '/repository', '/profile', '/community'];

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|static|assets|api|images|fonts).*)'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('RefreshToken')?.value;
  const isLoggedIn = !!refreshToken;

  const isProtected = PROTECTED_PATHS.includes(pathname);

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const allValidPaths = [...PUBLIC_PATHS, ...PROTECTED_PATHS];
  const isValidPath = allValidPaths.includes(pathname);
  if (!isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
