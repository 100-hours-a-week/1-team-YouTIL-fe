'use client';

import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { parseISO, format } from 'date-fns';
import { useState } from 'react';
import './RepositoryInterviewList.scss';

interface InterviewItem {
  id: number;
  title: string;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
}

interface InterviewResponse {
  data: {
    interviews: InterviewItem[];
  };
}

const RepositoryInterviewList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const { interviewDate } = useRepositoryDateStore();
  const [expandedInterviewId, setExpandedInterviewId] = useState<number | null>(null);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  const { data: interviewData } = useQuery<InterviewItem[]>({
    queryKey: ['interviewList', interviewDate],
    queryFn: async () => {
      const targetDate = interviewDate || formattedToday;
      const response = await callApi<InterviewResponse>({
        method: 'GET',
        endpoint: `/interviews?page=0&size=10&date=${targetDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      return response.data.interviews;
    },
    enabled: existAccess,
    staleTime: Infinity,
    gcTime: 3600000,
  });

  const mapLevelToLabel = (level: 'EASY' | 'MEDIUM' | 'HARD'): string => {
    switch (level) {
      case 'EASY':
        return '쉬움';
      case 'MEDIUM':
        return '보통';
      case 'HARD':
        return '어려움';
      default:
        return '-';
    }
  };

  const handleClickInterview = (interviewId: number) => {
    if (expandedInterviewId === interviewId) {
      setExpandedInterviewId(null);
    } else {
      setExpandedInterviewId(interviewId);
    }
  };

  return (
    <div className="repository-interview-list">
      <h2 className="repository-interview-list__title">면접 질문 목록</h2>
      <ul className="repository-interview-list__items">
        {interviewData?.map((interview) => {
          const formattedDate = format(parseISO(interview.createdAt), 'yyyy-MM-dd : HH:mm:ss');
          const isExpanded = expandedInterviewId === interview.id;

          return (
            <li key={interview.id} className="repository-interview-list__item">
              <div
                className="repository-interview-list__item-header"
                onClick={() => handleClickInterview(interview.id)}
              >
                <div className="repository-interview-list__item-header-top">
                  <h3 className="repository-interview-list__item-title">
                    {interview.title} ({mapLevelToLabel(interview.level)})
                  </h3>
                </div>
                <p className="repository-interview-list__item-date">{formattedDate}</p>
              </div>
              {isExpanded && (
                <div className="repository-interview-list__item-detail">
                  <p className="repository-interview-list__item-content">
                    여기에 더미 내용이 들어갑니다. 이 면접 질문에 대한 예시 답변이나 참고 자료를 넣을 수 있습니다.
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

export default RepositoryInterviewList;
