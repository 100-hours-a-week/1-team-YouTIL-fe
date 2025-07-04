'use client';

import './GenerateTILForm.scss';
import { useSelectedCommitListStore } from '@/store/useSelectedCommitListStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import GenerateTILModal from '../generateTILModal/GenerateTILModal';
import { useModal } from '@/hooks/useModal';
import { mainKeys } from '@/querykey/main.querykey';
import { profileKeys } from '@/querykey/profile.querykey';
import { repositoryKeys } from '@/querykey/repository.querykey';

interface TILPayload {
  organizationId: number | string;
  repositoryId: number;
  branch: string;
  commits: { commit_message: string; sha: string }[];
  title: string;
  category: string;
  is_shared: boolean;
}

type Category = 'FULLSTACK' | 'AI' | 'CLOUD';

const GenerateTILForm = () => {
  const router = useRouter();
  const { selectedCommits } = useSelectedCommitListStore();
  const { callApi } = useFetch();
  const queryClient = useQueryClient();

  const selectedOrganization = useOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const accessToken = useGetAccessToken();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('FULLSTACK');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const generateModal = useModal();

  const validateTitle = (title: string, setShake: (s: boolean) => void): boolean => {
    if (title.trim() === '') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }
    return true;
  };

  const buildPayload = (): TILPayload => ({
    organizationId: selectedOrganization?.organization_id ?? '',
    repositoryId: selectedRepository?.repositoryId ?? 0,
    branch: selectedBranch?.branchName ?? '',
    commits: selectedCommits,
    title,
    category,
    is_shared: visibility === 'public',
  });

  const mutation = useMutation({
    mutationFn: async (payload: TILPayload) => {
      return await callApi({
        method: 'POST',
        endpoint: '/tils',
        body: payload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: mainKeys.newTILList().queryKey});
      queryClient.refetchQueries({ queryKey: mainKeys.heatmapCalendar._def, exact: false })
      queryClient.invalidateQueries({ queryKey: repositoryKeys.repositoryTILCalendar._def, exact: false })
      queryClient.invalidateQueries({queryKey: repositoryKeys.repositoryTIL._def, exact: false})
      queryClient.invalidateQueries({queryKey: profileKeys.profileTIL._def, exact:false})
      router.push('/repository');
    },
    onError: () => {
      setIsError(true);
      generateModal.open();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTitle(title, setShake)) return;

    const payload = buildPayload();
    mutation.mutate(payload);
  };

  return (
    <>
      {(isLoading || generateModal.isOpen) && (
        <GenerateTILModal
          isError={isError}
          onClose={() => {
            setIsError(false);
            generateModal.close();
          }}
        />
      )}

      <div className="generate">
        <form className="generate__form" onSubmit={handleSubmit}>
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
              onChange={(e) => setCategory(e.target.value as Category)}
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
