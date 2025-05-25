'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import { parseISO, format } from 'date-fns';
import './RepositoryTILList.scss';

interface TILItem {
  tilId: number;
  title: string;
  createdAt: string;
}

interface TILResponse {
  data: {
    tils: TILItem[];
  };
}

interface TILDetailItem {
  title: string;
  content: string;
  tag: string[];
  category: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  visitedCount: number;
  recommendCount: number;
  commentsCount: number;
}

const RepositoryTILList = () => {
  const { callApi } = useFetch();
  const { tilDate } = useRepositoryDateStore();
  const [expandedTilId, setExpandedTilId] = useState<number | null>(null);
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const { data: tilData } = useQuery<TILItem[]>({
    queryKey: ['tilList', tilDate],
    queryFn: async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const formattedToday = `${yyyy}-${mm}-${dd}`;

      const targetDate = tilDate || formattedToday;

      const response = await callApi<TILResponse>({
        method: 'GET',
        endpoint: `/tils?page=0&size=10&date=${targetDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      return response.data.tils;
    },
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
    //til 생성 후 바로 수동 갱신
  });

  const handleClickTIL = (tilId: number) => {
    if (expandedTilId === tilId) {
      setExpandedTilId(null);
    } else {
      setExpandedTilId(tilId);
    }
  };

  const { data: tilDetailData, isLoading: isDetailLoading } = useQuery<TILDetailItem | null>({
    queryKey: ['tilDetail', expandedTilId],
    queryFn: async () => {
      if (expandedTilId === null) return null;

      const response = await callApi<{ data: TILDetailItem }>({
        method: 'GET',
        endpoint: `/tils/${expandedTilId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      return response.data;
    },
    enabled: expandedTilId !== null && existAccess,
    staleTime: Infinity,
    gcTime: 3600000,
    //한 번 생성된 til 상세는 변하지 않으므로 refetch 및 수동갱신 x
  });

  return (
    <div className="repository-til-list">
      <h2 className="repository-til-list__title">TIL 목록</h2>
      <ul className="repository-til-list__items">
        {tilData?.map((til) => {
          const parsedDate = parseISO(til.createdAt);
          const formattedDate = format(parsedDate, 'yyyy-MM-dd : HH:mm:ss');

          return (
            <li key={til.tilId} className="repository-til-list__item">
              <div
                className="repository-til-list__item-header"
                onClick={() => handleClickTIL(til.tilId)}
              >
                <h3 className="repository-til-list__item-title">{til.title}</h3>
                <p className="repository-til-list__item-date">{formattedDate}</p>
              </div>

              {expandedTilId === til.tilId && tilDetailData && (
                <div className="repository-til-list__item-detail">
                  {isDetailLoading ? (
                    <p className="repository-til-list__item-loading">로딩 중...</p>
                  ) : (
                    <>
                      <p className="repository-til-list__item-content">{tilDetailData.content}</p>
                      <p className="repository-til-list__item-tags">
                        {tilDetailData.tag.map((tag, i) => (
                          <span key={i} className="repository-til-list__item-tag">
                            #{tag}
                          </span>
                        ))}
                      </p>
                      <p className="repository-til-list__item-meta">
                        조회수 {tilDetailData.visitedCount} · 추천 {tilDetailData.recommendCount} · 댓글 {tilDetailData.commentsCount}
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RepositoryTILList;
