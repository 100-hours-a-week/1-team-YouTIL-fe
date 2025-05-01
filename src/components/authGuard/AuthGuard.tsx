'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGetAccessToken from '@/hooks/useGetAccessToken';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false); // accessToken 체크 완료 여부
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = useGetAccessToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.replace('/login');
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default AuthGuard;
