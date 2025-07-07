import { createQueryKeys } from '@lukemorales/query-key-factory';

export const commitKeys = createQueryKeys('commit', {
  commitCalendar: ( // 커밋 리스트 캘린더 쿼리키
    organizationId: number | undefined,
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
  organization:() => ['static'], // 선택한 organization 쿼리키
  repository: (organizationId: string | number) => [organizationId || ''], // 선택한 레포지토리 쿼리키
  branch:(organization_id : string | number, repositoryId : number | undefined) => [organization_id || '', repositoryId], // 선택한 브랜치 쿼리키
  list :(organization_id : string | number, // 커밋 리스트 쿼리키
    repositoryId : number | undefined, 
    branchName : string | undefined, 
    selectedDate : string) => [organization_id || '', repositoryId, branchName, selectedDate],
});
