'use client';

import { useState, useEffect } from 'react';
import './ProfileEditCommentInput.scss';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  originalContent: string;
  profileUserId: number | null;
  guestbookId: number;
  onComplete: () => void;
}

const ProfileEditCommentInput = ({ originalContent,profileUserId,guestbookId,onComplete }: Props) => {
  const [editContent, setEditContent] = useState('');
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

  const handleSubmit = async () => {
    if (!editContent.trim()) return;

    try {
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

      await queryClient.invalidateQueries({ queryKey: ['guestbooks-list'] });
      onComplete();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  return (
    <div className="edit-comment-input">
      <input
        className="edit-comment-input__field"
        type="text"
        placeholder="댓글을 수정하세요 (최대 50자)"
        value={editContent}
        onChange={handleChange}
      />
      <button className="edit-comment-input__button" onClick={handleSubmit}>
        수정
      </button>
    </div>
  );
};

export default ProfileEditCommentInput;
