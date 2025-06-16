'use client';

import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import CheckDeleteInterviewModal from '../checkDeleteModal/checkDeleteInterviewModal/CheckDeleteInterviewModal';
import { parseISO, format } from 'date-fns';
import { useRepositoryInterviewList } from '@/hooks/repository/interview/useRepositoryInterviewList';
import { useModal } from '@/hooks/useModal';
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

  const {
    expandedInterviewId,
    visibleAnswerMap,
    setVisibleAnswerMap,
    selectedInterviewIds,
    setSelectedInterviewIds,
    shakeDelete,
    mapLevelToLabel,
    handleClickInterview,
    toggleInterviewSelection,
  } = useRepositoryInterviewList();

  const deleteModal = useModal();

  const handleDeleteClick = () => {
    if (selectedInterviewIds.length === 0) {
      const event = new CustomEvent('shake-delete');
      window.dispatchEvent(event);
    } else {
      deleteModal.open();
    }
  };

  const { data: interviewData } = useQuery<InterviewItem[]>({
    queryKey: ['interview-list', interviewDate],
    queryFn: async () => {
      const targetDate = interviewDate || format(new Date(), 'yyyy-MM-dd');
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
    queryKey: ['interview-detail', expandedInterviewId],
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

  return (
    <div className="repository-interview-list">
      <div className="repository-interview-list__header">
        <h2 className="repository-interview-list__title">면접 질문 목록</h2>
        {!!interviewData?.length && (
          <button
            className={`repository-interview-list__button${shakeDelete ? ' error shake' : ''}`}
            onClick={handleDeleteClick}
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
                    <h3 className={`repository-interview-list__item-title${isExpanded ? ' repository-interview-list__item-title--expanded' : ''}`}>
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
                          setVisibleAnswerMap((prev) => ({
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

      {deleteModal.isOpen && (
        <CheckDeleteInterviewModal
          interviewIds={selectedInterviewIds}
          onClose={deleteModal.close}
          onDeleteComplete={() => {
            setSelectedInterviewIds([]);
            deleteModal.close();
          }}
        />
      )}
    </div>
  );
};

export default RepositoryInterviewList;
