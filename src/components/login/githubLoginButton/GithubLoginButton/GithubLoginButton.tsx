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
    const code = searchParams.get('code');
    if (code) {
      GithubLogin(code)
        .then((data) => {
          setAccessToken(data.accessToken);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
        });
    }
  }, [searchParams, setAccessToken]);

  return <LoginButton />;
};

export default GithubLoginButton;
