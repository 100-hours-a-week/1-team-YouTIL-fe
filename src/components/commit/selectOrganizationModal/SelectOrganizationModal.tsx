'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './SelectOrganizationModal.scss';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useDraftSelectionStore } from '@/store/useDraftSelectionStore';

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

  const { data: organizations = [], isLoading } = useQuery<Organization[]>({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await callApi<OrganizationResponse>({
        method: 'GET',
        endpoint: '/github/organization',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data.organizations;
    },
    enabled: existAccess,
    staleTime: 6 * 3600000,
    gcTime: 3600000,
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
  }

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

export default SelectOrganizationModal;
