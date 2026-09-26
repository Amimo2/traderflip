import PositionsPanel from '@/components/trading/PositionsPanel';
import Chart from '@/components/trading/Chart';
import TradePanel from '@/components/trading/TradePanel';

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-gray-200 overflow-hidden">
      <div className="w-[280px] border-r border-gray-800 flex flex-col">
        <PositionsPanel />
      </div>
      <div className="flex-1 flex flex-col relative">
        <Chart />
      </div>
      <div className="w-[340px] border-l border-gray-800 flex flex-col">
        <TradePanel />
      </div>
    </div>
  );
}