'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import { useSelectedDateStore } from '@/store/userDateStore';
import { useCommitListStore } from '@/store/userCommitListStore';
import { useFetch } from '@/hooks/useFetch';
import { useCommitQueryGuardStore } from '@/store/useCommitQueryGuardStore';

import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './SelectBranchModal.scss';

interface Branch {
  name: string;
}

interface BranchResponse {
  data: {
    branches: Branch[];
  };
}

interface Commit {
  commit_message: string;
  sha: string;
}

interface CommitDetailResponse {
  data: {
    commits: Commit[];
  };
}

interface Props {
  onClose: () => void;
}

const SelectBranchModal = ({ onClose }: Props) => {
  const selectedOrg = useUserOrganizationStore((state) => state.selectedOrganization);
  const selectedRepo = useUserRepositoryStore((state) => state.selectedRepository);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const setCommits = useCommitListStore((state) => state.setCommits);
  const setSelectedBranch = useUserBranchStore((state) => state.setSelectedBranch);
  const unlockCommitQuery = useCommitQueryGuardStore((state) => state.unlock);
  
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const queryClient = useQueryClient();
  
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {data: branches = [],isLoading} = useQuery<Branch[]>({
    queryKey: ['branch', selectedOrg?.organization_id ?? '', selectedRepo?.repositoryId],
    queryFn: async () => {
      if (!selectedRepo) return [];
      const response = await callApi<BranchResponse>({
        method: 'GET',
        endpoint: `/github/branches?organizationId=${selectedOrg?.organization_id ?? ''}&repositoryId=${selectedRepo.repositoryId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data.branches;
    },
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
    refetchOnWindowFocus : true, // 브랜치 목록은 자주 바뀔 수 있으므로 refetch
  });

  const handleSelect = (branch: Branch) => {
    setSelectedBranchName((prev) => (prev === branch.name ? null : branch.name));
  };

  const getCachedCommits = (): Commit[] | null => {
    const queryKey = ['commits', selectedOrg?.organization_id ?? '', selectedRepo?.repositoryId, selectedBranchName, selectedDate];
    const cached = queryClient.getQueryData<CommitDetailResponse>(queryKey);
    return cached?.data?.commits ?? null;
  };
  
  const fetchCommitsFromAPI = async (): Promise<Commit[] | null> => {
    if (!selectedBranchName || !selectedRepo || !selectedDate) return null;
  
    const queryKey = ['commits', selectedOrg?.organization_id ?? '', selectedRepo.repositoryId, selectedBranchName, selectedDate];
  
    try {
      const response = await callApi<CommitDetailResponse>({
        method: 'GET',
        endpoint: `/github/commits?organizationId=${selectedOrg?.organization_id ?? ''}&repositoryId=${selectedRepo.repositoryId}&branchId=${selectedBranchName}&date=${selectedDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const commits = response?.data?.commits ?? [];
      queryClient.setQueryData(queryKey, response);
      return commits;
    } catch (err) {
      console.error('커밋 가져오기 실패:', err);
      return null;
    }
  };
  
  const handleComplete = async () => {
    if (!selectedBranchName || !selectedRepo || !selectedDate) return;
  
    const cachedCommits = getCachedCommits();
    if (cachedCommits) {
      setCommits(cachedCommits);
      setSelectedBranch({ branchName: selectedBranchName });
      unlockCommitQuery();
      onClose();
      return;
    }
  
    setIsSubmitting(true);
    const freshCommits = await fetchCommitsFromAPI();
    setIsSubmitting(false);
  
    if (freshCommits) {
      setCommits(freshCommits);
      setSelectedBranch({ branchName: selectedBranchName });
      onClose();
    }
  };

  const isCompleteEnabled = selectedBranchName !== null;

  return (
    <div className="branch-modal">
      <div className="branch-modal__overlay" onClick={onClose} />
      <div className="branch-modal__content">
        <h2 className="branch-modal__title">브랜치 선택</h2>
        {isLoading || isSubmitting ? (
          <p className="branch-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="branch-modal__list">
              {branches.map((branch) => (
                <li
                  key={`branch-${branch.name}`}
                  className={`branch-modal__item ${selectedBranchName === branch.name ? 'selected' : ''}`}
                  onClick={() => handleSelect(branch)}
                >
                  {branch.name}
                </li>
              ))}
            </ul>

            <button
              className="branch-modal__close"
              onClick={handleComplete}
              disabled={!isCompleteEnabled || isSubmitting}
            >
              선택 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectBranchModal;
