'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export const useRefreshAccess = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const router = useRouter();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const refreshIfExpired = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const authHeader = response.headers.get('Authorization');

        if (authHeader?.startsWith('Bearer ')) {
          const newAccessToken = authHeader.replace('Bearer ', '').trim();
          setAccessToken(newAccessToken);
          router.replace('/');
        }

      } catch (err) {
        console.error('accessToken 확인 실패:', err);
      }
    };

    refreshIfExpired();
  }, []);
};
