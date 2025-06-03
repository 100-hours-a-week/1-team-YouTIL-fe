'use client';

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

const RefreshAccess = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const checkAndRefresh = async () => {
      console.log("asdf");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log("res = ", res);
        if (res.status === 401) {
          const newAccessToken = res.headers.get("Authorization")?.replace("Bearer ", '');
          console.log(newAccessToken);
          if (newAccessToken) {
            console.log(newAccessToken);
            setAccessToken(newAccessToken);
          } else {
            console.warn("401 발생, accessToken 없음");
          }
        }
      } catch (err) {
        console.warn("refresh 요청 실패 (무시 가능):", err);
        console.log("요청 실패(catch)")
      }
    };

    checkAndRefresh();
  }, [setAccessToken]);

  return null;
};

export default RefreshAccess;
