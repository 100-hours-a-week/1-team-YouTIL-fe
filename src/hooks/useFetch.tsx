import { useCallback } from 'react';
import useAuthStore from '@/store/useAuthStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface UseFetchParams {
  method: HttpMethod;
  endpoint: string;
  body?: unknown | null;
  headers?: Record<string, string> | null;
  credentials?: RequestCredentials;
}

export const useFetch = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const callApi = useCallback(
    async <T,>(params: UseFetchParams): Promise<T> => {
      const {
        method,
        endpoint,
        body = null,
        headers = null,
        credentials = 'same-origin',
      } = params;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error('환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        credentials,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      console.log("asdf1")
      const newAccessToken = response.headers.get('Authorization')?.replace('Bearer ', '');
      console.log("asdf2");
      if (newAccessToken) {
        console.log('새 accessToken 발급됨:', newAccessToken); 
        setAccessToken(newAccessToken);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return response.json();
    },
    [setAccessToken]
  );

  return { callApi };
};
