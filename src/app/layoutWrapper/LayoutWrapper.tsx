'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/header/header/Header';
import BottomNavigationBar from '@/components/bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import AuthGuard from '@/components/authGuard/AuthGuard';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import useGetAccessToken from '@/hooks/useGetAccessToken';

import './LayoutWrapper.scss';

const VALID_ROUTES = [
  '/',
  '/login',
  '/commit',
  '/generate',
  '/repository',
  '/profile',
  '/community',
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useGetAccessToken();

  const isLoginPage = pathname === '/login';
  const isValidRoute = VALID_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isValidRoute) {
      if (accessToken) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [isValidRoute, accessToken, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout__container">
        <div className="layout__frame">
          {!isLoginPage && <Header />}
          <main className="layout__main">
            {isLoginPage ? children : <AuthGuard>{children}</AuthGuard>}
          </main>
          {!isLoginPage && <BottomNavigationBar />}
        </div>
      </div>
    </QueryClientProvider>
  );
}
