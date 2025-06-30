import { createQueryKeys } from '@lukemorales/query-key-factory';

export const commitKeys = createQueryKeys('commit', {
  commitListCalendar: (
    organizationId: number | undefined,
    repositoryId: number | undefined,
    branchName: string | undefined,
    year?:string
  ) => ({
    queryKey: [
      'commit-calendar',
      organizationId,
      repositoryId,
      branchName,
      year
    ],
  }),
});
