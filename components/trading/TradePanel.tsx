'use client';
import { useState } from 'react';

export default function TradePanel() {
  const [tradeMode, setTradeMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');
  const [stake, setStake] = useState(10);

  return (
    <div className="p-4 flex flex-col gap-4 h-full bg-[#141414] overflow-y-auto">
      <div className="flex bg-gray-800 rounded-md p-1">
        {(['AUTO', 'MANUAL'] as const).map((mode) => (
          <button key={mode} onClick={() => setTradeMode(mode)}
            className={\`flex-1 py-2 text-sm rounded transition-colors \${tradeMode === mode ? 'bg-blue-600 text-white' : 'text-gray-400'}\`}>
            {mode}
          </button>
        ))}
      </div>
      <div className="flex gap-2 text-xs">
        <button className="bg-blue-600 px-3 py-1.5 rounded text-white">Even / Odd</button>
        <button className="bg-gray-800 px-3 py-1.5 rounded text-gray-400">Match / Differ</button>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">STAKE AMOUNT</label>
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-md">
          <button className="px-3 py-2 text-gray-400" onClick={() => setStake(s => Math.max(1, s - 1))}>−</button>
          <input type="number" value={stake} onChange={(e) => setStake(Number(e.target.value))}
            className="flex-1 bg-transparent text-center text-xl font-bold outline-none text-white" />
          <button className="px-3 py-2 text-gray-400" onClick={() => setStake(s => s + 1)}>+</button>
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 5, 10, 25, 50, 100].map(val => (
            <button key={val} onClick={() => setStake(val)}
              className={\`flex-1 text-xs py-1 rounded \${stake === val ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}\`}>
              {val}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="text-[10px] text-green-400 block">TARGET</span>
          <span className="text-sm font-bold text-white">200</span>
        </div>
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="text-[10px] text-red-400 block">STOP LOSS</span>
          <span className="text-sm font-bold text-white">999</span>
        </div>
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="text-[10px] text-yellow-400 block">MULTIPLIER</span>
          <span className="text-sm font-bold text-white">2</span>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md flex justify-between px-4 items-center">
          <span className="font-bold">Even</span>
          <span className="text-xs">19.52 USD (95.22%)</span>
        </button>
        <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-md flex justify-between px-4 items-center">
          <span className="font-bold">Odd</span>
          <span className="text-xs">19.52 USD (95.22%)</span>
        </button>
      </div>
    </div>
  );
}
