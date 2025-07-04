import { createQueryKeys } from "@lukemorales/query-key-factory";

export const profileKeys = createQueryKeys('community', {
    // profileTIL:(userId : string) => ['til-profile', userId], // 프로필 개인 til 목록
    // profileCommentList:(userId? : number) => ['comment-profile', userId], // 프로필 방명록 리스트
    // profileUserInfo:() => ['userInfo-profile'], // 프로필 내 정보
    // profileOtherUserInfo:(parsedUserId : number) => ['otherUserInfo-profile',parsedUserId], //프로필 다른 유저 정보

    // community
});

