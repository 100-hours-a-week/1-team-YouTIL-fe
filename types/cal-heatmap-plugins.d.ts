declare module 'cal-heatmap' {
  class CalHeatmap {
    paint: (config: any, plugins: any[]) => void;
    jumpTo: (date: string, animate: boolean) => void;
    previous: (range: number) => void;
    next: (range: number) => void;
  }

  export default CalHeatmap;
}

declare module 'cal-heatmap/plugins/Tooltip';
declare module 'cal-heatmap/plugins/LegendLite';
declare module 'cal-heatmap/plugins/CalendarLabel';
