'use client';

import './UserNickNameDescription.scss';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';

const UserNickNameDescription = () => {
  const name = useOtherUserInfoStore((state) => state.otherUserInfo.name);

  if (name === null || name === undefined) return null;

  return (
    <div className="user-nickname">
      <div className="user-nickname__box">
        {`${name} 님의 마이페이지`}
      </div>
    </div>
  );
};

export default UserNickNameDescription;
