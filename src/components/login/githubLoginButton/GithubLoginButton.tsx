'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import gitlogin from 'public/gitlogin.png';
import './GithubLoginButton.scss';

import GithubLogin from '@/api/loginAPI';
import useAuthStore from '@/store/authStore';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      GithubLogin(code)
        .then((data) => {
          const token = data.accessToken;
          
          setAccessToken(token);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
        });
    }
  }, [searchParams, setAccessToken]);

  const handleLogin = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=read%3Auser%20user%3Aemail%20read%3Aorg%20repo`;

    window.location.href = githubAuthUrl;
  };

  return (
    <Image
      onClick={handleLogin}
      src={gitlogin}
      alt="GitHub 로그인 버튼"
      width={325}
      height={45}
      priority
      className="github-login-button"
    />
  );
};

export default GithubLoginButton;
