'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const HeaderLogoutButton = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  return (
    <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
      로그아웃
    </div>
  );
};

export default HeaderLogoutButton;
