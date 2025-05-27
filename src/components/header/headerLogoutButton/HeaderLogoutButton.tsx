'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import './HeaderLogoutButton.scss';

const HeaderLogoutButton = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  return (
    <div className="header__logout-button" onClick={handleLogout}>
      로그아웃
    </div>
  );
};

export default HeaderLogoutButton;
