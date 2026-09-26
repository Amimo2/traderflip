'use client';
import { useState } from 'react';

export default function PositionsPanel() {
  const [activeTab, setActiveTab] = useState('Open');

  return (
    <div className="flex flex-col h-full bg-[#141414]">
      <div className="flex border-b border-gray-800 text-sm">
        {['Open (0)', 'Closed (0)', 'Transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`flex-1 py-3 text-center transition-colors \${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-500 hover:text-gray-300'
            }\`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center mb-4">
          <span className="text-xs">◎</span>
        </div>
        <p className="font-semibold text-white">No open positions</p>
        <p className="text-xs mt-1">Your active trades will appear here</p>
      </div>
    </div>
  );
}
