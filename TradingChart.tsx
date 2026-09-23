// components/TradingChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradingChartProps {
  ticks: { time: number; value: number }[];
}

export default function TradingChart({ ticks }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#0f172a' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: { timeVisible: true, secondsVisible: true },
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

    // Handle window resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && ticks.length > 0) {
      const latestTick = ticks[ticks.length - 1];
      
      // FIX: Convert epoch to a standard time format that lightweight-charts expects
      // Depending on your version of lightweight-charts, this might just need the number.
      // If it complains, uncomment the Date line below.
      try {
        seriesRef.current.update({
          time: latestTick.time as any, // Or: (latestTick.time / 1000) as any
          value: latestTick.value,
        });
      } catch (e) {
        console.warn("Chart update skipped due to time formatting", e);
      }
    }
  }, [ticks]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}