import { ReactNode } from 'react';
import RepositoryUtils from '@/components/repository/RepositoryUtils';

const RepositoryLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <RepositoryUtils />
      <div>{children}</div>
    </div>
  );
};

export default RepositoryLayout;
