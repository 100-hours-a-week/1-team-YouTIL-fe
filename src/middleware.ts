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

  // ✅ 동적 경로 포함해서 보호된 경로인지 판단
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // ✅ 동적 경로 포함해서 유효한 경로인지 판단
  const isValidPath = [...PUBLIC_PATHS, ...PROTECTED_PATHS].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // 로그인된 상태에서 로그인 페이지 접근 → 홈으로
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인 안 됐는데 보호된 페이지 접근 → 로그인으로
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인 안 된 상태에서 정의되지 않은 경로 접근 → 로그인으로
  if (!isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인 된 상태에서 정의되지 않은 경로 접근 → 홈으로
  if (isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
