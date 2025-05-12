'use client';

import { useEffect } from 'react';
import getUserInfo from '@/api/userInfo/userInfoAPI';

import './page.scss';
import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/description/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/description/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/description/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';


const Main = () => {
  useEffect(() => {
    (async () => {
      try {
        await getUserInfo();
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    })();
  }, []);

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
