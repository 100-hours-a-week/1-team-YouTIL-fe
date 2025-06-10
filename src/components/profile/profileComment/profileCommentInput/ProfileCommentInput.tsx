'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './ProfileCommentInput.scss';

import { useFetch } from '@/hooks/useFetch';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';

const ProfileCommentInput = () => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const accessToken = useGetAccessToken();
  const { callApi } = useFetch();
  const otherUserId = useOtherUserInfoStore((state) => state.otherUserInfo.userId);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return await callApi({
        method: 'POST',
        endpoint: `/users/${otherUserId}/guestbooks`,
        body: {
          topGuestbookId: null,
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
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['guestbooks-list', otherUserId] });
    },
    onError: (error) => {
      console.error('댓글 등록 실패:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setComment(e.target.value);
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      mutation.mutate(comment.trim());
    }
  };

  return (
    <div className="comment-input">
      <input
        className="comment-input__field"
        type="text"
        placeholder="방명록을 남겨보세요 (최대 50자)"
        value={comment}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className="comment-input__button" onClick={handleSubmit}>
        등록
      </button>
    </div>
  );
};

export default ProfileCommentInput;
