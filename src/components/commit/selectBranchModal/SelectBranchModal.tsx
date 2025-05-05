'use client';

import { useEffect, useState } from 'react';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useSelectedDateStore } from '@/store/userDateStore';
import { useCommitListStore } from '@/store/userCommitListStore';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './SelectBranchModal.scss';

interface Branch {
  name: string;
}

interface Patch {
  commit_message: string;
}

interface File {
  filepath: string;
  latest_code: string;
  patches: Patch[];
}

interface CommitDetailResponse {
  data: {
    files: File[];
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
  const setCommitMessages = useCommitListStore((state) => state.setCommitMessages);

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedRepo) {
        setBranches([]);
        setIsLoading(false);
        return;
      }
      try {
        const response = await callApi<BranchResponse>({
          method: 'GET',
          endpoint: `/github/branches?organizationId=${selectedOrg ? selectedOrg.organization_id : ''}&repositoryId=${selectedRepo.repositoryId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },  
        });

        setBranches(response.data.branches);
      } catch (err) {
        console.error('브랜치 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [selectedOrg, selectedRepo, accessToken, callApi]);

  const handleSelect = (branch: Branch) => {
    setSelectedBranchName((prev) => (prev === branch.name ? null : branch.name));
  };

  const handleComplete = async () => {
    if (!selectedBranchName || !selectedRepo || !selectedDate) return;

    try {
      const response = await callApi<CommitDetailResponse>({
        method: 'GET',
        endpoint: `/github/commits?&organizationId=${selectedOrg ? selectedOrg.organization_id : ''}&repositoryId=${selectedRepo.repositoryId}&branchId=${selectedBranchName}&date=${selectedDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      const messages = response.data.files.flatMap((file) =>
        file.patches.map((p) => p.commit_message)
      );

      setCommitMessages(messages);
    } catch (err) {
      console.error('커밋 가져오기 실패:', err);
    } finally {
      onClose();
    }
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
