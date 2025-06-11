'use client';

import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import CheckDeleteInterviewModal from '../checkDeleteModal/checkDeleteInterviewModal/CheckDeleteInterviewModal';
import { parseISO, format } from 'date-fns';
import { useState } from 'react';
import './RepositoryInterviewList.scss';

interface InterviewResponse {
  data: { interviews: InterviewItem[] };
}
interface InterviewItem {
  id: number;
  title: string;
  level: 'EASY' | 'NORMAL' | 'HARD';
  createdAt: string;
}

interface InterviewDetailResponse {
  data: InterviewDetail;
}

interface InterviewDetail {
  id: number;
  title: string;
  level: string;
  createdAt: string;
  questions: InterviewQuestion[];
}

interface InterviewQuestion {
  questionId: number;
  question: string;
  answer: string;
}

const RepositoryInterviewList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const { interviewDate } = useRepositoryDateStore();
  const [expandedInterviewId, setExpandedInterviewId] = useState<number | null>(null);
  const [visibleAnswerMap, setVisibleAnswerMap] = useState<Record<number, boolean>>({});
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<number[]>([]);
  const [shakeDelete, setShakeDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


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
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data.interviews;
    },
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const { data: interviewDetailData } = useQuery<InterviewDetail | null>({
    queryKey: ['interviewDetail', expandedInterviewId],
    queryFn: async () => {
      if (expandedInterviewId === null) return null;
      const response = await callApi<InterviewDetailResponse>({
        method: 'GET',
        endpoint: `/interviews/${expandedInterviewId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data;
    },
    enabled: expandedInterviewId !== null && existAccess,
    staleTime: Infinity,
    gcTime: 3600000,
  });

  const mapLevelToLabel = (level: 'EASY' | 'NORMAL' | 'HARD'): string => {
    switch (level) {
      case 'EASY': return '쉬움';
      case 'NORMAL': return '보통';
      case 'HARD': return '어려움';
      default: return '-';
    }
  };

  const handleClickInterview = (interviewId: number) => {
    if (selectedInterviewIds.includes(interviewId)) return;
    setExpandedInterviewId(prev => (prev === interviewId ? null : interviewId));
  };

  const toggleInterviewSelection = (interviewId: number) => {
    setSelectedInterviewIds(prev =>
      prev.includes(interviewId)
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
    if (expandedInterviewId === interviewId) {
      setExpandedInterviewId(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedInterviewIds.length === 0) {
      setShakeDelete(true);
      setTimeout(() => setShakeDelete(false), 500);
    } else {
      setShowDeleteModal(true);
    }
  };
  return (
    <div className="repository-interview-list">
      <div className="repository-interview-list__header">
        <h2 className="repository-interview-list__title">면접 질문 목록</h2>
        {interviewData && interviewData.length > 0 && (
          <button
            className={`repository-interview-list__button${shakeDelete ? ' error shake' : ''}`}
            onClick={handleDeleteClick}
            style={{ visibility: interviewData && interviewData.length > 0 ? 'visible' : 'hidden' }}
          >
            삭제
          </button>
        )}
      </div>
      <ul className="repository-interview-list__items">

        {interviewData?.map((interview) => {
          const formattedDate = format(parseISO(interview.createdAt), 'yyyy-MM-dd : HH:mm:ss');
          const isExpanded = expandedInterviewId === interview.id;
          const isSelected = selectedInterviewIds.includes(interview.id);

          return (
            <li
              key={interview.id}
              className={`repository-interview-list__item ${isSelected ? 'selected' : ''}`}
            >
              <div className="repository-interview-list__item-header-wrapper">
                <div
                  className="repository-interview-list__item-header"
                  onClick={() => handleClickInterview(interview.id)}
                >
                  <div className="repository-interview-list__item-header-top">
                  <h3 className={`repository-interview-list__item-title${ isExpanded ? ' repository-interview-list__item-title--expanded' : ''}`}>
                    [{mapLevelToLabel(interview.level)}] {interview.title}
                  </h3>
                  </div>
                  <p className="repository-interview-list__item-date">{formattedDate}</p>
                </div>

                <input
                  type="checkbox"
                  className="repository-interview-list__item-checkbox"
                  checked={isSelected}
                  onChange={() => toggleInterviewSelection(interview.id)}
                />
              </div>

              {isExpanded && interviewDetailData && (
                <div className="repository-interview-list__item-detail">
                  {interviewDetailData.questions.map((q) => (
                    <div key={q.questionId} className="repository-interview-list__item-question-block">
                      <p className="repository-interview-list__item-question">{q.question}</p>
                      <button
                        onClick={() =>
                          setVisibleAnswerMap(prev => ({
                            ...prev,
                            [q.questionId]: !prev[q.questionId],
                          }))
                        }
                        className="repository-interview-list__item-toggle"
                      >
                        정답 보기
                      </button>
                      {visibleAnswerMap[q.questionId] && (
                        <p className="repository-interview-list__item-answer">{q.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {showDeleteModal && (
        <CheckDeleteInterviewModal
          interviewIds={selectedInterviewIds}
          onClose={() => setShowDeleteModal(false)}
          onDeleteComplete={() => setSelectedInterviewIds([])}
        />
      )}
    </div>
  );
};

export default RepositoryInterviewList;
