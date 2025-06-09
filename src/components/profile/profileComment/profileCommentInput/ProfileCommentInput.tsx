'use client';

import { useState } from 'react';
import './ProfileCommentInput.scss';

const ProfileCommentInput = () => {
  const [comment, setComment] = useState('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setComment(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      console.log('댓글 등록:', comment);
      setComment('');
    }
  };

  return (
    <div className="comment-input">
      <input
        className="comment-input__field"
        type="text"
        placeholder={'방명록을 남겨보세요 (최대 50자)'}
        value={comment}
        onChange={handleChange}

      />
      <button className="comment-input__button" onClick={handleSubmit}>
        등록
      </button>
    </div>
  );
};

export default ProfileCommentInput;
