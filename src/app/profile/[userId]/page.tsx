'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/useAuthStore';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import UserNickNameDescription from '@/components/profile/userNickNameDescription/UserNickNameDescription';
import UserProfileInfo from '@/components/profile/userProfileInfo/UserProfileInfo';
import UserTILButton from '@/components/profile/userTILButton/UserTILButton';

interface OtherUserInfo {
  userId: number;
  name: string;
  profileUrl: string;
  description: string | null;
}

interface OtherUserInfoResponse {
  data: OtherUserInfo;
}

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = Number(userId);

  const accessToken = useAuthStore((state) => state.accessToken);
  const { callApi } = useFetch();
  const existAccess = useCheckAccess(accessToken);
  const setOtherUserInfo = useOtherUserInfoStore((state) => state.setOtherUserInfo);
  const resetOtherUserInfo = useOtherUserInfoStore((state) => state.clearOtherUserInfo);

  useEffect(() => {
    resetOtherUserInfo();
  }, [parsedUserId, resetOtherUserInfo]);

  const { isError } = useQuery<OtherUserInfo>({
    queryKey: ['otheruser-info', parsedUserId],
    queryFn: async () => {
      const response = await callApi<OtherUserInfoResponse>({
        method: 'GET',
        endpoint: `/users?userId=${parsedUserId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      const { description, name, profileUrl, userId: uid } = response.data;
      setOtherUserInfo({ description, name, profileUrl, userId: uid });

      return response.data;
    },
    enabled: !!parsedUserId && existAccess,
    staleTime: 0,
    gcTime: 3600000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  if (isError) return <div>유저 정보를 불러오는 데 실패했습니다.</div>;

  return (
    <div>
      <UserNickNameDescription />
      <UserProfileInfo />
      <UserTILButton />
    </div>
  );
};

export default ProfilePage;
