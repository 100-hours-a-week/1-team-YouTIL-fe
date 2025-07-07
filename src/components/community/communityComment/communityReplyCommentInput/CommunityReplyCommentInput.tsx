'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './CommunityReplyCommentInput.scss';
import { communityKeys } from '@/querykey/community.querykey';

interface Props {
  topCommentId: number;
  tilId : number;
  onComplete: () => void;
}

const CommunityReplyCommentInput = ({ topCommentId, onComplete,tilId  }: Props) => {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      setIsSubmitting(true);
      return await callApi({
        method: 'POST',
        endpoint: `/community/${tilId}/comments`,
        body: {
          topCommentId,
          content,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      setReplyContent('');
      queryClient.invalidateQueries({queryKey: communityKeys.comment(tilId).queryKey, exact: false})
      onComplete();
    },
    onError: (error: unknown) => {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 404
      ) {
        alert('해당 댓글이 존재하지 않거나 삭제되었습니다.');
        location.reload();
      } else {
        console.error('대댓글 등록 실패:', error);
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setReplyContent(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (!replyContent.trim() || isSubmitting) return;
    mutation.mutate(replyContent.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isSubmitting) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="reply-comment-input">
      <input
        className="reply-comment-input__field"
        type="text"
        placeholder="대댓글을 입력하세요 (최대 50자)"
        value={replyContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      <button
        className="reply-comment-input__button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        등록
      </button>
    </div>
  );
};

export default CommunityReplyCommentInput;
