'use client';

import { useState, useEffect } from 'react';
import './CommunityEditCommentInput.scss';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityKeys } from '@/querykey/community.querykey';

interface Props {
  originalContent: string;
  commentId: number;
  tilId: number;
  onComplete: () => void;
}

const CommunityEditCommentInput = ({
  originalContent,
  commentId,
  tilId,
  onComplete,
}: Props) => {
  const [editContent, setEditContent] = useState('');
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  useEffect(() => {
    setEditContent(originalContent);
  }, [originalContent]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await callApi({
        method: 'PUT',
        endpoint: `/community/${tilId}/comments/${commentId}`,
        body: { content: editContent.trim() },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.comment(tilId).queryKey,
        exact: false,
      });
      onComplete();
    },
    onError: (err) => {
      console.error('댓글 수정 실패:', err);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setEditContent(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isPending) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!editContent.trim() || isPending) return;
    mutate();
  };

  return (
    <div className="edit-comment-input">
      <input
        className="edit-comment-input__field"
        type="text"
        value={editContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isPending}
      />
      <button
        className="edit-comment-input__button"
        onClick={handleSubmit}
        disabled={isPending}
      >
        등록
      </button>
    </div>
  );
};

export default CommunityEditCommentInput;
