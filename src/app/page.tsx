'use client';

import './page.scss';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/authStore';
import useUserInfoStore from '@/store/userInfoStore';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/description/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/description/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/description/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';
import useCheckAccess from '@/hooks/useCheckExistAccess';

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
  const existAccess = useCheckAccess(accessToken);

  useQuery<UserInfoResponse['data']>({
    queryKey: ['user-info', accessToken] as const,
    queryFn: async () => {
      const result = await callApi<UserInfoResponse>({
        method: 'GET',
        endpoint: '/users?userId=',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      const { userId, name, profileUrl, description } = result.data;
      setUserInfo({ userId, name, profileUrl, description });
      return result.data;
    },
    enabled: existAccess,
    staleTime: 3600000, // 1시간
    gcTime: 3600000,
    retry: 1,
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
