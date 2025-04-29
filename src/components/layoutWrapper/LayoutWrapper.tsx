'use client';

import { usePathname } from 'next/navigation';
import Header from '../header/header/Header';
import BottomNavigationBar from '../bottomNavigationBar/bottomNavigationBar/BottomNavigationBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login'; // ✅ 경로가 /login이면

  return (
    <div className="layout-container">
      <div className="mobile-frame">
        {!isLoginPage && <Header />}
        <main>{children}</main>
        {!isLoginPage && <BottomNavigationBar />}
      </div>
    </div>
  );
}
