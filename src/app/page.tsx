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
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          const { userId, name, profileUrl, description } = json.data;
          setUserInfo({ userId, name, profileUrl, description });
        }
      } catch (error) {
        console.error('유저 정보 요청 실패:', error);
      }
    };

    fetchUserInfo();
  }, [accessToken, setUserInfo]);

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
