'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useGithubUploadStore } from '@/store/useGIthubUploadStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import './SelectRepositoryModal.scss';
import { repositoryKeys } from '@/querykey/repository.querykey';

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
  const draftOrg = useGithubUploadStore((state) => state.draftOrg);
  const setDraftRepo = useGithubUploadStore((state) => state.setDraftRepo);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: repositoryKeys.uploadRepository(draftOrg?.organization_id ?? '').queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<RepositoryResponse>({
        method: 'GET',
        endpoint: `/github/repositories?organizationId=${encodeURIComponent(draftOrg?.organization_id ?? '')}&page=${pageParam}&offset=20`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.repositories.length < 20) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
  });


  const lastItemRef = useInfinityScrollObserver<HTMLDivElement>({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
  const repositories = data?.pages.flatMap((page) => page.data.repositories) ?? [];

  return (
    <dialog className="repository-modal" open>
      <div className="repository-modal__overlay" onClick={onClose} />
      <section className="repository-modal__content" role="dialog" aria-modal="true" aria-labelledby="repository-modal-title">
        <header>
          <h2 className="repository-modal__title">레포지토리 선택</h2>
        </header>

        {isLoading ? (
          <p className="repository-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="repository-modal__list">
              {repositories.map((repo, index) => {
                const isLastItem = index === repositories.length - 1;

                return (
                  <div
                    key={repo.repositoryId}
                    className={`repository-modal__item ${
                      selectedRepositoryId === repo.repositoryId ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(repo)}
                    ref={isLastItem ? lastItemRef : undefined}
                  >
                    {repo.repositoryName}
                  </div>
                );
              })}
            </ul>
            <footer>

            <button
              className="repository-modal__close"
              onClick={onComplete}
              disabled={!isCompleteEnabled}
              >
              선택 완료
            </button>
            </footer>
          </>
        )}
      </section>
    </dialog>
  );
};

export default SelectRepositoryModal;
