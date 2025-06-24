import { useState } from 'react';

export const useHeatmapYearDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};
