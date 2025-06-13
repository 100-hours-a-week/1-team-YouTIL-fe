'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useSelectedDateStore } from '@/store/useDateStore';
import { useCommitListLogic } from '@/hooks/commit/commitList/useCommitListLogic';
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
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const selectedOrganizaion = useOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useBranchStore((state) => state.selectedBranch);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);

  const { data: commitData, isLoading } = useQuery<CommitDetailResponse>({
    queryKey: [
      'commits',
      selectedOrganizaion?.organization_id ?? '',
      selectedRepository?.repositoryId,
      selectedBranchName?.branchName,
      selectedDate,
    ],
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

  const commits = useMemo(() => commitData?.data?.commits ?? [], [commitData]);

  const {
    selectedCommitIndexes,
    shake,
    shakeIndex,
    handleCommitClick,
    handleGenerateClick,
  } = useCommitListLogic(commits);

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
