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

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isValidPath = [...PUBLIC_PATHS, ...PROTECTED_PATHS].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // ✅ 1. 로그인 페이지는 항상 접근 허용
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // ✅ 2. 로그인 안 됐는데 보호된 페이지 접근 → 로그인으로
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ 3. 로그인 안 된 상태에서 정의되지 않은 경로 접근 → 로그인으로
  if (!isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ 4. 로그인 된 상태에서 정의되지 않은 경로 접근 → 홈으로
  if (isLoggedIn && !isValidPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ✅ 5. 정상 접근
  return NextResponse.next();
}
