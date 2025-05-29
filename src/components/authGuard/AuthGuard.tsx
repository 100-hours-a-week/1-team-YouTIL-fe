'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const accessToken = useGetAccessToken();

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      router.replace('/login');
    }
    setIsChecked(true);
  }, [accessToken, router]);

  if (!isChecked || !isAuthenticated) return null;

  return <>{children}</>;
};

export default AuthGuard;
