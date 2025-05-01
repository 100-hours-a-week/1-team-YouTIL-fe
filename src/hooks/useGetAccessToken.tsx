'use client';

const useGetAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('accessToken');
};

export default useGetAccessToken;
