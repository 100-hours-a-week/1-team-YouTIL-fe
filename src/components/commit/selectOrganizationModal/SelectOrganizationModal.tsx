'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './SelectOrganizationModal.scss';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import useCheckAccess from '@/hooks/useCheckExistAccess';

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
  const setSelectedOrganization = useUserOrganizationStore((state) => state.setSelectedOrganization);

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [noSelection, setNoSelection] = useState(false);


  const { data: organizations = [], isLoading} = useQuery<Organization[]>({
    queryKey: ['organization'] as const,
    queryFn: async () => {
      const response = await callApi<OrganizationResponse>({
        method: 'GET',
        endpoint: '/github/organization',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data.organizations;
    },
    enabled: existAccess,
    staleTime: 6 * 3600000,
    gcTime: 6 * 3600000,
    // 조직은 거의 변하지 않으므로 refetch 및 수동 갱신 x
  });

  useEffect(() => {
    if (noSelection) {
      setSelectedOrganization(null);
    } 
    else if (selectedOrgId !== null) {
      const selected = organizations.find((org) => org.organization_id === selectedOrgId);
      if (selected) {
        setSelectedOrganization(selected);
      }
    }
  }, [noSelection, selectedOrgId, organizations, setSelectedOrganization]);

  const handleSelect = (org: Organization) => {
    if (selectedOrgId === org.organization_id) {
      setSelectedOrgId(null);
    } else {
      setSelectedOrgId(org.organization_id);
      setNoSelection(false);
    }
  };

  const handleCheckboxChange = () => {
    setNoSelection((prev) => {
      const next = !prev;
      if (next) {
        setSelectedOrgId(null);
      }
      return next;
    });
  };

  const handleComplete = () => {
    onComplete();
  };

  const isCompleteEnabled = noSelection || selectedOrgId !== null;

  return (
    <div className="organization-modal">
      <div className="organization-modal__overlay" onClick={onClose} />
      <div className="organization-modal__content">
        <h2 className="organization-modal__title">조직 선택</h2>

        {isLoading ? (
          <p className="organization-modal__loading">로딩 중...</p>
        ) : (
          <>
            <ul className="organization-modal__list">
              {organizations.map((org) => (
                <li
                  key={org.organization_id}
                  className={`organization-modal__item ${
                    selectedOrgId === org.organization_id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(org)}
                >
                  {org.organization_name}
                </li>
              ))}
            </ul>

            <div className="organization-modal__checkbox">
              <label>
                <input type="checkbox" checked={noSelection} onChange={handleCheckboxChange} />
                조직을 선택하지 않음
              </label>
            </div>

            <button
              className="organization-modal__close"
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

export default SelectOrganizationModal;
