'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGithubLogin } from '@/hooks/useGithubLogin';
import LoginButton from '../LoginButton/LoginButton';
import useAuthStore from '@/store/useAuthStore';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useGithubLogin();
  const { clearOAuthState } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const expectedState = sessionStorage.getItem('oauthState');
    if (!code) return;

    if (!expectedState || returnedState !== expectedState) {
      router.replace('/login');
      return;
    }
    clearOAuthState();
    login(code)
      .then(() => {
        router.replace('/');
      })
      .catch((error) => {
        console.error('GitHub 로그인 실패:', error);
      });
  }, [searchParams, login, router]);

  return <LoginButton />;
};

export default GithubLoginButton;
