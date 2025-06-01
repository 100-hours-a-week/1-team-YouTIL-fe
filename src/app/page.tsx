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
  const { callApi } = useFetch();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  console.log("cicd 테스트")
  const fetchUserInfoWithRetry = async (): Promise<UserInfoResponse['data']> => {
    const token = accessToken ?? '';
    try {
      const result = await callApi<UserInfoResponse>({
        method: 'GET',
        endpoint: '/users?userId=',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const { userId, name, profileUrl, description } = result.data;
      setUserInfo({ userId, name, profileUrl, description });
      return result.data;

    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith('HTTP 401')) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?userId=`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newToken = response.headers.get('authorization')?.replace('Bearer ', '');
        if (!newToken) throw new Error('새 accessToken을 받아오지 못했습니다');

        setAccessToken(newToken);

        // 새 토큰으로 재요청
        const retryResult = await callApi<UserInfoResponse>({
          method: 'GET',
          endpoint: '/users?userId=',
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          credentials: 'include',
        });

        const { userId, name, profileUrl, description } = retryResult.data;
        setUserInfo({ userId, name, profileUrl, description });
        return retryResult.data;
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
