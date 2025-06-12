'use client';

import './ProfileCommentUtils.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

interface Props {
  guestId: number;
  guestbookId: number;
  topGuestbookId: number | null;
  originalContent: string;
  profileOwnerId: number | null;
  onCloseDropdown: () => void;
  onRequestDelete: (guestbookId: number) => void;
  onRequestEditToggle: (guestbookId: number, originalContent: string) => void;
  onRequestReply: (resolvedTopGuestbookId: number) => void;
}

const ProfileCommentUtils = ({
  guestId,
  guestbookId,
  topGuestbookId,
  originalContent,
  profileOwnerId,
  onCloseDropdown,
  onRequestDelete,
  onRequestEditToggle,
  onRequestReply,
}: Props) => {
  const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  const isMyComment = myUserId === guestId;
  const isMyProfile = myUserId === profileOwnerId;

  const handleEditClick = () => {
    onRequestEditToggle(guestbookId, originalContent);
    onCloseDropdown();
  };

  const handleDeleteClick = () => {
    onCloseDropdown();
    onRequestDelete(guestbookId);
  };

  const handleReplyClick = () => {
    const resolvedId = topGuestbookId ?? guestbookId;
    onRequestReply(resolvedId);
    onCloseDropdown();
  };

  return (
    <div className="comment-utils-dropdown">
      {(isMyProfile || isMyComment) && (
        <button className="comment-utils-dropdown__item" onClick={handleDeleteClick}>
          삭제
        </button>
      )}

      {isMyComment && (
        <button className="comment-utils-dropdown__item" onClick={handleEditClick}>
          수정
        </button>
      )}

      <button className="comment-utils-dropdown__item" onClick={handleReplyClick}>
        대댓글
      </button>
    </div>
  );
};

export default ProfileCommentUtils;
