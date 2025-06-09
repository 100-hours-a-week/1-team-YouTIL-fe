'use client';

import './CheckDeleteCommentModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface Props {
  guestbookId: number;
  onClose: () => void;
  onDeleteComplete: () => void;
}

const CheckDeleteCommentModal = ({ guestbookId, onClose, onDeleteComplete }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();
  const userId = useOtherUserInfoStore((state) => state.otherUserInfo.userId)
  const { mutate } = useMutation({
    mutationFn: async () => {
      await callApi({
        method: 'DELETE',
        endpoint: `/users/${userId}/guestbooks/${guestbookId}`,
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestbooks-list'] });
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <div className="comment-delete-modal">
      <div className="comment-delete-modal__overlay" onClick={onClose} />
      <div className="comment-delete-modal__content">
        <p className="comment-delete-modal__text">선택한 댓글을 삭제하시겠습니까?</p>
        <div className="comment-delete-modal__buttons">
          <button className="comment-delete-modal__button comment-delete-modal__button--cancel" onClick={onClose}>
            취소
          </button>
          <button className="comment-delete-modal__button comment-delete-modal__button--confirm" onClick={() => mutate()}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckDeleteCommentModal;
