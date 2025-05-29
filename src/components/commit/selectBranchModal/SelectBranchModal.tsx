'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import { useFetch } from '@/hooks/useFetch';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useDraftSelectionStore } from '@/store/useDraftSelectionStore';
import './SelectBranchModal.scss';

interface Branch {
  name: string;
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
  const draftOrg = useDraftSelectionStore((state) => state.draftOrg);
  const draftRepo = useDraftSelectionStore((state) => state.draftRepo);
  const draftBranch = useDraftSelectionStore((state) => state.draftBranch);

  const setDraftBranch = useDraftSelectionStore((state) => state.setDraftBranch);
  const setSelectedBranch = useUserBranchStore((state) => state.setSelectedBranch);
  const setSelectedOrganization = useUserOrganizationStore((state) => state.setSelectedOrganization);
  const setSelectedRepository = useUserRepositoryStore((state) => state.setSelectedRepository);

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ['branch', draftOrg?.organization_id ?? '', draftRepo?.repositoryId],
    queryFn: async () => {
      if (!draftRepo) return [];
      const response = await callApi<BranchResponse>({
        method: 'GET',
        endpoint: `/github/branches?organizationId=${draftOrg ? draftOrg.organization_id : ''}&repositoryId=${draftRepo.repositoryId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data.branches;
    },
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 1800000,
    refetchOnWindowFocus: true,
  });

  const handleSelect = (branch: Branch) => {
    if (selectedBranchName === branch.name) {
      setSelectedBranchName(null);
      setDraftBranch(null);
    } else {
      setSelectedBranchName(branch.name);
      setDraftBranch({ branchName: branch.name });
    }
  };

  const handleComplete = () => {
    if (!draftRepo || !draftBranch?.branchName) return;
    setSelectedOrganization(draftOrg);
    setSelectedRepository(draftRepo);
    setSelectedBranch({ branchName: draftBranch.branchName });
    onClose();
  };

  const isCompleteEnabled = selectedBranchName !== null;

  return (
    <div className="branch-modal">
      <div className="branch-modal__overlay" onClick={onClose} />
      <div className="branch-modal__content">
        <h2 className="branch-modal__title">브랜치 선택</h2>

        {isLoading ? (
          <p className="branch-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="branch-modal__list">
              {branches.map((branch) => (
                <li
                  key={branch.name}
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
              disabled={!isCompleteEnabled}
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
