import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const PROTECTED_PATHS = ['/', '/commit', '/generate', '/repository', '/profile', '/community'];

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|static|assets|api|images|fonts).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const refreshToken = request.cookies.get('RefreshToken')?.value;
  const isProtected = PROTECTED_PATHS.includes(pathname);

  if (isProtected) {
    try {
      const apiResponse = await fetch(`${origin}/users?userId=`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (apiResponse.status === 401) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const isLoggedIn = !!refreshToken;
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
