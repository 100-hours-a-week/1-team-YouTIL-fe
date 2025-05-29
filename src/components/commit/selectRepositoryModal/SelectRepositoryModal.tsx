'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import './SelectRepositoryModal.scss';
import { useDraftSelectionStore } from '@/store/useDraftSelectionStore';

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
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const draftOrg = useDraftSelectionStore((state) => state.draftOrg);
  const setDraftRepo = useDraftSelectionStore((state) => state.setDraftRepo);

  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);

  const { data: repositories = [], isLoading } = useQuery<Repository[]>({
    queryKey: ['repository', draftOrg?.organization_id ?? ''],
    queryFn: async () => {
      const response = await callApi<RepositoryResponse>({
        method: 'GET',
        endpoint: `/github/repositories?organizationId=${draftOrg ? draftOrg.organization_id : ''}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data.repositories;
    },
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
  });

  const handleSelect = (repo: Repository) => {
    if (selectedRepositoryId === repo.repositoryId) {
      setSelectedRepositoryId(null);
      setDraftRepo(null);
    } else {
      setSelectedRepositoryId(repo.repositoryId);
      setDraftRepo({
        repositoryId: repo.repositoryId,
        repositoryName: repo.repositoryName,
      });
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
