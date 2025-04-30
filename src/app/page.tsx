'use client';

import { redirect } from 'next/navigation';
import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/description/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/description/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';

const main = () => {
  // redirect('/login');
  return (
    <div className="main-page">
      <div className="main-space-1"></div>
      <WelcomeDescription/>
      <TechNews/>
      
      <div className="main-space-1"></div>
      <TILRecordDescription/>
      <Heatmap/>
    </div>
  )
};

export default main;
