'use client';

import './CommunityCommentUtils.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

interface Props {
  commentOwnerId: number;
  commentId: number;
  topCommentId: number | null;
  originalContent: string;
  profileOwnerId: number | null;
  onCloseDropdown: () => void;
  onRequestDelete: (commentId: number) => void;
  onRequestEditToggle: (commentId: number, originalContent: string) => void;
  onRequestReply: (resolvedTopCommentId: number) => void;
}

const CommunityCommentUtils = ({
  commentOwnerId,
  commentId,
  topCommentId,
  originalContent,
  profileOwnerId,
  onCloseDropdown,
  onRequestDelete,
  onRequestEditToggle,
  onRequestReply,
}: Props) => {
  const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  const isMyComment = myUserId === commentOwnerId;
  const isMyProfile = myUserId === profileOwnerId;
  const handleEditClick = () => {
    onRequestEditToggle(commentId, originalContent);
    onCloseDropdown();
  };

  const handleDeleteClick = () => {
    onCloseDropdown();
    onRequestDelete(commentId);
  };

  const handleReplyClick = () => {
    const resolvedId = topCommentId ?? commentId;
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

export default CommunityCommentUtils;
