'use client';

import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import RepositoryTILList from '../til/RepositoryTILList';
import RepositoryInterviewList from '../interview/RepositoryInterviewList';
import './RepositoryNavigator.scss';

const RepositoryNavigator = () => {
  const { activeTab, setActiveTab } = useRepositoryDateStore();

  return (
    <section className={`repository-navigator ${activeTab}-active`}>
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

      <section className="repository-navigator__content">
        <article>
          {activeTab === 'til' && <RepositoryTILList />}
        </article>
        <article>
          {activeTab === 'interview' && <RepositoryInterviewList />}
        </article>
      </section>
    </section>
  );
};

export default RepositoryNavigator;
