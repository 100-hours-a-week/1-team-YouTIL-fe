'use client';

import { useEffect } from 'react';
import './page.scss';
// import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/useAuthStore';
import useUserInfoStore from '@/store/useUserInfoStore';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/main/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/main/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/main/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';

// interface UserInfoResponse {
//   data: {
//     userId: number;
//     name: string;
//     profileUrl: string;
//     description: string;
//   };
// }

const Main = () => {
  // const { callApi } = useFetch();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    console.log('초기 accessToken:', accessToken);

    const fetchUserInfoWithToken = async (token: string) => {
      console.log('요청에 사용된 accessToken:', token);

      const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      const json = await result.json();
      const { userId, name, profileUrl, description } = json.data;
      setUserInfo({ userId, name, profileUrl, description });
    };

    const fetchUserInfoWithRetry = async () => {
      console.log("asdf");
      try {
        // 1차 요청
        await fetchUserInfoWithToken(accessToken ?? '');
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          try {
            console.log('accessToken 만료됨, refresh 시도');

            const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ',
              },
            });

            const newToken = refreshRes.headers.get('authorization')?.replace('Bearer ', '');

            if (!newToken) throw new Error('accessToken 재발급 실패');

            console.log('새로 발급된 accessToken:', newToken);
            setAccessToken(newToken);

            // 3차 요청
            await fetchUserInfoWithToken(newToken);
          } catch (refreshError) {
            console.error('refresh 실패:', refreshError);
          }
        } else {
          console.error('유저 정보 요청 실패:', error);
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
