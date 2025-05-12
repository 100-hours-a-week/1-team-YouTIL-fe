'use client';

import './NewTILList.scss';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { parseISO, format } from 'date-fns';

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

interface TILResponse {
  data: {
    tils: TILItem[];
  };
}

const NewTILList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const [tils, setTils] = useState<TILItem[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRecentTILs = async () => {
      try {
        const response = await callApi<TILResponse>({
          method: 'GET',
          endpoint: '/community/recent-tils',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTils(response.data.tils);
      } catch (error) {
        console.error('최근 TIL 데이터를 불러오는 중 오류 발생:', error);
        setIsError(true);
      }
    };

    fetchRecentTILs();
  }, [callApi, accessToken]);

  if (isError) {
    return <p className="til-list__error">TIL 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="til-list">
      {tils.map((til) => (
        <div key={til.id} className="til-list__card">
          <div className="til-list__header">
            {/* <p className="til-list__image">{til.profileImageUrl}</p> */}
            <p className="til-list__title">{til.title}</p>
          </div>
          <div className="til-list__tags">
            {til.tags.map((tag, i) => (
              <span key={i} className="til-list__tag">#{tag}</span>
            ))}
          </div>
          <div className="til-list__footer">
            <span className="til-list__nickname">{til.nickname}</span>
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
