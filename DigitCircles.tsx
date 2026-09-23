// components/DigitCircles.tsx
import React from 'react';

interface DigitCirclesProps {
  activeDigit: number | null; // The last digit from the WebSocket
}

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function DigitCircles({ activeDigit }: DigitCirclesProps) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {digits.map((digit) => {
        const isEven = digit % 2 === 0;
        const isActive = digit === activeDigit;

        return (
          <div
            key={digit}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300
              ${isEven ? 'bg-blue-600 border-2 border-blue-400' : 'bg-red-600 border-2 border-red-400'}
              ${isActive ? 'scale-125 shadow-lg shadow-white/50 ring-2 ring-white' : 'opacity-70'}
            `}
          >
            {digit}
          </div>
        );
      })}
    </div>
  );
}
// components/TradingChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradingChartProps {
  ticks: { time: number; value: number }[]; // Array of ticks from your WebSocket
}

export default function TradingChart({ ticks }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Create the Chart
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#0f172a' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    // 2. Create the Line Series (The Cursor Line)
    const lineSeries = chart.addLineSeries({
      color: '#ffffff',
      lineWidth: 2,
      crosshairMarkerVisible: true, // This is the dot at the end
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: '#ffffff',
      crosshairMarkerBackgroundColor: '#3b82f6',
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    return () => chart.remove();
  }, []);

  // 3. Update the chart when new ticks arrive
  useEffect(() => {
    if (seriesRef.current && ticks.length > 0) {
      // Update with the latest tick
      const latestTick = ticks[ticks.length - 1];
      seriesRef.current.update({
        time: latestTick.time as any, // Ensure time format matches lightweight-charts requirements
        value: latestTick.value,
      });
    }
  }, [ticks]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
// app/page.tsx (or your main dashboard file)
'use client';
import { useState, useEffect } from 'react';
import DigitCircles from '../components/DigitCircles';
import TradingChart from '../components/TradingChart';

export default function Dashboard() {
  const [ticks, setTicks] = useState<{ time: number; value: number }[]>([]);
  const [lastDigit, setLastDigit] = useState<number | null>(null);

  useEffect(() => {
    // Connect to Deriv WebSocket
    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=YOUR_APP_ID');

    ws.onopen = () => {
      ws.send(JSON.stringify({ ticks: '1HZ100V', subscribe: 1 })); // Volatility 100 (1s)
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tick) {
        const quote = data.tick.quote;
        const time = data.tick.epoch;
        
        // Add new tick to chart array
        setTicks((prev) => [...prev, { time, value: quote }]);
        
        // Extract last digit
        const digit = parseInt(quote.toString().slice(-1));
        setLastDigit(digit);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-white">
      <div className="mb-4">
        <h2 className="text-xl">Volatility 100 (1s) Index</h2>
        <TradingChart ticks={ticks} />
      </div>

      {/* This is the red/blue circles you requested */}
      <div className="mt-8">
        <h3 className="text-center text-gray-400 mb-2">Last Digit Prediction</h3>
        <DigitCircles activeDigit={lastDigit} />
      </div>
    </div>
  );
}