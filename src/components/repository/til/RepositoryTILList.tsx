'use client';

import './RepositoryTILList.scss';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import { parseISO, format } from 'date-fns';

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
  const accessToken = useGetAccessToken();
  const { tilDate } = useRepositoryDateStore();

  const [tilData, setTilData] = useState<TILItem[]>([]);
  const [expandedTilId, setExpandedTilId] = useState<number | null>(null);
  const [tilDetailData, setTilDetailData] = useState<TILDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTILs = async () => {
      setIsLoading(true);
      setIsError(false);

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const formattedToday = `${yyyy}-${mm}-${dd}`;

      const targetDate = tilDate || formattedToday;

      try {
        const response = await callApi<TILResponse>({
          method: 'GET',
          endpoint: `/tils?page=0&size=10&date=${targetDate}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTilData(response.data.tils);
      } catch (error) {
        console.error('TIL 목록 요청 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTILs();
  }, [tilDate, callApi, accessToken]);

  const handleClickTIL = async (tilId: number) => {
    if (expandedTilId === tilId) {
      setExpandedTilId(null);
      setTilDetailData(null);
      return;
    }

    try {
      const response = await callApi<{ data: TILDetailItem }>({
        method: 'GET',
        endpoint: `/tils/${tilId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setExpandedTilId(tilId);
      setTilDetailData(response.data);
    } catch (error) {
      console.error('TIL 상세 요청 실패:', error);
    }
  };

  return (
    <div className="repository-til-list">
      <h2 className="repository-til-list__title">TIL 목록</h2>
      <ul className="repository-til-list__items">
        {tilData.map((til) => {
          const parsedDate = parseISO(til.createdAt);
          const formattedDate = format(parsedDate, 'yyyy-MM-dd : HH:mm:ss');

          return (
            <li
              key={til.tilId}
              className="repository-til-list__item"
              onClick={() => handleClickTIL(til.tilId)}
            >
              <div className="repository-til-list__item-header">
                <h3 className="repository-til-list__item-title">{til.title}</h3>
                <p className="repository-til-list__item-date">{formattedDate}</p>
              </div>

              {expandedTilId === til.tilId && tilDetailData && (
                <div className="repository-til-list__item-detail">
                  <p className="repository-til-list__item-content">{tilDetailData.content}</p>
                  <p className="repository-til-list__item-tags">
                    {tilDetailData.tag.map((tag, i) => (
                      <span key={i} className="repository-til-list__item-tag">#{tag}</span>
                    ))}
                  </p>
                  <p className="repository-til-list__item-meta">
                    조회수 {tilDetailData.visitedCount} · 추천 {tilDetailData.recommendCount} · 댓글 {tilDetailData.commentsCount}
                  </p>
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
