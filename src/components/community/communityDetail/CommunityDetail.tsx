'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import Image from 'next/image';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import './CommunityDetail.scss';
import { communityKeys } from '@/querykey/community.querykey';
import dynamic from 'next/dynamic';

const MarkdownRenderer = dynamic(() => import('@/components/common/MarkdownRenderer'), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
});

interface Props {
  onRendered?: () => void;
}

interface CommunityDetail {
  postId: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: string;
  profileImageUrl: string;
  recommend_count: number;
  liked: boolean;
  visited_count: number;
  comments_count: number;
  userId: number;
}

interface CommunityDetailResponse {
  code: string;
  message: string;
  success: boolean;
  responseAt: string;
  data: CommunityDetail;
}

const CommunityDetailPage = ({ onRendered }: Props) => {
  const { tilId } = useParams();
  const tilIdNumber = Number(tilId);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const queryClient = useQueryClient();

  const contentRef = useRef<HTMLDivElement>(null);

  const {
    data: communityDetailData,
    isLoading,
  } = useQuery<CommunityDetail>({
    queryKey: communityKeys.detail(tilIdNumber).queryKey,
    queryFn: async () => {
      const response = await callApi<CommunityDetailResponse>({
        method: 'GET',
        endpoint: `/community/${tilIdNumber}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data;
    },
    enabled: !!tilId && existAccess,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      return await callApi({
        method: 'POST',
        endpoint: `/community/${tilIdNumber}/like`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.setQueryData<CommunityDetail>(
        communityKeys.detail(tilIdNumber).queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            liked: !oldData.liked,
            recommend_count: oldData.liked
              ? oldData.recommend_count - 1
              : oldData.recommend_count + 1,
          };
        }
      );
    },
  });

  useEffect(() => {
    if (!contentRef.current) return;

    const handle = requestAnimationFrame(() => {
      if (onRendered) onRendered();
    });

    return () => cancelAnimationFrame(handle);
  }, [onRendered]);

  if (isLoading || !communityDetailData) return;

  return (
    <article className="community-detail">
      <div className="community-detail__head">
        <h1 className="community-detail__title">{communityDetailData.title}</h1>

        <header className="community-detail__meta">
          <Link href={`/profile/${communityDetailData.userId}`}>
            <Image
              src={communityDetailData.profileImageUrl}
              alt={`${communityDetailData.author}의 프로필 이미지`}
              width={24}
              height={24}
              className="community-detail__profile-image"
            />
          </Link>
          <Link
            href={`/profile/${communityDetailData.userId}`}
            className="community-detail__nickname"
          >
            {communityDetailData.author}
          </Link>
          <span className="community-detail__count">
            조회수 {communityDetailData.visited_count}
          </span>
          <span className="community-detail__count">
            추천 {communityDetailData.recommend_count}
          </span>
          <span className="community-detail__date">
            {new Date(communityDetailData.createdAt).toLocaleString()}
          </span>
        </header>

        <div className="community-detail__tags">
          {communityDetailData.tags.map((tag, i) => (
            <span key={i} className="community-detail__tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <section
        className="community-detail__content"
        onCopy={async (e) => {
          e.preventDefault();
          await navigator.clipboard.writeText(communityDetailData.content);
        }}
        ref={contentRef}
      >
        <MarkdownRenderer content={communityDetailData.content} />
      </section>

      <button
        className={`community-detail__like-button ${
          communityDetailData.liked ? 'community-detail__like-button--active' : ''
        }`}
        onClick={() => toggleLike()}
      >
        추천 {communityDetailData.recommend_count}
      </button>
    </article>
  );
};

export default CommunityDetailPage;
