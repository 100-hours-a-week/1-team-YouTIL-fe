'use client';

import Link from 'next/link';
import './NewTILList.scss';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { parseISO, format } from 'date-fns';
import { mainKeys } from '@/querykey/main.querykey';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TILResponse {
  data: TILItem[];
}

interface TILItem {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  title: string;
  category: string;
  tags: string[];
  recommendCount: number;
  visitedCount: number;
  commentsCount: number;
  createdAt: string;
}

const NewTILList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const router = useRouter();

  const { data: tils, isError } = useQuery<TILItem[]>({
    queryKey: mainKeys.newTILList().queryKey,
    // queryKey: ['recent-tils'],
    queryFn: async () => {
      const response = await callApi<TILResponse>({
        method: 'GET',
        endpoint: '/community/recent-tils',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data;
    },
    enabled: existAccess,
    staleTime: 600000,
    gcTime: 1800000,
  });

  if (isError) {
    return <p className="til-list__error">TIL 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="til-list">
      {tils?.map((til) => (
        <div key={til.id} className="til-list__card"   
          onClick={() => {
          router.push(`/community/${til.id}`);
          document.body.scrollTo({ top: 0, behavior: 'auto' })
        }} >
          <div className="til-list__header">
            <p className="til-list__title">{til.title}</p>
          </div>
          <div className="til-list__tags">
            {til.tags.map((tag, i) => (
              <span key={i} className="til-list__tag">#{tag}</span>
            ))}
          </div>
          <div className="til-list__footer">
            <Link href={`/profile/${til.userId}`} 
              onClick={(e) => e.stopPropagation()}>
              <Image
                src={til.profileImageUrl}
                alt={`${til.nickname}의 프로필 이미지`}
                width={32}
                height={32}
                className="til-list__profile-image"
              />
            </Link>
            <Link href={`/profile/${til.userId}`} className="til-list__nickname"
              onClick={(e) => e.stopPropagation()}>
              {til.nickname}
            </Link>

            <span className="til-list__views">조회수 {til.visitedCount}</span>
            <span className="til-list__likes">추천 {til.recommendCount}</span>
            <span className="til-list__date">
              {format(parseISO(til.createdAt), 'yyyy-MM-dd : HH:mm:ss')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewTILList;
