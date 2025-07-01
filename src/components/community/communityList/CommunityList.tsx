'use client';

import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCommunityNavigationStore } from '@/store/useCommunityNavigationStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import './CommunityList.scss';

interface CommunityItem {
  tilId: number;
  userId: number;
  useName: string;
  category: string;
  title: string;
  content?: string;
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

  const {
    data: communityPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
      console.log('[📦 fetched page]', pageParam, response.data.tils);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.tils.length < 10;
      return isLast ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: !!selectedCategory && existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const loadMoreRef = useInfinityScrollObserver<HTMLDivElement>({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const allCommunityTils = communityPages?.pages.flatMap((page) => page.data.tils) ?? [];

  return (
    <div className="community-list">
      {allCommunityTils.map((item, index) => {
        const isLastItem = index === allCommunityTils.length - 1;
        return (
          <div
            key={item.tilId}
            className="community-list__item"
            ref={isLastItem ? loadMoreRef : null}
          >
            <h3 className="community-list__title">{item.title}</h3>
            <p className="community-list__content">{item.content ?? '내용 없음'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CommunityList;
