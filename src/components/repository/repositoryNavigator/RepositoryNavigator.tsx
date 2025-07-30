'use client';

import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import RepositoryTILList from '../til/RepositoryTILList';
import RepositoryInterviewList from '../interview/RepositoryInterviewList';
import './RepositoryNavigator.scss';

const RepositoryNavigator = () => {
  const { activeTab, setActiveTab } = useRepositoryDateStore();

  return (
    <div className={`repository-navigator ${activeTab}-active`}>
      <nav className="repository-navigator__tabs" aria-label="리포지토리 콘텐츠 탭">
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
      </nav>

      <div className="repository-navigator__content">
        <div>
          {activeTab === 'til' && <RepositoryTILList />}
        </div>
        <div>
          {activeTab === 'interview' && <RepositoryInterviewList />}
        </div>
      </div>
    </div>
  );
};

export default RepositoryNavigator;
