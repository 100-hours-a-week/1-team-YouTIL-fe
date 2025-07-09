import { createQueryKeys } from "@lukemorales/query-key-factory";

export const repositoryKeys = createQueryKeys('repository', {
    tilCalendar:(selectedYear: number) => [selectedYear], // 레포지토리 캘린더 til 기록
    interviewCalendar: (selectedYear: number) => [selectedYear], // 레포지토리 캘린더 면접질문 기록
    tilList:(tilDate : string) => [tilDate], // 레포지토리 til 목록
    tilDetail:(expandedTilId? : number) => [expandedTilId], // 레포지토리 til 상세
    interviewList: (interviewDate: string) => [interviewDate], // 레포지토리 면접질문 목록
    interviewDetail: (expandedInterviewId?: number) => [expandedInterviewId], // 레포지토리 면접질문 디테일 

    uplpadOrganization:() => ['static'], // 레포지토리 업로드 조직 쿼리키
    uploadRepository:(organizationId: string | number) => [organizationId || ''], // 레포지토리 업로드 레포지토리 쿼리키
    uploadBranch:(organization_id : string | number, repositoryId : number | undefined) => [organization_id || '', repositoryId], // 레포지토리 업로드 브랜치 쿼리키키
  });

