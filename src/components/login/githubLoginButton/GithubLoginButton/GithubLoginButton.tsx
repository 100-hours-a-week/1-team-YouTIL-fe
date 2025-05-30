'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGithubLogin } from '@/hooks/useGithubLogin';
import LoginButton from '../LoginButton/LoginButton';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useGithubLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const expectedState = sessionStorage.getItem('oauth_state');

    if (!code) return;

    if (!expectedState || returnedState !== expectedState) {
      console.log('state 검증 실패');
      return;
    }
    
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
