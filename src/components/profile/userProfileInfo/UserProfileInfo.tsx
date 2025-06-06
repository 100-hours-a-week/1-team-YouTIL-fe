'use client';

import './UserProfileInfo.scss';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';

const UserProfileInfo = () => {
  const { profileUrl, description } = useOtherUserInfoStore(
    (state) => state.otherUserInfo
  );

  return (
    <div className="user-profile">
      {profileUrl && (
        <img
          src={profileUrl}
          alt="유저 프로필 이미지"
          className="user-profile__image"
        />
      )}
      <div className="user-profile__introduction">
        {description ?? '유저 소개 없음'}
      </div>
    </div>
  );
};

export default UserProfileInfo;
