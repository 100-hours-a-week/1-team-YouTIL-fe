'use client';

import './ProfileCommentUtils.scss';

const ProfileCommentUtils = () => {
  return (
    <div className="comment-utils-dropdown">
      <button className="comment-utils-dropdown__item">수정</button>
      <button className="comment-utils-dropdown__item">삭제</button>
      <button className="comment-utils-dropdown__item">대댓글</button>
    </div>
  );
};

export default ProfileCommentUtils;
