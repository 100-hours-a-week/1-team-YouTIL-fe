'use client';

import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import RepositoryTILList from '../til/RepositoryTILList';
import RepositoryInterviewList from '../interview/RepositoryInterviewList';
import './RepositoryNavigator.scss';

const RepositoryNavigator = () => {
  const { activeTab, setActiveTab } = useRepositoryDateStore();

  return (
    <div className={`repository-navigator ${activeTab}-active`}>
      <div className="repository-navigator__tabs">
        <button
          className={`repository-navigator__tab ${activeTab === 'til' ? 'active' : ''}`}
          onClick={() => setActiveTab('til')}
        >
          TIL
        </button>
        <button
          className={`repository-navigator__tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          면접질문
        </button>
        <div className="repository-navigator__underline" />
      </div>

      <div className="repository-navigator__content">
        {activeTab === 'til' && <RepositoryTILList />}
        {activeTab === 'interview' && <RepositoryInterviewList />}
      </div>
    </div>
  );
};

export default RepositoryNavigator;
