'use client';

import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useTechNewsSlider } from '@/hooks/main/techNews/useTechNewsSlider';
import Image from 'next/image';
import './TechNews.scss';
import { mainKeys } from '@/querykey/main.querykey';

interface NewsItem {
  title: string;
  link: string;
  thumbnail: string;
  createdAt: string;
  summary: string;
}

interface NewsApiResponse {
  data: {
    news: NewsItem[];
  };
}

const TechNews = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const { data } = useQuery({
    queryKey: mainKeys.techNews().queryKey,
    queryFn: async () => {
      const response = await callApi<NewsApiResponse>({
        method: 'GET',
        endpoint: '/news',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data?.news ?? [];
    },
    enabled: existAccess,
    staleTime: Infinity,
    gcTime: 3600000,
  });

  const { scrollRef, scrollByItem, isSliding } = useTechNewsSlider(data);

  return (
    <div className="technews">
      <div className="technews__controls">
        <button onClick={() => scrollByItem('left', true)}>&lt;</button>
        <button onClick={() => scrollByItem('right', true)}>&gt;</button>
      </div>

      <div className="technews__wrapper" ref={scrollRef}>
        {data?.map((news, index) => (
          <a
            key={index}
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`technews__item ${isSliding ? 'no-hover' : ''}`}
          >
            <Image
              src={news.thumbnail}
              alt={news.title}
              width={300}
              height={180}
              className="technews__thumbnail"
              unoptimized
            />
            <div className="technews__gradient" />
            <div className="technews__headline">{news.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechNews;
