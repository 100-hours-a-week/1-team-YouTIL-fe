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
    const fetchUserInfoWithToken = async (token: string): Promise<Response | null> => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const { userId, name, profileUrl, description } = json.data;
        setUserInfo({ userId, name, profileUrl, description });
        return res;
      }
      return res;
    };

    const fetchUserInfoWithRetry = async () => {
      const userRes = await fetchUserInfoWithToken(accessToken ?? '');
      if (userRes && userRes.status !== 401) return;

      if (userRes?.status === 401) {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news`, {
          method: 'GET',
          credentials: 'include',
        });

        const newToken = refreshRes.headers.get('authorization')?.replace('Bearer ', '');
        if (!newToken) return;

        setAccessToken(newToken);
        await fetchUserInfoWithToken(newToken);
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
