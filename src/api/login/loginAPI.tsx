import useAuthStore from '@/store/authStore';

const GithubLogin = async (authorizationCode: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
    }

    const res = await fetch(`${baseUrl}/users/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorizationCode,
      }),
    });

    if (!res.ok) {
      throw new Error(`서버 응답 오류: ${res.status}`);
    }

    const response = await res.json();
    const accessToken = response.data.accessToken;

    useAuthStore.getState().setAccessToken(accessToken);

    return response.data;
  } catch (error) {
    console.error('GitHub 로그인 오류:', error);
    throw error;
  }
};

export default GithubLogin;
