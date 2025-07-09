'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import './CommunityCommentInput.scss';

import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { communityKeys } from '@/querykey/community.querykey';

const CommunityCommentInput = () => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const accessToken = useGetAccessToken();
  const { callApi } = useFetch();
  const params = useParams();
  const tilId = params.tilId; 
  const tilIdNumber = Number(tilId);
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      setIsSubmitting(true);
      return await callApi({
        method: 'POST',
        endpoint: `/community/${tilId}/comments`,
        body: {
          content,
          topCommentId: null,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({queryKey: communityKeys.comment(tilIdNumber).queryKey})
    },
    onError: (error) => {
      console.error('댓글 등록 실패:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setComment(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isSubmitting) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (!comment.trim() || isSubmitting) return;
    mutation.mutate(comment.trim());
  };

  return (
    <div className="comment-input">
      <input
        className="comment-input__field"
        type="text"
        placeholder="댓글을 남겨주세요 (최대 50자)"
        value={comment}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      <button
        className="comment-input__button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        등록
      </button>
    </div>
  );
};

export default CommunityCommentInput;
