'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSelectedCommitListStore } from '@/store/useSelectedCommitListStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useSelectedDateStore } from '@/store/useDateStore';
import { useFetch } from '@/hooks/useFetch';

import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import NoCommitDescription from '../noCommitDescription/NoCommitDescription';
import './CommitList.scss';

interface Commit {
  commit_message: string;
  sha: string;
}

interface CommitDetailResponse {
  data: {
    commits: Commit[];
  };
}

const CommitList = () => {
  const router = useRouter();
  const { setSelectedCommits } = useSelectedCommitListStore();
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const MAX_SELECTABLE_COMMITS = 5;
  const selectedOrganizaion = useOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useBranchStore((state) => state.selectedBranch);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);

  const [selectedCommitIndexes, setSelectedCommitIndexes] = useState<number[]>([]);
  const [selectedCommitsPreview, setSelectedCommitsPreview] = useState<Commit[]>([]);
  const [shake, setShake] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedCommitIndexes([]);
    setSelectedCommitsPreview([]);
  }, [selectedDate]);

  const { data: commitData, isLoading } = useQuery({
    queryKey: ['commits', selectedOrganizaion?.organization_id ?? '', selectedRepository?.repositoryId, selectedBranchName?.branchName, selectedDate],
    queryFn: async () => {
      const response = await callApi<CommitDetailResponse>({
        method: 'GET',
        endpoint: `/github/commits?organizationId=${selectedOrganizaion?.organization_id ?? ''}&repositoryId=${selectedRepository?.repositoryId}&branchId=${selectedBranchName?.branchName}&date=${selectedDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    enabled: !!selectedRepository && !!selectedBranchName && !!selectedDate && existAccess,
    refetchOnWindowFocus: true,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const commits = commitData?.data?.commits ?? [];

  const isCommitSelectable = (index: number) => {
    return !!commits[index];
  };

  const isCommitAlreadySelected = (index: number, selectedIndexes: number[]) => {
    return selectedIndexes.includes(index);
  };

  const getNextCommitIndexes = (index: number, selectedIndexes: number[]): number[] | null => {
    if (isCommitAlreadySelected(index, selectedIndexes)) {
      return selectedIndexes.filter((i) => i !== index);
    }

    if (selectedIndexes.length >= MAX_SELECTABLE_COMMITS) {
      triggerShakeAt(index);
      return null;
    }

    return [...selectedIndexes, index];
  };

  const triggerShakeAt = (index: number) => {
    setShakeIndex(index);
    setTimeout(() => setShakeIndex(null), 500);
  };

  const updateSelectedCommitsPreview = (indexes: number[]) => {
    const selected = indexes.map((i) => commits[i]);
    setSelectedCommitsPreview(selected);
  };

  const handleCommitClick = (index: number) => {
    if (!isCommitSelectable(index)) return;

    setSelectedCommitIndexes((prev) => {
      const next = getNextCommitIndexes(index, prev);
      if (!next) return prev;

      updateSelectedCommitsPreview(next);
      return next;
    });
  };

  const handleGenerateClick = () => {
    if (selectedCommitsPreview.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSelectedCommits(selectedCommitsPreview);
    router.push('/generate');
  };

  const canShowGenerateButton =
    commits.length > 0 && selectedRepository && selectedBranchName && selectedDate;

  return (
    <div className="commit-list">
      {canShowGenerateButton && (
        <div className="commit-list__actions">
          <button
            className={`commit-list__button ${shake ? 'shake error' : ''}`}
            onClick={handleGenerateClick}
          >
            생성
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="commit-list__loading">
          <span className="commit-list__spinner" />
          로딩 중...
        </p>
      ) : commits.length === 0 ? (
        <div className="commit-list__desc">
          <NoCommitDescription />
        </div>
      ) : (
        <ul className="commit-list__ul">
          {commits.map((commit, idx) => (
            <li
              key={idx}
              className={`commit-list__item
                ${selectedCommitIndexes.includes(idx) ? 'commit-list__item--selected' : ''}
                ${shakeIndex === idx ? 'error shake' : ''}`}
              onClick={() => handleCommitClick(idx)}
            >
              {commit.commit_message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommitList;
