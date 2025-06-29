import { createQueryKeys } from "@lukemorales/query-key-factory";

export const repositoryKeys = createQueryKeys('repository', {
    repositoryTILCalendar:(selectedYear: number) => ['til-calendar', selectedYear], // 레포지토리 캘린더 til 기록
    repositoryInterviewCalendar: (selectedYear: number) => ['interview-calendar', selectedYear], // 레포지토리 캘린더 면접질문 기록
    repositoryTIL:(tilDate : string) => ['til-list', tilDate], // 레포지토리 til 목록
    repositoryTILDetail:(expandedTilId? : number) => ['til-detail', expandedTilId], // 레포지토리 til 상세
    repositoryInterview: (interviewDate: string) => ['interview-list', interviewDate], // 레포지토리 면접질문 목록
    repositoryInterviewDetail: (expandedInterviewId?: number) => ['interview-detail', expandedInterviewId], // 레포지토리 면접질문 디테일 
  });

