'use client';

import './CheckDeleteInterviewModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';

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
      queryClient.invalidateQueries({ queryKey: ['interviewList'] });
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <div className="delete-modal">
      <div className="delete-modal__overlay" onClick={onClose} />
      <div className="delete-modal__content">
        <p className="delete-modal__text">선택한 면접 질문을 삭제하시겠습니까?</p>
        <div className="delete-modal__buttons">
          <button className="delete-modal__button delete-modal__button--cancel" onClick={onClose}>
            취소
          </button>
          <button className="delete-modal__button delete-modal__button--confirm" onClick={() => mutate()}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckDeleteInterviewModal;
