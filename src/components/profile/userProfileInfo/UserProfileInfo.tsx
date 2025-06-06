'use client';

import './UserProfileInfo.scss';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useUserInfoStore from '@/store/useUserInfoStore';

const UserProfileInfo = () => {
    const { profileUrl, description, userId: otherUserId } = useOtherUserInfoStore(
      (state) => state.otherUserInfo
    );
    const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  
    if (otherUserId === null || myUserId === null) return null;
  
    const isOwner = myUserId === otherUserId;
  
    return (
      <div className="user-profile">
        {isOwner && <button className="user-profile__edit-button">수정</button>}
        <div className="user-profile__content">
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
      </div>
    );
  };
  

export default UserProfileInfo;
