import { createQueryKeys } from '@lukemorales/query-key-factory';

export const commitKeys = createQueryKeys('commit', {
  commitCalendar: (
    organizationId: string | number,
    repositoryId: number | undefined,
    branchName: string | undefined,
    year?:string
  ) => ({
    queryKey: [
      organizationId,
      repositoryId,
      branchName,
      year
    ],
  }),
  organization:() => ['static'],
  repository: (organizationId: string | number) => [organizationId || ''],
  branch:(organization_id : string | number, repositoryId : number | undefined) => [organization_id || '', repositoryId],
  list :(organization_id : string | number, 
    repositoryId : number | undefined, 
    branchName : string | undefined, 
    selectedDate : string) => [organization_id || '', repositoryId, branchName, selectedDate],
});
