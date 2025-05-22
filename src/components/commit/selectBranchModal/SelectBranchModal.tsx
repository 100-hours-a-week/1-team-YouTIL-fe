'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import { useSelectedDateStore } from '@/store/userDateStore';
import { useCommitListStore } from '@/store/userCommitListStore';
import { useFetch } from '@/hooks/useFetch';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './SelectBranchModal.scss';

interface Branch {
  name: string;
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

interface BranchResponse {
  data: {
    branches: Branch[];
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

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const queryClient = useQueryClient();

  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {data: branchData,isLoading} = useQuery({
    queryKey: ['branches', selectedOrg?.organization_id ?? '', selectedRepo?.repositoryId, accessToken],
    queryFn: async () => {
      if (!selectedRepo) return { data: { branches: [] } };
      return await callApi<BranchResponse>({
        method: 'GET',
        endpoint: `/github/branches?organizationId=${selectedOrg?.organization_id ?? ''}&repositoryId=${selectedRepo.repositoryId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
  });

  const handleSelect = (branch: Branch) => {
    setSelectedBranchName((prev) => (prev === branch.name ? null : branch.name));
  };

  const handleComplete = async () => {
    if (!selectedBranchName || !selectedRepo || !selectedDate) return;

    const queryKey = ['commits', selectedOrg?.organization_id ?? '', selectedRepo.repositoryId, selectedBranchName, selectedDate];
    const cachedCommitData = queryClient.getQueryData<CommitDetailResponse>(queryKey);

    if (cachedCommitData) { // 캐싱 데이터가 있으면면
      const commits = cachedCommitData.data?.commits ?? [];
      setCommits(commits);
      setSelectedBranch({ branchName: selectedBranchName });
      onClose();
    } 
    else { // 없으면 페치
      setIsSubmitting(true);
      try {
        const response = await callApi<CommitDetailResponse>({
          method: 'GET',
          endpoint: `/github/commits?organizationId=${selectedOrg?.organization_id ?? ''}&repositoryId=${selectedRepo.repositoryId}&branchId=${selectedBranchName}&date=${selectedDate}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const commits = response?.data?.commits ?? [];
        setCommits(commits);
        setSelectedBranch({ branchName: selectedBranchName });

        queryClient.setQueryData(queryKey, response); // 그리고 캐싱싱

        onClose();
      } catch (err) {
        console.error('커밋 가져오기 실패:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const branches = branchData?.data?.branches ?? [];
  const isCompleteEnabled = selectedBranchName !== null;

  const isBranchInitiallyLoading = isLoading && !branchData;

  return (
    <div className="branch-modal">
      <div className="branch-modal__overlay" onClick={onClose} />
      <div className="branch-modal__content">
        <h2 className="branch-modal__title">브랜치 선택</h2>
        {isBranchInitiallyLoading || isSubmitting ? (
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
