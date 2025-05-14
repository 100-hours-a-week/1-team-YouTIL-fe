'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '../header/header/Header';
import BottomNavigationBar from '../bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import AuthGuard from '../authGuard/AuthGuard';
import './LayoutWrapper.scss';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout-container">
        <div className="layout__frame">
          {!isLoginPage && <Header />}

          <main>
            {isLoginPage ? children : <AuthGuard>{children}</AuthGuard>}
          </main>

          {!isLoginPage && <BottomNavigationBar />}
        </div>
      </div>
    </QueryClientProvider>
  );
}
