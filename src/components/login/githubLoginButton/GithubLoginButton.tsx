'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import gitlogin from "public/gitlogin.png"
import Image from "next/image";
import "./GithubLoginButton.scss";

const GithubLoginButton = () => {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      console.log('깃허브에서 받은 code:', code);
    }
  }, [searchParams]);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    // const redirectUri = 'http://localhost:3000/login';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read%3Auser%20user%3Aemail`;

    window.location.href = githubAuthUrl;
  };

  return (
      <Image onClick={handleLogin}
      src={gitlogin}
      alt="YouTIL Logo"
      width={325}
      height={45}
      priority
      className="github-login-button"
      />
  );
};

export default GithubLoginButton;
