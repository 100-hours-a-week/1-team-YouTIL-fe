'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { callApi } = useFetch();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isChecked, setIsChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await callApi({
          method: 'GET',
          endpoint: '/community/recent-tils',
          credentials: 'include',
        });

        setIsAuthenticated(true);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.startsWith('HTTP 401')) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/community/recent-tils`,
              {
                method: 'GET',
                credentials: 'include',
              }
            );
            const newAccessToken = response.headers.get('authorization')?.replace('Bearer ', '');
            if (newAccessToken) {
              setAccessToken(newAccessToken);

              await callApi({
                method: 'GET',
                endpoint: '/community/recent-tils',
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                credentials: 'include',
              });

              setIsAuthenticated(true);
              return;
            }

            router.replace('/login');
          } catch {
            router.replace('/login');
          }
        } else {
          router.replace('/login');
        }
      } finally {
        setIsChecked(true);
      }
    };

    checkAuth();
  }, [callApi, router, setAccessToken]);

  if (!isChecked || !isAuthenticated) return null;

  return <>{children}</>;
};

export default AuthGuard;
