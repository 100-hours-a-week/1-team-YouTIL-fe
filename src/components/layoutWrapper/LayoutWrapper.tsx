'use client';

import { usePathname } from 'next/navigation';
import Header from '../header/header/Header';
import BottomNavigationBar from '../bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';
import AuthGuard from '../authGuard/AuthGuard';
import './LayoutWrapper.scss';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="layout-container">
      <div className="layout__frame">
        {!isLoginPage && <Header />}
          
        <main>
          {/* {isLoginPage ? children : <AuthGuard>{children}</AuthGuard>} */}
          {children}
        </main>

        {!isLoginPage && <BottomNavigationBar />}
      </div>
    </div>
  );
}
