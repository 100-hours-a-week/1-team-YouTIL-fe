'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header/header/Header';
import BottomNavigationBar from '@/components/bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import AuthGuard from '@/components/authGuard/AuthGuard';
import './LayoutWrapper.scss';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

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
