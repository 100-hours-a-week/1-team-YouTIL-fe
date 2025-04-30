'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import gitlogin from 'public/gitlogin.png';
import './GithubLoginButton.scss';

const GithubLoginButton = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {

      fetch('http://34.22.84.164:8080/api/v1/users/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizationCode: code,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
          }
          const response = await res.json();

          //예시: 토큰 저장 후 메인 페이지 이동
          localStorage.setItem('accessToken', response.data.accessToken);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('GitHub 로그인 오류:', error);
        });
    }
  }, [searchParams]);

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
