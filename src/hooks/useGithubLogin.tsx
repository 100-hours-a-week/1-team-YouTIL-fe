import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/authStore';

interface GithubLoginResponse {
  data: {
    accessToken: string;
  };
}

export const useGithubLogin = () => {
  const { callApi } = useFetch();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const login = async (authorizationCode: string) => {
    const response = await callApi<GithubLoginResponse>({
      method: 'POST',
      endpoint: '/users/github',
      body: { authorizationCode },
      credentials: 'include',
    });

    setAccessToken(response.data.accessToken);
    return response.data;
  };

  return { login };
};
