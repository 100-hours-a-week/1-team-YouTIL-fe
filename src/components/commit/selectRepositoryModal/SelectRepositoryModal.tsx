'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import './SelectRepositoryModal.scss';

interface Repository {
  repositoryId: number;
  repositoryName: string;
}

interface RepositoryResponse {
  data: {
    repositories: Repository[];
  };
}

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const SelectRepositoryModal = ({ onClose, onComplete }: Props) => {
  const selectedOrg = useUserOrganizationStore((state) => state.selectedOrganization);
  const setRepository = useUserRepositoryStore((state) => state.setRepository);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);

  const { data: repositories = [], isLoading, } = useQuery<Repository[]>({
    queryKey: ['repository', selectedOrg?.organization_id ?? ''] as const,
    queryFn: async () => {
      const response = await callApi<RepositoryResponse>({
        method: 'GET',
        endpoint: `/github/repositories?organizationId=${selectedOrg ? selectedOrg.organization_id : ''}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data.repositories;
    },
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
    // 레포지토리 역시 자주 변하지 않으므로 refetch 및 수동 갱신x
  });

  const handleSelect = (repo: Repository) => {
    if (selectedRepositoryId === repo.repositoryId) {
      setSelectedRepositoryId(null);
    } 
    else {
      setSelectedRepositoryId(repo.repositoryId);
      setRepository(repo);
    }
  };

  const isCompleteEnabled = selectedRepositoryId !== null;

  return (
    <div className="repository-modal">
      <div className="repository-modal__overlay" onClick={onClose} />
      <div className="repository-modal__content">
        <h2 className="repository-modal__title">레포지토리 선택</h2>

        {isLoading ? (
          <p className="repository-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="repository-modal__list">
              {repositories.map((repo) => (
                <li
                  key={repo.repositoryId}
                  className={`repository-modal__item ${
                    selectedRepositoryId === repo.repositoryId ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(repo)}
                >
                  {repo.repositoryName}
                </li>
              ))}
            </ul>

            <button
              className="repository-modal__close"
              onClick={onComplete}
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

export default SelectRepositoryModal;
