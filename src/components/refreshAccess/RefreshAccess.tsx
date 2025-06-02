'use client';

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

const RefreshAccess = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const checkAndRefresh = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.status === 401) {
          const newAccessToken = res.headers.get("Authorization")?.replace("Bearer ", '');
          if (newAccessToken) {
            setAccessToken(newAccessToken);
          }
        }
    };

    checkAndRefresh();
  }, [setAccessToken]);

  return null;
};

export default RefreshAccess;
