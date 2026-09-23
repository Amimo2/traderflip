```tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
} from 'lightweight-charts';

interface Tick {
  time: number;
  value: number;
}

interface TradingChartProps {
  ticks: Tick[];
}

export default function TradingChart({
  ticks,
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  /*
   * Create chart
   */
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 400,

      layout: {
        background: {
          type: ColorType.Solid,
          color: '#0f172a',
        },
        textColor: '#d1d5db',
      },

      grid: {
        vertLines: {
          color: '#1e293b',
        },
        horzLines: {
          color: '#1e293b',
        },
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },

      crosshair: {
        mode: 1,
      },
    });

    const lineSeries = chart.addLineSeries({
      color: '#ffffff',
      lineWidth: 2,

      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: '#ffffff',
      crosshairMarkerBackgroundColor: '#3b82f6',
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    /*
     * Responsive chart
     */
    const resizeObserver = new ResizeObserver(() => {
      if (!chartContainerRef.current) return;

      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    });

    resizeObserver.observe(container);

    /*
     * Cleanup
     */
    return () => {
      resizeObserver.disconnect();

      chart.remove();

      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  /*
   * Update chart whenever ticks change
   */
  useEffect(() => {
    if (!seriesRef.current || ticks.length === 0) {
      return;
    }

    const chartData: LineData<Time>[] = ticks.map((tick) => ({
      time: tick.time as Time,
      value: tick.value,
    }));

    seriesRef.current.setData(chartData);

    /*
     * Keep chart focused on latest price
     */
    chartRef.current?.timeScale().scrollToRealTime();
  }, [ticks]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-[400px]"
    />
  );
}
```
