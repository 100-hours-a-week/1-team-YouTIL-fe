'use client';

import { useState, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useGithubUploadStore } from '@/store/useGIthubUploadStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import { useMutation } from '@tanstack/react-query';
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

interface GithubUploadResponse {
  success: boolean;
  message: string;
  code: string;
  responseAt: string;
  data: {
    branch: string;
    isConfigured: boolean;
    organizationId: number | null;
    owner: string;
    repository: string;
    repositoryId: number;
    updatedAt: string;
  };
}

interface Props {
  onClose: () => void;
  onComplete: (response: GithubUploadResponse) => void;
}

const SelectBranchModal = ({ onClose, onComplete }: Props) => {
  const draftOrg = useGithubUploadStore((state) => state.draftOrg);
  const draftRepo = useGithubUploadStore((state) => state.draftRepo);
  const draftBranch = useGithubUploadStore((state) => state.draftBranch);

  const setDraftBranch = useGithubUploadStore((state) => state.setDraftBranch);

  const setSelectedBranch = useGithubUploadStore((state) => state.setBranchName);
  const setSelectedOrganization = useGithubUploadStore((state) => state.setOrganizationId);
  const setSelectedRepository = useGithubUploadStore((state) => state.setRepositoryId);

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
    queryKey: ['asdf'], 
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<BranchResponse>({
        method: 'GET',
        endpoint: `/github/branches?organizationId=${draftOrg?.organization_id ?? ''}&repositoryId=${draftRepo?.repositoryId}&page=${pageParam}&offset=20`,
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

  const { mutate: uploadTarget } = useMutation<GithubUploadResponse>({

    mutationFn: async () => {
      if (!draftRepo || !draftBranch?.branchName) {
        throw new Error('레포지토리 또는 브랜치 정보가 부족합니다.');
      }
  
      return await callApi<GithubUploadResponse>({
        method: 'PUT',
        endpoint: '/github',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          organizationId: draftOrg?.organization_id,
          repositoryId: draftRepo.repositoryId,
          branch: draftBranch.branchName,
        },
        credentials: 'include',
      });
    },
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
    uploadTarget(undefined, {
      onSuccess: (response) => {
        onComplete(response);
        onClose();
      },
    });
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
