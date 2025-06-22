import { useCallback } from 'react';
import CalHeatmap from 'cal-heatmap';

export const useHeatmapNavigation = (
  cal: CalHeatmap | null,
  currentMonth: number,
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>,
  setYear: React.Dispatch<React.SetStateAction<number>>
) => {
  const getPrevDomainStep = (month: number): number => {
    const table: Record<number, number> = {
      1: 0, 2: 1, 3: 2, 4: 3, 5: 4,
      6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 4, 12: 4,
    };
    return table[month] ?? 0;
  };

  const getNextDomainStep = (month: number): number => {
    const table: Record<number, number> = {
      1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4,
      7: 3, 8: 2, 9: 1,
      10: 0, 11: 0, 12: 0,
    };
    return table[month] ?? 0;
  };

  const prevStep = getPrevDomainStep(currentMonth);
  const nextStep = getNextDomainStep(currentMonth);

  const handlePrevDomain = useCallback(() => {
    if (!cal || prevStep === 0) return;
    setCurrentMonth(prev => prev - prevStep);
    cal.previous(prevStep);
  }, [cal, prevStep, setCurrentMonth]);

  const handleNextDomain = useCallback(() => {
    if (!cal || nextStep === 0) return;
    setCurrentMonth(prev => prev + nextStep);
    cal.next(nextStep);
  }, [cal, nextStep, setCurrentMonth]);

  const handleYearJump = useCallback((targetYear: number) => {
    if (!cal) return;
    cal.jumpTo(`${targetYear}-01-30`, true);
    setYear(targetYear);
    setCurrentMonth(1);
  }, [cal, setYear, setCurrentMonth]);

  return {
    prevStep,
    nextStep,
    handlePrevDomain,
    handleNextDomain,
    handleYearJump,
  };
};
