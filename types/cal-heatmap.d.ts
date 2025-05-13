declare module 'cal-heatmap' {
    interface HeatmapData {
      date: string;
      count: number;
    }
  
    interface PaintConfig {
      data: {
        source: HeatmapData[];
        type: 'json';
        x: 'date';
        y: 'count';
        groupY: 'max';
      };
      date: {
        start: Date;
      };
      range: number;
      scale: {
        color: {
          type: 'linear';
          range: string[];
          domain: number[];
        };
      };
      domain: {
        type: 'month';
        label: {
          text: string;
          textAlign: string;
          position: string;
        };
      };
      subDomain: {
        type: string;
        radius: number;
        width: number;
        height: number;
        gutter: number;
      };
      itemSelector: string;
    }
  
    interface Plugin {
      setup?: () => void;
      destroy?: () => void;
    }
  
    import { TooltipOptions } from 'cal-heatmap/plugins/Tooltip';
    import { LegendOptions } from 'cal-heatmap/plugins/LegendLite';
    import { CalendarLabelOptions } from 'cal-heatmap/plugins/CalendarLabel';
  
    export type PluginConstructor<T> = (options: T) => Plugin;

    export type TooltipPluginDefinition = [PluginConstructor<TooltipOptions>, TooltipOptions];
    export type LegendPluginDefinition = [PluginConstructor<LegendOptions>, LegendOptions];
    export type LabelPluginDefinition = [PluginConstructor<CalendarLabelOptions>, CalendarLabelOptions];
  
    export type PluginDefinition =
      | TooltipPluginDefinition
      | LegendPluginDefinition
      | LabelPluginDefinition;
  
    export class CalHeatmap {
      paint(config: PaintConfig, plugins: PluginDefinition[]): void;
      jumpTo(date: string, animate: boolean): void;
      previous(range: number): void;
      next(range: number): void;
    }
  
    export default CalHeatmap;
  }
  