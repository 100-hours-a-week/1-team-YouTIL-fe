'use client';

import useAuthStore from '@/store/useAuthStore';

const useGetAccessToken = (): string | null => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken;
};

export default useGetAccessToken;
