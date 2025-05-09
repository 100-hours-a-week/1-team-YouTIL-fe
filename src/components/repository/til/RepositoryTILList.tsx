'use client';

import './RepositoryTILList.scss';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';

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

const RepositoryTILList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const tilDate = useRepositoryDateStore((state) => state.tilDate);

  const [data, setData] = useState<TILItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchTILs = async () => {
      if (!tilDate) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await callApi<TILResponse>({
          method: 'GET',
          endpoint: `/tils?page=0&size=10`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setData(response.data.tils);
      } catch (error) {
        console.error('TIL 데이터를 가져오는 중 오류 발생:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTILs();
  }, [tilDate, callApi, accessToken]);

  if (isLoading) return <p className="repository-til-list__loading">로딩 중...</p>;
  if (isError) return <p className="repository-til-list__loading">TIL 데이터를 불러오지 못했습니다.</p>;

  return (
    <div className="repository-til-list">
      <h2 className="repository-til-list__title">TIL 목록</h2>
      <ul className="repository-til-list__items">
        {data.map((til) => (
          <li key={til.tilId} className="repository-til-list__item">
            <h3 className="repository-til-list__item-title">{til.title}</h3>
            <p className="repository-til-list__item-date">{til.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepositoryTILList;
