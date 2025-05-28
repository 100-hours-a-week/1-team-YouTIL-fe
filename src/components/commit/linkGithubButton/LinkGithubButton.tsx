'use client';

import { useState } from 'react';
import SelectOrganizationModal from '../selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from '../selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from '../selectBranchModal/SelectBranchModal';
import './LinkGithubButton.scss';

import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import { useDisplayedRepoNameStore } from '@/store/displayedRepoNameStore';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';

const LinkGithubButton = () => {
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);
  const [repositoryModalOpen, setRepositoryModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  
  const { clearBranch } = useUserBranchStore((state) => state);
  const {clearRepository} = useUserRepositoryStore((state) => state);
  const {clearOrganization} = useUserOrganizationStore((state) => state);

  const selectedRepo = useUserRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useUserBranchStore((state) => state.selectedBranch);
  const displayedRepoName = useDisplayedRepoNameStore((state) => state.repoName);

  const handleOpenOrganizationModal = () => {
    clearOrganization();
    clearRepository();
    clearBranch();
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
  };

  return (
    <>
      {selectedRepo && selectedBranchName? (
        <div className="link-github-button__info">
          <span className="link-github-button__repo-name">{displayedRepoName}</span>
          <button
            className="link-github-button__change"
            onClick={handleOpenOrganizationModal}
          >
            변경
          </button>
        </div>
      ) : (
        <div className="link-github-button" onClick={handleOpenOrganizationModal}>
          깃허브 연동하기
        </div>
      )}

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
