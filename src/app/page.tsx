'use client';

import { useQuery } from '@tanstack/react-query';
import './page.scss';

import useAuthStore from '@/store/useAuthStore';
import useUserInfoStore from '@/store/useUserInfoStore';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useFetch } from '@/hooks/useFetch';

import Heatmap from '@/components/main/heatmap/Heatmap';
import TILRecordDescription from '@/components/main/TILRecordDescription/TILRecordDescription';
import WelcomeDescription from '@/components/main/welcomeDescription/WelcomeDescription';
import TechNews from '@/components/main/techNews/TechNews';
import NewTILDescription from '@/components/main/newTILDescription/NewTILDescription';
import NewTILList from '@/components/main/newTILList/NewTILList';
import { mainKeys } from '@/querykey/main.querykey';

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
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const existAccess = useCheckAccess(accessToken);
  const { callApi } = useFetch();

  useQuery<UserInfoResponse>({
    queryKey: mainKeys.userInfo().queryKey,
    queryFn: async () => {
      const response = await callApi<UserInfoResponse>({
        method: 'GET',
        endpoint: '/users?userId=',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      const { userId, name, profileUrl, description } = response.data;
      setUserInfo({ userId, name, profileUrl, description });

      return response;
    },
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
  });

  return (
    <div className="main-page">
      <WelcomeDescription />
      <TechNews />
      <TILRecordDescription />
      <Heatmap />
      <NewTILDescription />
      <NewTILList />
    </div>
  );
};

export default Main;
