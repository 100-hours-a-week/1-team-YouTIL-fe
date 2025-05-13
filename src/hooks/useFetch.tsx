import { useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface UseFetchParams {
  method: HttpMethod;
  endpoint: string;
  body?: unknown | null;
  headers?: Record<string, string> | null;
  credentials?: RequestCredentials; // ✅ 'include' | 'same-origin' | 'omit'
}

export const useFetch = () => {
  const callApi = useCallback(
    <T,>(params: UseFetchParams): Promise<T> => {
      const { method, endpoint, body = null, headers = null, credentials } = params;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error('환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
      }

      return (async () => {
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
          },
          body: body ? JSON.stringify(body) : undefined,
          ...(credentials ? { credentials } : {}),
        };

        const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
      })();
    },
    []
  );

  return { callApi };
};
