'use client';

import { useState, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useFetch } from '@/hooks/useFetch';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useDraftSelectionStore } from '@/store/useDraftSelectionStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import { commitKeys } from '@/querykey/commit.querykey';
import './SelectBranchModal.scss';

interface Branch {
  name: string;
}

interface BranchResponse {
  data: {
    branches: Branch[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
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
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch);
  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);
  const setSelectedRepository = useRepositoryStore((state) => state.setSelectedRepository);

  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const queryClient = useQueryClient();

  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: commitKeys.branch(draftOrg?.organization_id ?? '', draftRepo?.repositoryId).queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<BranchResponse>({
        method: 'GET',
        endpoint: `/github/branches?organizationId=${encodeURIComponent(draftOrg?.organization_id ?? '')}&repositoryId=${encodeURIComponent(draftRepo?.repositoryId ?? '')}&page=${pageParam}&offset=20`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.branches.length < 20) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: existAccess,
    staleTime: 1800000,
    gcTime: 1800000,
  });

  const lastItemRef = useInfinityScrollObserver<HTMLDivElement>({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
    queryClient.removeQueries({
      queryKey: ['commit'],
    });
    setSelectedOrganization(draftOrg);
    setSelectedRepository(draftRepo);
    setSelectedBranch({ branchName: draftBranch.branchName });
    onClose();
  };

  const isCompleteEnabled = selectedBranchName !== null;
  const branches = data?.pages.flatMap((page) => page.data.branches) ?? [];

  return (
    <div className="branch-modal">
      <div className="branch-modal__overlay" onClick={onClose} />
      <div className="branch-modal__content">
        <h2 className="branch-modal__title">브랜치 선택</h2>

        {isLoading ? (
          <p className="branch-modal__loading">로딩 중...</p>
        ) : (
          <>
            <div className="branch-modal__list" ref={scrollContainerRef}>
              {branches.map((branch, index) => {
                const isLastItem = index === branches.length - 1;

                return (
                  <div
                    key={branch.name}
                    className={`branch-modal__item ${selectedBranchName === branch.name ? 'selected' : ''}`}
                    ref={isLastItem ? lastItemRef : undefined}
                    onClick={() => handleSelect(branch)}
                  >
                    {branch.name}
                  </div>
                );
              })}
            </div>

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
