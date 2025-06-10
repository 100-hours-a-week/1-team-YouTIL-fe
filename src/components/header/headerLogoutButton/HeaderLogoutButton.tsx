'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { useFetch } from '@/hooks/useFetch';
import './HeaderLogoutButton.scss';

const HeaderLogoutButton = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { callApi } = useFetch();

  const handleLogout = async () => {
    try {
      await callApi({
        method: 'POST',
        endpoint: '/users/logout',
        credentials: 'include',
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      clearAuth();
      window.location.href = '/login';
    }
  };
  
  return (
    <div className="header__logout-button" onClick={handleLogout}>
      로그아웃
    </div>
  );
};

export default HeaderLogoutButton;
