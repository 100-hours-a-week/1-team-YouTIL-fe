'use client';

import { useProfileNavStore } from '@/store/useProfileNavStore';
import UserTILList from '../userTILList/UserTILList';
import ProfileComment from '../profileComment/ProfileComment';
import './UserProfileNavigator.scss';

const UserProfileNavigator = () => {
  const { activeTab, setActiveTab } = useProfileNavStore();

  return (
    <div className={`userprofile-navigator ${activeTab}-active`}>
      <div className="userprofile-navigator__tabs">
        <button
          className={`userprofile-navigator__tab ${activeTab === 'guestbook' ? 'active' : ''}`}
          onClick={() => setActiveTab('guestbook')}
        >
          방명록
        </button>
        <div className="userprofile-navigator__underline" />
        <button
          className={`userprofile-navigator__tab ${activeTab === 'til' ? 'active' : ''}`}
          onClick={() => setActiveTab('til')}
        >
          TIL
        </button>
      </div>

      <div className="userprofile-navigator__content">
        {activeTab === 'til' && <UserTILList />}
        {activeTab === 'guestbook' && <ProfileComment />}
      </div>
    </div>
  );
};

export default UserProfileNavigator;
