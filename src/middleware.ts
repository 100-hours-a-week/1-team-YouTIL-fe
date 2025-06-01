import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const PROTECTED_PATHS = ['/', '/commit', '/generate', '/repository', '/profile', '/community'];

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|static|assets|api|images|fonts).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const refreshToken = request.cookies.get('RefreshToken')?.value;
  const isLoggedIn = !!refreshToken;
  const isProtected = PROTECTED_PATHS.includes(pathname);
  const allValidPaths = [...PUBLIC_PATHS, ...PROTECTED_PATHS];
  const isValidPath = allValidPaths.includes(pathname);

  // 로그인된 사용자가 /login으로 접근하면 홈으로 리다이렉션
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 보호된 경로에 접근할 경우 서버 측 인증 확인
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

  // RefreshToken 없이 유효하지 않은 경로 접근 시 로그인으로 리다이렉션
  if (!isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // RefreshToken 있는 상태에서 유효하지 않은 경로 접근 시 홈으로 리다이렉션
  if (isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
