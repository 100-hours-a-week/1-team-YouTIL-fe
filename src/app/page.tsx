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
    queryKey: ['user-info'] as const,
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
    staleTime: 3600000,
    gcTime: 3600000,
    //프로필 변경 post 요청 시 수동 갱신
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
