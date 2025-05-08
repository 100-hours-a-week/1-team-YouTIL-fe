'use client'

import RepositoryTILList from "@/components/repository/til/RepositoryTILList";
import { useRepositoryDateStore } from "@/store/useRepositoryDateStore";
import RepositoryDateCalendar from "@/components/repository/repositoryDateCalendar/RepositoryDateCalendar";

const RepositoryTilPage = () => {
  const setTilDate = useRepositoryDateStore((state) => state.setTilDate);

  return (
    <div>
      <RepositoryDateCalendar setDate={setTilDate} />
      <RepositoryTILList />
    </div>
  );
};

export default RepositoryTilPage;
