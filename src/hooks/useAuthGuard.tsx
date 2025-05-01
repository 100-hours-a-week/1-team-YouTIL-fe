'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuthGuard =() =>{
    const router = useRouter();

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.replace('/login');
      }
    }, [router]);
}

export default useAuthGuard;