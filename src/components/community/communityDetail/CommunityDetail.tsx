'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import Markdown from 'react-markdown';
import './CommunityDetail.scss';

interface TILDetail {
  author: string;
  content: string;
  createdAt: string;
  tags: string[];
  title: string;
  visited_count: number;
  recommend_count: number;
}

const CommunityDetailPage = () => {
  const { tilId } = useParams();
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const { data: communityDetailData, isLoading } = useQuery({
    queryKey: ['community-detail', tilId],
    queryFn: async () => {
      const response = await callApi<{ data: TILDetail }>({
        method: 'GET',
        endpoint: `/community/${tilId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      console.log(response)
      return response?.data;
    },
    enabled: !!tilId && existAccess,
  });

  if (isLoading || !communityDetailData) return <p>Loading...</p>;

  return (
    <div className="community-detail">
      <h1 className="community-detail__title">{communityDetailData.title}</h1>

      <div className="community-detail__meta">
        <span className="community-detail__author">{communityDetailData.author}</span>
        <span className="community-detail__count">조회수 {communityDetailData.visited_count}</span>
        <span className="community-detail__count">추천 {communityDetailData.recommend_count}</span>
        <span className="community-detail__date">
          {new Date(communityDetailData.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="community-detail__tags">
        {communityDetailData.tags.map((tag, i) => (
          <span key={i} className="community-detail__tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="community-detail__content"
        onCopy={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(communityDetailData.content);
            }}>
        <Markdown>{communityDetailData.content}</Markdown>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
