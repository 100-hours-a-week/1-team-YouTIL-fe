export const useNextDomainStep = (currentMonth: number): number => {
    const moveTable: Record<number, number> = {
      1: 4,
      2: 4,
      3: 4,
      4: 4,
      5: 4,
      6: 4,
      7: 3,
      8: 2,
      9: 1,
      10: 0,
      11: 0,
      12: 0,
    };
  
    return moveTable[currentMonth] ?? 0;
  };
  