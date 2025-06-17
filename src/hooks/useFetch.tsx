import { useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseFetchParams {
  method: HttpMethod;
  endpoint: string;
  body?: unknown | null;
  headers?: Record<string, string> | null;
  credentials?: RequestCredentials;
  isFormData?: boolean;
}

interface FetchError {
  status: number;
  message: string;
}

export const useFetch = () => {
  const callApi = useCallback(
    async <T,>(params: UseFetchParams): Promise<T> => {
      const {
        method,
        endpoint,
        body = null,
        headers = null,
        credentials = 'same-origin',
        isFormData = false,
      } = params;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return Promise.reject({
          status: 500,
          message: '환경변수 NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.',
        });
      }

      const mergedHeaders: Record<string, string> = {
        ...(headers || {}),
      };

      if (!('Content-Type' in mergedHeaders) && !isFormData) {
        mergedHeaders['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        credentials,
        headers: mergedHeaders,
        body: body
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
          : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return Promise.reject({
          status: response.status,
          message: errorText,
        } as FetchError);
      }

      return response.json();
    },
    []
  );

  return { callApi };
};
