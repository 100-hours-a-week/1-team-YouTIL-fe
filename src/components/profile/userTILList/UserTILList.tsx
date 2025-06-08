'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import useAuthStore from '@/store/useAuthStore';
import { parseISO, format } from 'date-fns';
import Image from 'next/image';
import './UserTILList.scss';

interface TILItem {
  id: number;
  userName: string;
  userProfileImageUrl: string;
  tilId: number;
  title: string;
  tags: string[];
  createdAt: string;
}

interface TILResponse {
  data: {
    tils: TILItem[];
  };
}

const UserTILList = () => {
  const { callApi } = useFetch();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { userId } = useParams<{ userId: string }>();

  const { data, isError } = useQuery({
    queryKey: ['user-tils', userId],
    queryFn: async () => {
      return await callApi<TILResponse>({
        method: 'GET',
        endpoint: `/users/${userId}/tils?page=0&offset=20`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    enabled: !!userId,
    staleTime: 300000,
    gcTime: 300000,
  });

  if (isError || !data) return <div>에러가 발생했습니다.</div>;

  return (
    <div className="usertil-list">
      {data.data.tils.map((til) => (
        <div key={til.tilId} className="usertil-list__item">
          <div className="usertil-list__header">
            <p className="usertil-list__title">{til.title}</p>
          </div>

          <div className="usertil-list__tags">
            {til.tags.map((tag, i) => (
              <span key={i} className="usertil-list__tag">
                #{tag}
              </span>
            ))}
          </div>

          <div className="usertil-list__footer">
            <Link href={`/profile/${userId}`}>
              <Image
                src={til.userProfileImageUrl}
                alt={`${til.userName}의 프로필 이미지`}
                width={24}
                height={24}
                className="usertil-list__profile-image"
              />
            </Link>
            <Link href={`/profile/${userId}`} className="usertil-list__nickname">
              {til.userName}
            </Link>

            <span className="usertil-list__views">조회수 0</span>
            <span className="usertil-list__likes">추천 0</span>
           

            <span className="usertil-list__date">
              {format(parseISO(til.createdAt), 'yyyy-MM-dd : HH:mm:ss')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTILList;
