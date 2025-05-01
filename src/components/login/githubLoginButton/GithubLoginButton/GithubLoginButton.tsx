'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GithubLogin from '@/api/login/loginAPI';
import useAuthStore from '@/store/authStore';
import LoginButton from '../LoginButton/LoginButton';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const fetchToken = async () => {
      const code = searchParams.get('code');
      if (!code) return;

      try {
        const data = await GithubLogin(code);
        setAccessToken(data.accessToken);
        window.location.href = '/';
      } catch (error) {
        console.error('로그인 실패:', error);
      }
    };

    fetchToken();
  }, [searchParams, setAccessToken]);

  return <LoginButton />;
};

export default GithubLoginButton;
