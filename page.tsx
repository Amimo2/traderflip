// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import DigitCircles from '../components/DigitCircles';
import TradingChart from '../components/TradingChart';

export default function Dashboard() {
  const [ticks, setTicks] = useState<{ time: number; value: number }[]>([]);
  const [lastDigit, setLastDigit] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // REPLACE 1089 WITH YOUR ACTUAL APP ID
    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket Connected");
      // Subscribe to Volatility 100 (1s)
      ws.send(JSON.stringify({ ticks: '1HZ100V', subscribe: 1 }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.error) {
        console.error("Deriv API Error:", data.error.message);
        return;
      }

      if (data.tick) {
        const quote = data.tick.quote; // e.g. 954.12
        const time = data.tick.epoch;  // Unix timestamp

        // Update ticks array (limit to last 100 ticks to prevent memory leaks)
        setTicks((prev) => {
          const newTicks = [...prev, { time, value: quote }];
          return newTicks.slice(-100); // Keep only last 100
        });

        // Extract last digit
        const digit = parseInt(quote.toString().slice(-1));
        setLastDigit(digit);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = (err) => console.error("WebSocket Error:", err);

    return () => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ forget_all: 'ticks' })); // Unsubscribe
        // Connect to Deriv WebSocket
const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=34t1lsJUPK1KnTtGGmkW8');
        ws.close();
      }
    };
  }, []);

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Volatility 100 (1s) Index</h2>
        <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      <div className="mb-4">
        <TradingChart ticks={ticks} />
      </div>

      <div className="mt-8">
        <h3 className="text-center text-gray-400 mb-2">Last Digit Prediction</h3>
        <DigitCircles activeDigit={lastDigit} />
      </div>
    </div>
  );
}