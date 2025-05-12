'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGithubLogin } from '@/hooks/useGithubLogin';
import LoginButton from '../LoginButton/LoginButton';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  const { login } = useGithubLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    login(code)
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('GitHub 로그인 실패:', error);
      });
  }, [searchParams, login]);

  return <LoginButton />;
};

export default GithubLoginButton;
