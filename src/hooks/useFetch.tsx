import { useCallback } from 'react';
import { refreshAccess } from '@/lib/refreshAccess';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface UseFetchParams {
  method: HttpMethod;
  endpoint: string;
  body?: unknown | null;
  headers?: Record<string, string> | null;
  credentials?: RequestCredentials;
}

export const useFetch = () => {
  const callApi = useCallback(
    async <T,>(params: UseFetchParams): Promise<T> => {
      const { method, endpoint, body = null, headers = null } = params;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error('환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
      }

      // await refreshAccess();

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      // response.headers.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      //   if (key.toLowerCase() === 'authorization' && value.startsWith('Bearer ')) {
      //     const newAccessToken = value.replace('Bearer ', '').trim();
      //     console.log('새 accessToken:', newAccessToken);
      //   }
      //       // await new Promise((resolve) => setTimeout(resolve, 10000));
      // });

      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return response.json();
    },
    []
  );

  return { callApi };
};
