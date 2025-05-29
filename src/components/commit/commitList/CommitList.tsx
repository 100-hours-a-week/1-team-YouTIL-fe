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
  
  const selectedOrganizaion = useOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useBranchStore((state) => state.selectedBranch);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [userSelectedCommits, setUserSelectedCommits] = useState<Commit[]>([]);
  const [shake, setShake] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndexes([]);
    setUserSelectedCommits([]);
  }, [selectedDate]);

  const { data: commitData, isLoading } = useQuery({
    queryKey: ['commits',selectedOrganizaion?.organization_id ?? '',selectedRepository?.repositoryId, selectedBranchName?.branchName, selectedDate],
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
    enabled:
      !!selectedRepository &&
      !!selectedBranchName &&
      !!selectedDate &&
      existAccess,
    refetchOnWindowFocus : true,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const commits = commitData?.data?.commits ?? [];

  const toggleSelection = (index: number) => {
    const selectedCommit = commits[index];
    if (!selectedCommit) return;

    setSelectedIndexes((prev) => {
      let next;
      if (prev.includes(index)) {
        next = prev.filter((i) => i !== index);
      } else {
        if (prev.length >= 5) {
          setShakeIndex(index);
          setTimeout(() => setShakeIndex(null), 500);
          return prev;
        }
        next = [...prev, index];
      }
      const selected = next.map((i) => commits[i]);
      setUserSelectedCommits(selected);
      return next;
    });
  };

  const handleGenerateClick = () => {
    if (userSelectedCommits.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSelectedCommits(userSelectedCommits);
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
                ${selectedIndexes.includes(idx) ? 'commit-list__item--selected' : ''}
                ${shakeIndex === idx ? 'error shake' : ''}`}
              onClick={() => toggleSelection(idx)}
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
