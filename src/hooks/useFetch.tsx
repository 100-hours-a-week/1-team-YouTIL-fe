import { BASE_URL } from '@/api/constant/apiConstants';
import { useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface UseFetchParams {
  method: HttpMethod;
  endpoint: string;
  body?: unknown | null;
  headers?: Record<string, string> | null;
}

export const useFetch = () => {
  const callApi = useCallback(
    <T,>(params: UseFetchParams): Promise<T> => {
      const { method, endpoint, body = null, headers = null } = params;

      return (async () => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
          },
          body: body ? JSON.stringify(body) : undefined,
        });

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
