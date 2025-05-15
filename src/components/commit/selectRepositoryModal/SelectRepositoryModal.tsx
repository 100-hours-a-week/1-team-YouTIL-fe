'use client';

import { useEffect, useState } from 'react';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
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

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await callApi<RepositoryResponse>({
          method: 'GET',
          endpoint: `/github/repositories?organizationId=${selectedOrg ? selectedOrg.organization_id : ''}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials:"include",
        });
        setRepositories(response.data.repositories);
      } catch (err) {
        console.error('레포지토리 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, [selectedOrg, accessToken, callApi]);

  const handleSelect = (repo: Repository) => {
    if (selectedRepositoryId === repo.repositoryId) {
      setSelectedRepositoryId(null);
      setRepository({ repositoryId: 0, repositoryName: '' });
    } else {
      setSelectedRepositoryId(repo.repositoryId);
      setRepository(repo);
    }
  };

  const handleCompleteClick = () => {
    if (selectedRepositoryId !== null) {
      onComplete();
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
              onClick={handleCompleteClick}
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
