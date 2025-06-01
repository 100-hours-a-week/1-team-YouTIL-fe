'use client';

import './page.scss';
import { useQuery } from '@tanstack/react-query';
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
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const fetchUserInfo = async (token: string): Promise<UserInfoResponse['data']> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      throw { code: 401 };
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    const { userId, name, profileUrl, description } = json.data;
    setUserInfo({ userId, name, profileUrl, description });
    return json.data;
  };

  const fetchUserInfoWithRetry = async (): Promise<UserInfoResponse['data']> => {
    const token = accessToken ?? '';
    try {
      return await fetchUserInfo(token);
    } catch (err: any) {
      if (err.code === 401) {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: 'Bearer ',
          },
        });

        const newToken = refreshRes.headers.get('authorization')?.replace('Bearer ', '');
        if (!newToken) throw new Error('새 accessToken을 받아오지 못했습니다');

        setAccessToken(newToken);
        return await fetchUserInfo(newToken);
      }

      throw err;
    }
  };

  useQuery({
    queryKey: ['user-info'],
    queryFn: fetchUserInfoWithRetry,
    staleTime: 3600000,
    gcTime: 3600000,
    refetchOnWindowFocus: false,
  });

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
