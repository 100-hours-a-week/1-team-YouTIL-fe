export const usePrevDomainStep = (currentMonth: number): number => {
    const moveTable: Record<number, number> = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 4,
      7: 4,
      8: 4,
      9: 4,
      10: 4,
      11: 4,
      12: 4,
    };
  
    return moveTable[currentMonth] ?? 0;
  };
  