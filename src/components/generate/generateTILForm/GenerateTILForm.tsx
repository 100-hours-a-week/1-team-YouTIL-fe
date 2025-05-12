'use client';

import './GenerateTILForm.scss';
import { useSelectedCommitListStore } from '@/store/selectedCommitListStore';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GenerateTILModal from '../generateTILModal/GenerateTILModal';
import DeadLineModal from '../deadLineModal/DeadLineModal';

const GenerateTILForm = () => {
  const router = useRouter();
  const { selectedCommits } = useSelectedCommitListStore();
  const { callApi } = useFetch();

  const selectedOrganization = useUserOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useUserRepositoryStore((state) => state.selectedRepository);
  const selectedBranch = useUserBranchStore((state) => state.selectedBranch);
  const accessToken = useGetAccessToken();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('풀스택');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeadlineError, setIsDeadlineError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const payload = {
      organizationId: selectedOrganization?.organization_id ?? null,
      repositoryId: selectedRepository?.repositoryId ?? 0,
      branch: selectedBranch?.branchName ?? '',
      commits: selectedCommits,
      title,
      category: category.toUpperCase(),
      is_shared: visibility === 'public',
    };

    setIsLoading(true);

    try {
      const response = await callApi({
        method: 'POST',
        endpoint: '/tils',
        body: payload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      console.log('TIL 생성 응답:', response);
    
      setIsLoading(false);
      router.push('/repository');
    } catch (error) {
      setIsLoading(false);
    
      if (error instanceof Error) {
        if (error.message.includes('503')) {
          setIsDeadlineError(true);
          return;
        }
        console.error('TIL 생성 실패:', error.message);
      } else {
        console.error('예상치 못한 에러:', error);
      }
    }
  };    

  return (
    <>
      {isLoading && <GenerateTILModal />}
      {isDeadlineError && <DeadLineModal onClose={() => setIsDeadlineError(false)} />}

      <div className="generate">
        <form className="generate__form">
          <label className="generate__label">
            선택된 커밋 목록
            <section className="generate__commits">
              <ul className="generate__commits-list">
                {selectedCommits.map((commit, index) => (
                  <li key={index} className="generate__commit-item">
                    {commit.commit_message}
                  </li>
                ))}
              </ul>
            </section>
          </label>

          <label className="generate__label">
            TIL 제목
            <input
              type="text"
              maxLength={40}
              placeholder="TIL 제목을 입력하세요 (최대 40자)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="generate__input"
            />
          </label>

          <label className="generate__label">
            카테고리
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="generate__select"
            >
              <option value="FULLSTACK">풀스택</option>
              <option value="AI">인공지능</option>
              <option value="CLOUD">클라우드</option>
            </select>
          </label>

          <div className="generate__visibility">
            <label>
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={() => setVisibility('public')}
              />
              <span className="generate__visibility-radio">
                <p className="generate__visibility-radio-label">public</p>
                <p className="generate__visibility-radio-desc">다른 사용자에게 공유됩니다.</p>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
              />
              <span className="generate__visibility-radio">
                <p className="generate__visibility-radio-label">private</p>
                <p className="generate__visibility-radio-desc">다른 사용자에게 공유되지 않습니다.</p>
              </span>
            </label>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className={`generate__button ${shake ? 'error shake' : ''}`}
          >
            생성하기
          </button>
        </form>
      </div>
    </>
  );
};

export default GenerateTILForm;
