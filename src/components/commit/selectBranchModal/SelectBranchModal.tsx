'use client';

import { useEffect, useState } from 'react';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useFetch } from '@/hooks/useFetch';
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

interface Props {
  onClose: () => void;
}

const SelectBranchModal = ({ onClose }: Props) => {
  const selectedOrg = useUserOrganizationStore((state) => state.selectedOrganization);
  const selectedRepo = useUserRepositoryStore((state) => state.selectedRepository);
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
        console.log(response);
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
    if (selectedBranchName === branch.name) {
      setSelectedBranchName(null);
    } else {
      setSelectedBranchName(branch.name);
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
              onClick={onClose}
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
