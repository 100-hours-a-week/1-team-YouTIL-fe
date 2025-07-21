'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import Image from 'next/image';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import Markdown from 'react-markdown';
import './CommunityDetail.scss';
import { communityKeys } from '@/querykey/community.querykey';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const whiteTheme = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    background: '#ffffff',
  },
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    background: '#ffffff',
  },
};

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

const CommunityDetailPage = () => {
  const { tilId } = useParams();
  const tilIdNumber = Number(tilId);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const queryClient = useQueryClient();

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

  if (isLoading || !communityDetailData) {
    return <article className="community-detail community-detail--skeleton" />;
  }

  return (
    <article className="community-detail">
      <h1 className="community-detail__title">{communityDetailData.title}</h1>

      <header className="community-detail__meta">
        <Link href={`/profile/${communityDetailData.userId}`}>
          <div style={{ width: 24, height: 24, position: 'relative' }}>
            <Image
              src={communityDetailData.profileImageUrl}
              alt={`${communityDetailData.author}의 프로필 이미지`}
              width={24}
              height={24}
              className="community-detail__profile-image"
            />
          </div>
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

      <section
        className="community-detail__content"
        style={{ minHeight: 300 }}
        onCopy={async (e) => {
          e.preventDefault();
          await navigator.clipboard.writeText(communityDetailData.content);
        }}
      >
        <Markdown
          components={{
            code({ className, children, ...rest }) {
              const match = /language-(\w+)/.exec(className || '');
              if (match) {
                return (
                  <SyntaxHighlighter
                    style={whiteTheme}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {communityDetailData.content}
        </Markdown>
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
