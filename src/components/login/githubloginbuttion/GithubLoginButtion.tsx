'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
    const redirectUri = 'http://localhost:3000/login';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>
        깃허브 로그인 버튼
      </button>
    </div>
  );
};

export default GithubLoginButton;
