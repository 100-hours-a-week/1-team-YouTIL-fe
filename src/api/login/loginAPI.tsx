import { BASE_URL } from '../constant/apiConstants';
import useAuthStore from '@/store/authStore';

const GithubLogin = async (authorizationCode: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/github`, {
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
