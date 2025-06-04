'use client';

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

const RefreshAccess = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const checkAndRefresh = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/refresh`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status === 401) {
          const newAccessToken = response.headers.get("Authorization")?.replace("Bearer ", '');
          if (newAccessToken) {
            setAccessToken(newAccessToken);
          } 
          else {
            console.warn("401 발생, accessToken 없음");
          }
        }
      } catch {
      }
    };

    checkAndRefresh();
  }, [setAccessToken]);

  return null;
};

export default RefreshAccess;
