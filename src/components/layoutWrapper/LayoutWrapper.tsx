'use client';

import { usePathname } from 'next/navigation';
import Header from '../header/header/Header';
import BottomNavigationBar from '../bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import AuthGuard from '../authGuard/AuthGuard';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="layout-container">
      <div className="mobile-frame">
        {!isLoginPage && <Header />}
        
        <main>
          {isLoginPage ? children : <AuthGuard>{children}</AuthGuard>}
        </main>
        
        {!isLoginPage && <BottomNavigationBar />}
      </div>
    </div>
  );
}
