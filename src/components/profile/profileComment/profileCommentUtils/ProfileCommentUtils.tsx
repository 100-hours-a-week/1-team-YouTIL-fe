'use client';

import './ProfileCommentUtils.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

interface Props {
  guestId: number;
  guestbookId: number;
  originalContent: string;
  onCloseDropdown: () => void;
  onRequestDelete: (guestbookId: number) => void;
  onRequestEditToggle: (guestbookId: number, originalContent: string) => void;
}

const ProfileCommentUtils = ({
  guestId,
  guestbookId,
  originalContent,
  onCloseDropdown,
  onRequestDelete,
  onRequestEditToggle,
}: Props) => {
  const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  const isOwner = myUserId === guestId;

  const handleEditClick = () => {
    onRequestEditToggle(guestbookId, originalContent);
    onCloseDropdown();
  };

  const handleDeleteClick = () => {
    onCloseDropdown();
    onRequestDelete(guestbookId);
  };

  return (
    <div className="comment-utils-dropdown">
      {isOwner && (
        <>
          <button className="comment-utils-dropdown__item" onClick={handleEditClick}>
            수정
          </button>
          <button className="comment-utils-dropdown__item" onClick={handleDeleteClick}>
            삭제
          </button>
        </>
      )}
      <button className="comment-utils-dropdown__item" onClick={onCloseDropdown}>
        대댓글
      </button>
    </div>
  );
};

export default ProfileCommentUtils;
