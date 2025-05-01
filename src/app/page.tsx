'use client';

import { useEffect } from 'react';
import getUserInfo from '@/api/userInfo/userInfoAPI';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/description/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/description/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/description/newTILDescription/NewTILDescription';

const Main = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo();
        console.log('유저 정보:', user);
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };

    fetchUser();
  }, []);


  return (
    <div className="main-page">
      <div className="main-space-1"></div>
      <WelcomeDescription />
      <TechNews />
      <div className="main-space-1"></div>
      <TILRecordDescription />
      <Heatmap />
      <div className="main-space-1"></div>
      <NewTILDescription />
    </div>
  );
};

export default Main;
