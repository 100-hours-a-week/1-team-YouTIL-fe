'use client';

import './CheckDeleteInterviewModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { repositoryKeys } from '@/querykey/repository.querykey';

interface Props {
  interviewIds: number[];
  onClose: () => void;
  onDeleteComplete: () => void;
}

const CheckDeleteInterviewModal = ({ interviewIds, onClose, onDeleteComplete }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await callApi({
        method: 'DELETE',
        endpoint: `/interviews`,
        body: {
          interviewIds,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : repositoryKeys.interviewCalendar._def, exact: false})
      queryClient.invalidateQueries({ queryKey: repositoryKeys.interviewList._def, exact: false})
      queryClient.invalidateQueries({queryKey: repositoryKeys.interviewDetail._def, exact: false})
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <section className="interview-delete-modal">
      <div className="interview-delete-modal__overlay" onClick={onClose} />
      <article className="interview-delete-modal__content" role="dialog" aria-modal="true">
        <header>
        <p className="interview-delete-modal__text">선택한 면접 질문을 삭제하시겠습니까?</p>
        <p className="interview-delete-modal__subtext">한 번 삭제한 댓글은 복구가 불가능합니다!</p>
        </header>
        <footer  className="interview-delete-modal__buttons">
          <button className="interview-delete-modal__button interview-delete-modal__button--cancel" onClick={onClose}>
            취소
          </button>
          <button className="interview-delete-modal__button interview-delete-modal__button--confirm" onClick={() => mutate()}>
            삭제
          </button>
        </footer >
      </article>
    </section>
  );
};

export default CheckDeleteInterviewModal;
