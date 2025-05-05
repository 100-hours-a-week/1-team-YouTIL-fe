'use client';

import { useState } from 'react';
import SelectOrganizationModal from '../selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from '../selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from '../selectBranchModal/SelectBranchModal';
import { useGithubConnectionStore } from '@/store/githubConnectionStore';
import './LinkGithubButton.scss';

const LinkGithubButton = () => {
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);
  const [repositoryModalOpen, setRepositoryModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const { setConnected } = useGithubConnectionStore();

  const handleOpenOrganizationModal = () => {
    setOrganizationModalOpen(true);
  };

  const handleCloseOrganizationModal = () => {
    setOrganizationModalOpen(false);
  };

  const handleCompleteOrganizationSelection = () => {
    setOrganizationModalOpen(false);
    setRepositoryModalOpen(true);
  };

  const handleCloseRepositoryModal = () => {
    setRepositoryModalOpen(false);
  };

  const handleCompleteRepositorySelection = () => {
    setRepositoryModalOpen(false);
    setBranchModalOpen(true);
  };

  const handleCloseBranchModal = () => {
    setBranchModalOpen(false);
    setConnected();
  };

  return (
    <>
      <div className="link-github-button" onClick={handleOpenOrganizationModal}>
        깃허브 연동하기
      </div>

      {organizationModalOpen && (
        <SelectOrganizationModal
          onClose={handleCloseOrganizationModal}
          onComplete={handleCompleteOrganizationSelection}
        />
      )}

      {repositoryModalOpen && (
        <SelectRepositoryModal
          onClose={handleCloseRepositoryModal}
          onComplete={handleCompleteRepositorySelection}
        />
      )}

      {branchModalOpen && (
        <SelectBranchModal
          onClose={handleCloseBranchModal}
        />
      )}
    </>
  );
};

export default LinkGithubButton;
