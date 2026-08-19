import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  BellRing, 
  ChevronRight, 
  ChevronLeft, 
  Hash, 
  Sparkles, 
  Tv, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Users,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { COUNTERS } from '../../data/mockData';

interface TokenDisplayManagerProps {
  onOpenTV: () => void;
}

export const TokenDisplayManager: React.FC<TokenDisplayManagerProps> = ({ onOpenTV }) => {
  const { 
    currentServingToken, 
    callNextToken, 
    setServingToken, 
    recallToken, 
    orders, 
    updateOrderStatus,
    soundEnabled, 
    toggleSound 
  } = useCanteen();

  const [customTokenInput, setCustomTokenInput] = useState('');

  const handleCustomJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customTokenInput, 10);
    if (!isNaN(val) && val > 0) {
      setServingToken(val);
      setCustomTokenInput('');
    }
  };

  const readyOrders = orders.filter(o => o.status === 'ready');
  const preparingOrders = orders.filter(o => o.status === 'preparing');

  return (
    <div className="space-y-6">
      {/* Top Banner Control: Giant Token Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Master Token Controller */}
        <div className="lg:col-span-7 bg-[#161726] border border-[#26283D] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Live Counter Calling Station</h3>
              </div>
              <button
                onClick={onOpenTV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4" />
                <span>Launch Waiting TV Mode</span>
              </button>
            </div>

            {/* Giant Display */}
            <div className="text-center my-6 py-6 bg-[#0D0E15] border border-[#26283D] rounded-2xl relative">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                CURRENT SERVING TOKEN
              </span>
              <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 font-mono tracking-tight drop-shadow-md">
                #{currentServingToken}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Displaying on all campus cafeteria monitors and student status feeds
              </p>
            </div>
          </div>

          {/* Controller Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                id="call-next-token-btn"
                onClick={callNextToken}
                className="col-span-2 sm:col-span-1 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Call Next Token</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                id="recall-current-token-btn"
                onClick={() => recallToken(currentServingToken)}
                className="py-3.5 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BellRing className="w-4 h-4 text-cyan-400" />
                <span>Recall #{currentServingToken}</span>
              </button>

              <button
                onClick={() => setServingToken(Math.max(1, currentServingToken - 1))}
                className="py-3.5 px-4 bg-[#0D0E15] hover:bg-[#1A1B2D] border border-[#26283D] text-gray-300 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Token</span>
              </button>
            </div>

            {/* Jump to Specific Token */}
            <form onSubmit={handleCustomJump} className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  min="1"
                  placeholder="Jump directly to Token Number (e.g. 110)..."
                  value={customTokenInput}
                  onChange={(e) => setCustomTokenInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
              >
                Set Token
              </button>
            </form>
          </div>
        </div>

        {/* Right 5 cols: Queue Summary & Counter Load */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-4">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>Ready for Pickup</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{readyOrders.length}</div>
              <span className="text-[10px] text-gray-500 mt-1 block">Awaiting student collection</span>
            </div>

            <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-4">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>In Preparation</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">{preparingOrders.length}</div>
              <span className="text-[10px] text-gray-500 mt-1 block">Cooking in kitchen bays</span>
            </div>
          </div>

          {/* Counter Stations Live Queue Status */}
          <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span>Counter Station Activity</span>
              <span className="text-[10px] text-cyan-400 font-normal">Live Load</span>
            </h4>

            <div className="space-y-2.5">
              {COUNTERS.map((counter, idx) => {
                const count = orders.filter(o => o.counter === counter && (o.status === 'received' || o.status === 'preparing' || o.status === 'ready')).length;
                return (
                  <div key={idx} className="p-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">{counter}</p>
                      <p className="text-[10px] text-gray-400">{count === 0 ? 'Optimal (No queue)' : `${count} Active Orders`}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      count > 3 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      count > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {count > 3 ? 'High Load' : count > 0 ? 'Active' : 'Clear'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ready for Pickup Token Grid */}
      <div className="bg-[#161726] border border-[#26283D] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#26283D]">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <h3 className="text-base font-bold text-white">Active Ready Tokens (Waiting for Student Handover)</h3>
              <p className="text-xs text-gray-400">Click to announce again or mark handed over</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold font-mono">
            {readyOrders.length} Ready Tokens
          </span>
        </div>

        {readyOrders.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No orders currently waiting in ready status. Advance in-prep orders from the Kitchen Terminal to populate this list.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0D0E15] border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-white font-mono">#{order.tokenNumber}</span>
                    <button
                      onClick={() => recallToken(order.tokenNumber)}
                      title="Speak / Call Token via PA"
                      className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    >
                      <BellRing className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs">
                    <p className="font-bold text-gray-200">{order.studentName}</p>
                    <p className="text-[11px] text-gray-400">{order.counter.split(' - ')[0]}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{order.items.length} items • ₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#26283D]">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hand Over Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
