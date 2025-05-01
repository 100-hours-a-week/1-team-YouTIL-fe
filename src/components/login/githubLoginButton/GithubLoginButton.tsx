'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import gitlogin from 'public/gitlogin.png';
import './GithubLoginButton.scss';

import GithubLogin from '@/api/login/loginAPI';
import useAuthStore from '@/store/authStore';
import { getGithubAuthUrl } from '@/api/constant/githubLoginConstants';

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
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!;
    const githubAuthUrl = getGithubAuthUrl(client_id);
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
