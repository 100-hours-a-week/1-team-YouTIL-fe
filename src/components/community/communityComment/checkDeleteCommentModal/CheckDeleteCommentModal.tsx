'use client';

import './CheckDeleteCommentModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { communityKeys } from '@/querykey/community.querykey';

interface Props {
  commentId: number;
  tilId: number;
  onClose: () => void;
  onDeleteComplete: () => void;
}

const CheckDeleteCommentModal = ({ commentId, onClose, onDeleteComplete, tilId }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();
  
  const { mutate } = useMutation({
    mutationFn: async () => {
      await callApi({
        method: 'DELETE',
        endpoint: `/community/${tilId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.comment(tilId).queryKey,
        exact: false,
      });
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <div className="comment-delete-modal">
      <div className="comment-delete-modal__overlay" onClick={onClose} />
      <div className="comment-delete-modal__content">
        <p className="comment-delete-modal__text">선택한 댓글을 삭제하시겠습니까?</p>
        <p className="comment-delete-modal__subtext">한 번 삭제한 댓글은 복구가 불가능합니다!</p>
        <div className="comment-delete-modal__buttons">
          <button
            className="comment-delete-modal__button comment-delete-modal__button--cancel"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="comment-delete-modal__button comment-delete-modal__button--confirm"
            onClick={() => mutate()}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckDeleteCommentModal;
