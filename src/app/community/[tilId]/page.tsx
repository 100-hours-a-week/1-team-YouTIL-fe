'use client';

import { useQuery } from '@tanstack/react-query';
import CommunityDetail from '@/components/community/communityDetail/CommunityDetail';
import CommunityComment from '@/components/community/communityComment/CommunityComment';
import useUserInfoStore from '@/store/useUserInfoStore';
import useAuthStore from '@/store/useAuthStore';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useFetch } from '@/hooks/useFetch';
import { profileKeys } from '@/querykey/profile.querykey';
import { useLayoutEffect } from 'react';

interface UserInfo {
  userId: number;
  name: string;
  profileUrl: string;
  description: string;
}

interface UserInfoResponse {
  data: UserInfo;
}

const CommunityDetailPage = () => {

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
  const accessToken = useAuthStore((state) => state.accessToken);
  const { callApi } = useFetch();
  const existAccess = useCheckAccess(accessToken);

  const setMyUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const myUserInfo = useUserInfoStore((state) => state.userInfo);

  const { isLoading, isError } = useQuery<UserInfoResponse>({
    queryKey: profileKeys.userInfo().queryKey,
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
      setMyUserInfo({ userId, name, profileUrl, description });

      return response;
    },
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  if (isLoading || !myUserInfo.userId) return null;
  if (isError) return <div>유저 정보를 불러오는 데 실패했습니다.</div>;

  return (
    <div>
      <CommunityDetail/>
       <CommunityComment />
    </div>
  );
};

export default CommunityDetailPage;
