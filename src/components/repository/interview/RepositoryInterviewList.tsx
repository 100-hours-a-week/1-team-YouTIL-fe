'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import CheckDeleteInterviewModal from '../checkDeleteModal/checkDeleteInterviewModal/CheckDeleteInterviewModal';
import { parseISO, format } from 'date-fns';
import { useRepositoryInterviewList } from '@/hooks/repository/interview/useRepositoryInterviewList';
import Markdown from 'react-markdown';
import './RepositoryInterviewList.scss';
import { repositoryKeys } from '@/querykey/repository.querykey';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';

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
    shakeDelete,
    deleteModal,
    mapLevelToLabel,
    handleDeleteClick,
    handleDeleteComplete,
    handleClickInterview,
    toggleInterviewSelection,
  } = useRepositoryInterviewList();

  const {
    data: interviewPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: repositoryKeys.repositoryInterview(interviewDate).queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const targetDate = interviewDate || format(new Date(), 'yyyy-MM-dd');
      const response = await callApi<InterviewResponse>({
        method: 'GET',
        endpoint: `/interviews?page=${pageParam}&size=10&date=${targetDate}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.interviews.length < 10;
      return isLast ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const loadMoreRef = useInfinityScrollObserver({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const { data: interviewDetailData } = useQuery<InterviewDetail | null>({
    queryKey: repositoryKeys.repositoryInterviewDetail(expandedInterviewId ?? undefined).queryKey,
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

  const allInterviews = interviewPages?.pages.flatMap((page) => page.data.interviews) ?? [];

  return (
    <div className="repository-interview-list">
      <div className="repository-interview-list__header">
        <h2 className="repository-interview-list__title">면접 질문 목록</h2>
        {!!allInterviews.length && (
          <button
            className={`repository-interview-list__button${shakeDelete ? ' error shake' : ''}`}
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        )}
      </div>
      <ul className="repository-interview-list__items">
        {allInterviews.map((interview, index) => {
          const formattedDate = format(parseISO(interview.createdAt), 'yyyy-MM-dd : HH:mm:ss');
          const isExpanded = expandedInterviewId === interview.id;
          const isSelected = selectedInterviewIds.includes(interview.id);
          const isLastItem = index === allInterviews.length - 1;

          return (
            <div
              key={interview.id}
              className={`repository-interview-list__item ${isSelected ? 'selected' : ''}`}
              ref={isLastItem ? loadMoreRef : null}
            >
              <div className="repository-interview-list__item-header-wrapper">
                <div
                  className="repository-interview-list__item-header"
                  onClick={() => handleClickInterview(interview.id)}
                >
                  <div className="repository-interview-list__item-header-top">
                    <h3
                      className={`repository-interview-list__item-title${
                        isExpanded ? ' repository-interview-list__item-title--expanded' : ''
                      }`}
                    >
                      [{mapLevelToLabel(interview.level)}] {interview.title}
                    </h3>
                  </div>
                  <p className="repository-interview-list__item-date">{formattedDate}</p>
                </div>

                {!isExpanded && (
                  <input
                    type="checkbox"
                    className="repository-interview-list__item-checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterviewSelection(interview.id)}
                  />
                )}
              </div>

              {isExpanded && interviewDetailData && (
                <div className="repository-interview-list__item-detail">
                  {interviewDetailData.questions.map((q) => (
                    <div
                      key={q.questionId}
                      className="repository-interview-list__item-question-block"
                      onCopy={(e) => {
                        if (visibleAnswerMap[q.questionId]) {
                          e.preventDefault();
                          navigator.clipboard.writeText(q.answer);
                        }
                      }}
                    >
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
                        <Markdown>{q.answer}</Markdown>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </ul>

      {deleteModal.isOpen && (
        <CheckDeleteInterviewModal
          interviewIds={selectedInterviewIds}
          onClose={deleteModal.close}
          onDeleteComplete={handleDeleteComplete}
        />
      )}
    </div>
  );
};

export default RepositoryInterviewList;
