declare module 'cal-heatmap/plugins/Tooltip' {
  export interface TooltipOptions {
    text: (date: Date, value: number) => string;
  }

  export default function Tooltip(options: TooltipOptions): {
    setup?: () => void;
    destroy?: () => void;
  };
}

declare module 'cal-heatmap/plugins/LegendLite' {
  export interface LegendOptions {
    enabled?: boolean;
    itemSelector: string | null;
    width: number;
    height: number;
    gutter: number;
    radius: number;
    includeBlank: boolean;
  }

  export default function LegendLite(options: LegendOptions): {
    setup?: () => void;
    destroy?: () => void;
  };
}

declare module 'cal-heatmap/plugins/CalendarLabel' {
  export type TextAlign = 'start' | 'middle' | 'end';

  export interface CalendarLabelOptions {
    enabled?: boolean;
    text: () => string[];
    key?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    padding: [number, number, number, number];
    radius?: number;
    width?: number;
    height?: number;
    gutter?: number;
    textAlign?: TextAlign;
  }

  export default function CalendarLabel(options: CalendarLabelOptions): {
    setup?: () => void;
    destroy?: () => void;
  };
}
