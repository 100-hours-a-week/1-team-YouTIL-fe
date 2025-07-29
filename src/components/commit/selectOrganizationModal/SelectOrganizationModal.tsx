'use client';

import { useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useDraftSelectionStore } from '@/store/useDraftSelectionStore';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import './SelectOrganizationModal.scss';
import { commitKeys } from '@/querykey/commit.querykey';

interface Organization {
  organization_id: number;
  organization_name: string;
}

interface OrganizationResponse {
  data: {
    organizations: Organization[];
  };
}

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const SelectOrganizationModal = ({ onClose, onComplete }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const { setDraftOrg } = useDraftSelectionStore.getState();

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [noSelection, setNoSelection] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: commitKeys.organization().queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<OrganizationResponse>({
        method: 'GET',
        endpoint: `/github/organization?page=${pageParam}&offset=20`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.organizations.length < 20) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: existAccess,
    staleTime: 6 * 3600000,
    gcTime: 3600000,
  });

  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  const lastItemRef = useInfinityScrollObserver<HTMLDivElement>({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleSelect = (org: Organization) => {
    if (selectedOrgId === org.organization_id) {
      setSelectedOrgId(null);
      setDraftOrg(null);
    } else {
      setSelectedOrgId(org.organization_id);
      setNoSelection(false);
      setDraftOrg({
        organization_id: org.organization_id,
        organization_name: org.organization_name,
      });
    }
  };

  const handleCheckboxChange = () => {
    setNoSelection((prev) => {
      const next = !prev;
      if (next) {
        setSelectedOrgId(null);
        setDraftOrg(null);
      }
      return next;
    });
  };

  const isCompleteEnabled = noSelection || selectedOrgId !== null;
  const organizations = data?.pages.flatMap((page) => page.data.organizations) ?? [];

  return (
    <section className="organization-modal">
      <div className="organization-modal__overlay" onClick={onClose} />
      <article className="organization-modal__content">
        <header>
        <h2 className="organization-modal__title">조직 선택</h2>
        </header>

        {isLoading ? (
          <p className="organization-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="organization-modal__list" ref={scrollContainerRef}>
              {organizations.map((org, index) => {
                const isLastItem = index === organizations.length - 1;

                return (
                  <div
                    key={org.organization_id}
                    className={`organization-modal__item ${
                      selectedOrgId === org.organization_id ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(org)}
                    ref={isLastItem ? lastItemRef : undefined}
                  >
                    {org.organization_name}
                  </div>
                );
              })}
            </ul>

            <div className="organization-modal__checkbox">
              <label>
                <input type="checkbox" checked={noSelection} onChange={handleCheckboxChange} />
                조직을 선택하지 않음
              </label>
            </div>
              <footer>
            <button
              className="organization-modal__close"
              onClick={onComplete}
              disabled={!isCompleteEnabled}
              >
              선택 완료
            </button>
              </footer>
          </>
        )}
      </article>
    </section>
  );
};

export default SelectOrganizationModal;
