```tsx
'use client';

import { useEffect, useState } from 'react';
import DigitCircles from '../components/DigitCircles';
import TradingChart from '../components/TradingChart';

interface Tick {
  time: number;
  value: number;
}

export default function Dashboard() {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [lastDigit, setLastDigit] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    /*
     * Deriv App ID
     *
     * Replace this with your intended App ID.
     */
    const appId = '1089';

    const ws = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${appId}`
    );

    /*
     * WebSocket connected
     */
    ws.onopen = () => {
      console.log('Deriv WebSocket Connected');

      setIsConnected(true);

      /*
       * Subscribe to Volatility 100 (1s)
       */
      ws.send(
        JSON.stringify({
          ticks: '1HZ100V',
          subscribe: 1,
        })
      );
    };

    /*
     * Receive messages
     */
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        /*
         * Deriv API error
         */
        if (data.error) {
          console.error(
            'Deriv API Error:',
            data.error.message
          );

          return;
        }

        /*
         * Tick received
         */
        if (data.tick) {
          const quote = Number(data.tick.quote);
          const time = Number(data.tick.epoch);

          if (!Number.isFinite(quote)) {
            return;
          }

          if (!Number.isFinite(time)) {
            return;
          }

          /*
           * Add tick to chart.
           *
           * Keep only the latest 100 ticks.
           */
          setTicks((previousTicks) => {
            const newTick: Tick = {
              time,
              value: quote,
            };

            return [
              ...previousTicks,
              newTick,
            ].slice(-100);
          });

          /*
           * Extract the final digit from the
           * quote representation.
           */
          const quoteString = String(data.tick.quote);

          const decimalPart =
            quoteString.split('.')[1] ?? '';

          let digit: number;

          if (decimalPart.length > 0) {
            digit = Number(
              decimalPart[decimalPart.length - 1]
            );
          } else {
            digit = Number(
              quoteString[quoteString.length - 1]
            );
          }

          /*
           * Validate digit.
           */
          if (
            Number.isInteger(digit) &&
            digit >= 0 &&
            digit <= 9
          ) {
            setLastDigit(digit);
          }
        }
      } catch (error) {
        console.error(
          'Failed to process Deriv WebSocket message:',
          error
        );
      }
    };

    /*
     * WebSocket error
     */
    ws.onerror = (error) => {
      console.error(
        'Deriv WebSocket Error:',
        error
      );

      setIsConnected(false);
    };

    /*
     * WebSocket closed
     */
    ws.onclose = () => {
      console.log(
        'Deriv WebSocket Disconnected'
      );

      setIsConnected(false);
    };

    /*
     * Cleanup
     */
    return () => {
      /*
       * Only close the existing connection.
       *
       * DO NOT create another WebSocket here.
       */
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  return (
    <main className="p-4 bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">
              TraderFlip
            </h1>

            <p className="text-sm text-gray-400">
              Volatility 100 (1s) Index
            </p>
          </div>

          <span
            className={`
              text-sm px-3 py-1 rounded-full
              ${
                isConnected
                  ? 'bg-green-600'
                  : 'bg-red-600'
              }
            `}
          >
            {isConnected
              ? 'Live'
              : 'Disconnected'}
          </span>
        </div>

        {/* Trading Chart */}
        <div className="mb-4">
          <TradingChart ticks={ticks} />
        </div>

        {/* Last Digit */}
        <div className="mt-8">
          <h2 className="text-center text-gray-400 mb-2">
            Last Digit
          </h2>

          <DigitCircles
            activeDigit={lastDigit}
          />

          {lastDigit !== null && (
            <div className="text-center mt-4">
              <span className="text-gray-400">
                Latest digit:
              </span>

              <span className="ml-2 text-2xl font-bold">
                {lastDigit}
              </span>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
```
