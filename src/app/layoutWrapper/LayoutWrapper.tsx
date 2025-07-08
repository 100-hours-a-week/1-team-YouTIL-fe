'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header/header/Header';
import BottomNavigationBar from '@/components/bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import RefreshAccess from '@/components/refreshAccess/RefreshAccess';
import ScrollToTopOnRouteChange from '@/components/scrollToTopOnRouteChange/ScrollToTopOnRouteChange';
import './LayoutWrapper.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import UploadCompleteToast from '@/components/repository/til/uploadCompleteToast/UploadCompleteToast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout__container">
        <div className="layout__frame">
          <ScrollToTopOnRouteChange />
          <RefreshAccess />

          {!isLoginPage && <Header />}

          <main className="layout__main">
            {children}
          </main>
          <UploadCompleteToast/>
          {!isLoginPage && <BottomNavigationBar />}
        </div>
      </div>
    </QueryClientProvider>
  );
}
