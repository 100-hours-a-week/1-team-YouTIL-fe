'use client';

import Image from 'next/image';
import { getGithubAuthUrl } from '@/api/constant/githubLoginConstants';
import './LoginButton.scss';

const LoginButton = () => {
  const handleLogin = () => {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!;
    const githubAuthUrl = getGithubAuthUrl(client_id);
    window.location.href = githubAuthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="github-login-button"
      aria-label="GitHub 로그인 버튼"
      role="button"
    >
      <Image
        src="/images/githubLoginButton.png"
        alt="GitHub 로그인"
        width={325}
        height={45}
        priority
      />
    </button>
  );
};

export default LoginButton;
