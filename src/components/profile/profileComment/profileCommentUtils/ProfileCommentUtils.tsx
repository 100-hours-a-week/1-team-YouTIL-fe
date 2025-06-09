'use client';

import { useState } from 'react';
import CheckDeleteCommentModal from '../checkDeleteCommentModal/CheckDeleteCommentModal';
import './ProfileCommentUtils.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

interface Props {
  guestId: number;
  guestbookId: number;
}

const ProfileCommentUtils = ({ guestId, guestbookId }: Props) => {
  const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  const isOwner = myUserId === guestId;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="comment-utils-dropdown">
        {isOwner && (
          <>
            <button className="comment-utils-dropdown__item">수정</button>
            <button
              className="comment-utils-dropdown__item"
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </button>
          </>
        )}
        <button className="comment-utils-dropdown__item">대댓글</button>
      </div>

      {showDeleteModal && (
        <CheckDeleteCommentModal
          guestbookId = {guestbookId}
          onClose={() => setShowDeleteModal(false)}
          onDeleteComplete={() => {
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default ProfileCommentUtils;
