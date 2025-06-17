import { useState } from 'react';
import CalHeatmap from 'cal-heatmap';

export const useHeatmapYearDropdown = (
  setYear: (year: number) => void,
  setCurrentMonth: (month: number) => void,
  cal: CalHeatmap | null
) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleYearChange = (targetYear: number) => {
    cal?.jumpTo(`${targetYear}-01-30`, true);
    setYear(targetYear);
    setCurrentMonth(1);
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, handleYearChange };
};
