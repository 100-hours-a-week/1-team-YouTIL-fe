'use client';

import { useEffect } from 'react';
import './page.scss';
import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/useAuthStore';
import useUserInfoStore from '@/store/useUserInfoStore';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/main/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/main/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/main/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';

interface UserInfoResponse {
  data: {
    userId: number;
    name: string;
    profileUrl: string;
    description: string;
  };
}

const Main = () => {
  const { callApi } = useFetch();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await callApi<UserInfoResponse>({
          method: 'GET',
          endpoint: '/users?userId=',
          headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
          },
          credentials: 'include',
        });

        const { userId, name, profileUrl, description } = result.data;
        setUserInfo({ userId, name, profileUrl, description });
      } catch (error) {
        console.error('유저 정보 요청 실패:', error);
      }
    };

    fetchUserInfo();

  }, [accessToken, callApi, setUserInfo]);

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
