'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/description/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/description/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';

const Main = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken:', accessToken);

    if (!accessToken) {
      router.replace('/login');
    }
  }, [isClient, router]);

  return (
    <div className="main-page">
      <div className="main-space-1"></div>
      <WelcomeDescription />
      <TechNews />
      <div className="main-space-1"></div>
      <TILRecordDescription />
      <Heatmap />
    </div>
  );
};

export default Main;
