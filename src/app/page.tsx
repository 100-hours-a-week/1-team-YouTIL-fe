'use client';

import { useEffect } from 'react';
import './page.scss';
import useAuthStore from '@/store/useAuthStore';
import useUserInfoStore from '@/store/useUserInfoStore';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/main/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/main/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/main/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';

const Main = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    console.log('초기 accessToken:', accessToken);

    const fetchUserInfoWithToken = async (token: string) => {
      const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error(`HTTP ${result.status}`);
      }

      const json = await result.json();
      const { userId, name, profileUrl, description } = json.data;
      setUserInfo({ userId, name, profileUrl, description });
    };

    const fetchUserInfoWithRetry = async () => {
      try {
        await fetchUserInfoWithToken(accessToken ?? '');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('[디버그] fetch 실패:', message);
        console.log('accessToken 재시도 로직 실행');

        try {
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
            method: 'GET',
            credentials: 'include',
          });

          const newToken = refreshRes.headers.get('authorization')?.replace('Bearer ', '');
          console.log("newToken = ", newToken)
          if (!newToken) throw new Error('accessToken 재발급 실패');

          console.log('새로 발급된 accessToken:', newToken);
          setAccessToken(newToken);

          // 새 토큰으로 다시 유저 정보 요청
          await fetchUserInfoWithToken(newToken);
        } catch (refreshError) {
          console.error('refresh 실패:', refreshError);
        }
      }
    };

    fetchUserInfoWithRetry();
  }, [accessToken, setAccessToken, setUserInfo]);

  return (
    <div className="main-page">
      <WelcomeDescription />
      <TechNews />
      <div className="main-page__space--top" />
      <TILRecordDescription />
      <Heatmap />
      <div className="main-page__space--top" />
      <NewTILDescription />
      <NewTILList />
    </div>
  );
};

export default Main;
