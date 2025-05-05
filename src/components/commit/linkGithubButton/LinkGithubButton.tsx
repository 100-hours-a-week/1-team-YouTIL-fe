'use client';

import { useState } from 'react';
import SelectOrganizationModal from '../selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from '../selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from '../selectBranchModal/SelectBranchModal';
import './LinkGithubButton.scss';

const LinkGithubButton = () => {
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);
  const [repositoryModalOpen, setRepositoryModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  // 1. 깃허브 연동 버튼 클릭
  const handleOpenOrganizationModal = () => {
    setOrganizationModalOpen(true);
  };

  // 2. 조직 선택 모달 닫기
  const handleCloseOrganizationModal = () => {
    setOrganizationModalOpen(false);
  };

  // 3. 조직 선택 완료 시 → 레포지토리 모달 열기
  const handleCompleteOrganizationSelection = () => {
    setOrganizationModalOpen(false);
    setRepositoryModalOpen(true);
  };

  // 4. 레포지토리 모달 닫기
  const handleCloseRepositoryModal = () => {
    setRepositoryModalOpen(false);
  };

  // 5. 레포지토리 선택 완료 시 → 브랜치 모달 열기
  const handleCompleteRepositorySelection = () => {
    setRepositoryModalOpen(false);
    setBranchModalOpen(true);
  };

  // 6. 브랜치 모달 닫기
  const handleCloseBranchModal = () => {
    setBranchModalOpen(false);
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
