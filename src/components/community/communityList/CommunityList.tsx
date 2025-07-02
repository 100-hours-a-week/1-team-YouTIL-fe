'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCommunityNavigationStore } from '@/store/useCommunityNavigationStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { parseISO, format } from 'date-fns';
import './CommunityList.scss';

interface CommunityItem {
  tilId: number;
  userId: number;
  useName: string;
  author: string;
  category: string;
  title: string;
  tags: string[];
  profileImageUrl: string;
  createdAt: string;
  visited_count: number;
  recommend_count: number;
  comments_count: number;
}

interface CommunityResponse {
  data: {
    tils: CommunityItem[];
  };
}

const CommunityList = () => {
  const { selectedCategory } = useCommunityNavigationStore();
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const floatingRef = useRef<HTMLDivElement>(null);

  const {
    data: communityPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['community-list', selectedCategory],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<CommunityResponse>({
        method: 'GET',
        endpoint: `/community?category=${selectedCategory}&page=${pageParam}&offset=10`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.tils.length < 10;
      return isLast ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: !!selectedCategory && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  const loadMoreRef = useInfinityScrollObserver<HTMLDivElement>({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const allCommunityTils = [
    ...new Map(
      (communityPages?.pages.flatMap((page) => page.data.tils) ?? []).map((item) => [item.tilId, item])
    ).values(),
  ];

  const handleScrollTop = () => {
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const updateFloatingPosition = () => {
      const frame = document.querySelector('.layout__frame');
      const buttons = floatingRef.current;

      if (!frame || !buttons) return;

      const rect = frame.getBoundingClientRect();
      buttons.style.left = `${rect.right - 42}px`;
      buttons.style.bottom = '70px';
    };

    updateFloatingPosition();
    window.addEventListener('resize', updateFloatingPosition);
    window.addEventListener('scroll', updateFloatingPosition);

    return () => {
      window.removeEventListener('resize', updateFloatingPosition);
      window.removeEventListener('scroll', updateFloatingPosition);
    };
  }, []);

  return (
    <>
      <div className="community-list">
        {allCommunityTils.map((item, index) => {
          const isLastItem = index === allCommunityTils.length - 1;

          return (
            <div
              key={item.tilId}
              className="community-list__item"
              ref={isLastItem ? loadMoreRef : null}
            >
              <div className="community-list__header">
                <p className="community-list__title">{item.title}</p>
              </div>

              <div className="community-list__tags">
                {item.tags.map((tag, i) => (
                  <span key={i} className="community-list__tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="community-list__footer">
                <Link href={`/profile/${item.userId}`}>
                  <img
                    src={item.profileImageUrl}
                    alt={`${item.useName} 프로필 이미지`}
                    className="community-list__profile-image"
                  />
                </Link>

                <Link href={`/profile/${item.userId}`} className="community-list__nickname">
                  {item.useName}
                </Link>

                <span className="community-list__meta">조회수 {item.visited_count}</span>
                <span className="community-list__meta">추천 {item.recommend_count}</span>
                <span className="community-list__meta">댓글 {item.comments_count}</span>

                <span className="community-list__date">
                  {format(parseISO(item.createdAt), 'yyyy-MM-dd : HH:mm:ss')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="community-list__floating-buttons" ref={floatingRef}>
        <button className="community-list__button" onClick={() => refetch()}>
          🔄
        </button>
        <button className="community-list__button" onClick={handleScrollTop}>
          ⬆️
        </button>
      </div>
    </>
  );
};

export default CommunityList;
