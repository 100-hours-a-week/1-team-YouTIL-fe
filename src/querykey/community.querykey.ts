import { createQueryKeys } from "@lukemorales/query-key-factory";

export const communityKeys = createQueryKeys('community', {
    comment:(tilIdNumber:number) => [tilIdNumber], // tilDetail(커뮤니티) 댓글 쿼리키
    list:(selectedCategory:string) => [selectedCategory], // 커뮤니티 리스트 쿼리키
    detail:(tilIdNumber : number) => [tilIdNumber], // tilDetail(커뮤니티) 쿼리키
});

