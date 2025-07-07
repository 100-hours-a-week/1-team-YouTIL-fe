import { createQueryKeys } from "@lukemorales/query-key-factory";

export const communityKeys = createQueryKeys('community', {
    comment:(tilIdNumber:number) => [tilIdNumber],
    list:(selectedCategory:string) => [selectedCategory],
    detail:(tilIdNumber : number) => [tilIdNumber],
});

