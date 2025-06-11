'use client';

import './CheckDeleteTILModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface Props {
  tilIds: number[];
  onClose: () => void;
  onDeleteComplete: () => void;
}

const CheckDeleteTILModal = ({ tilIds, onClose, onDeleteComplete }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await callApi({
        method: 'DELETE',
        endpoint: `/tils`,
        body: {
          tilIds,
        },
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tilList'] });
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <div className="til-delete-modal">
      <div className="til-delete-modal__overlay" onClick={onClose} />
      <div className="til-delete-modal__content">
        <p className="til-delete-modal__text">선택한 TIL을 삭제하시겠습니까?</p>
        <p className="til-delete-modal__subtext">한 번 삭제한 댓글은 복구가 불가능합니다!</p>
        <div className="til-delete-modal__buttons">
          <button className="til-delete-modal__button til-delete-modal__button--cancel" onClick={onClose}>
            취소
          </button>
          <button className="til-delete-modal__button til-delete-modal__button--confirm" onClick={() => mutate()}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckDeleteTILModal;
