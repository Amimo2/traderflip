// components/DigitCircles.tsx
import React from 'react';

interface DigitCirclesProps {
  activeDigit: number | null;
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
              ${isActive ? 'scale-125 shadow-lg shadow-white/50 ring-2 ring-white z-10' : 'opacity-70'}
            `}
          >
            {digit}
          </div>
        );
      })}
    </div>
  );
}