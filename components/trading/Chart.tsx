'use client';
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineSeries, LineData, Time } from 'lightweight-charts';

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#0e0e0e' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: { timeVisible: true, secondsVisible: true, borderColor: '#1f2937' },
      rightPriceScale: { borderColor: '#1f2937' },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#ffffff',
      lineWidth: 2,
    });

    const now = Math.floor(Date.now() / 1000) as Time;
    lineSeries.setData([
      { time: (now - 60) as Time, value: 9513 },
      { time: (now - 50) as Time, value: 9546 },
      { time: (now - 40) as Time, value: 9528 },
      { time: (now - 30) as Time, value: 9560 },
      { time: (now - 20) as Time, value: 9555 },
      { time: (now - 10) as Time, value: 9572 },
      { time: now, value: 9562 },
    ]);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10 bg-[#1e1e1e] p-3 rounded-md border border-gray-700">
        <div className="text-sm font-bold text-white">Volatility 10 (1s) Index</div>
        <div className="text-xs text-green-400 mt-1">9513.45 <span className="text-red-400">-13.45 (0.14%)</span></div>
      </div>
      <div ref={chartContainerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
        {[0,1,2,3,4,5,6,7,8,9].map((num) => (
          <div key={num} className="w-10 h-10 rounded-full bg-gray-800 flex flex-col items-center justify-center text-xs border border-gray-600">
            <span className="font-bold text-white">{num}</span>
            <span className="text-[8px] text-gray-400">10.4%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
