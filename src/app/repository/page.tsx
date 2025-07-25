import RepositoryDateCalendar from '@/components/repository/repositoryDateCalendar/RepositoryDateCalendar';
import RepositoryNavigator from '@/components/repository/repositoryNavigator/RepositoryNavigator';

const repository = () => {
  return (
    <div>
      <RepositoryDateCalendar/>
      <RepositoryNavigator />
    </div>
  );
};

export default repository;
