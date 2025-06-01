'use client';

import useAuthStore from '@/store/useAuthStore';

interface GithubLoginResponse {
  data: {
    accessToken: string;
  };
}

export const useGithubLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const login = async (authorizationCode: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
    }

    const response = await fetch(`${baseUrl}/users/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ authorizationCode }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result: GithubLoginResponse = await response.json();
    const accessToken = result.data.accessToken;
    console.log("useGithubLogin accessToken = ", accessToken);
    setAccessToken(accessToken);

    return result.data;
  };

  return { login };
};
