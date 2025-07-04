'use client';

import { useState, useEffect } from 'react';
import './ProfileEditCommentInput.scss';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '@/querykey/profile.querykey';

interface Props {
  originalContent: string;
  profileUserId: number | null;
  guestbookId: number;
  onComplete: () => void;
}

const ProfileEditCommentInput = ({ originalContent, profileUserId, guestbookId, onComplete }: Props) => {
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  useEffect(() => {
    setEditContent(originalContent);
  }, [originalContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setEditContent(e.target.value);
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

  const handleSubmit = async () => {
    if (!editContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await callApi({
        method: 'PUT',
        endpoint: `/users/${profileUserId}/guestbooks/${guestbookId}`,
        body: { content: editContent.trim() },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      await queryClient.invalidateQueries({queryKey: profileKeys.profileCommentList._def, exact: false});
      onComplete();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-comment-input">
      <input
        className="edit-comment-input__field"
        type="text"
        value={editContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      <button
        className="edit-comment-input__button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        등록
      </button>
    </div>
  );
};

export default ProfileEditCommentInput;
