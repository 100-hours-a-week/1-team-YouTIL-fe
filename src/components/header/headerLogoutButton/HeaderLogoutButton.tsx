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
    router.replace('/login');
    try {
      await callApi({
        method: 'POST',
        endpoint: '/users/logout',
        credentials: 'include',
      });
    } catch (error) {
      router.replace('/login');
      console.error('로그아웃 요청 실패:', error);
    } finally {
      router.replace('/login');
      clearAuth();
    }
  };
  
  return (
    <div className="header__logout-button" onClick={handleLogout}>
      로그아웃
    </div>
  );
};

export default HeaderLogoutButton;
