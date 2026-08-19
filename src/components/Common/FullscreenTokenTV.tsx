import React, { useState, useEffect } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { Maximize2, Minimize2, Volume2, VolumeX, Sparkles, Clock, UtensilsCrossed, BellRing } from 'lucide-react';

interface FullscreenTokenTVProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenTokenTV: React.FC<FullscreenTokenTVProps> = ({ isOpen, onClose }) => {
  const { orders, currentServingToken, recallToken, soundEnabled, toggleSound } = useCanteen();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0E15] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Top TV Bar */}
      <header className="px-8 py-4 bg-[#161726] border-b border-[#26283D] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
              CAMPUS CANTEEN-X <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold uppercase tracking-wider border border-cyan-500/30">LIVE TOKEN DISPLAY</span>
            </h1>
            <p className="text-xs text-gray-400">Order Collection & Waiting Status Board</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300 font-mono text-lg bg-[#0F0F1A] px-4 py-1.5 rounded-xl border border-[#26283D]">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-[#26283D] text-gray-500'
            }`}
            title="Toggle Audio Announcements"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-sm font-medium rounded-xl transition-all cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            Exit TV Mode
          </button>
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 overflow-hidden">
        {/* Left Col: Currently Serving Big Highlight & Preparing (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Counter Call Banner */}
          <div className="bg-gradient-to-b from-[#1A1B2D] to-[#161726] border-2 border-blue-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-sm font-semibold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              CURRENTLY SERVING AT COUNTER
            </div>

            <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 font-mono tracking-tight my-2 drop-shadow-md">
              #{currentServingToken}
            </div>

            <button
              onClick={() => recallToken(currentServingToken)}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-sm font-semibold rounded-2xl transition-all cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-cyan-300 animate-bounce" />
              Re-Announce Token #{currentServingToken}
            </button>
          </div>

          {/* Under Prep Queue */}
          <div className="flex-1 bg-[#161726] border border-[#26283D] rounded-3xl p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#26283D]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">NOW PREPARING IN KITCHEN</h2>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold">
                {preparingOrders.length} In Queue
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {preparingOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center py-8">
                  <p className="text-base font-medium">All queued orders are currently ready!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {preparingOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-3.5 bg-[#0F0F1A] border border-[#26283D] rounded-2xl flex flex-col items-center justify-center text-center hover:border-amber-500/40 transition-all"
                    >
                      <span className="text-2xl font-black text-amber-400 font-mono">#{order.tokenNumber}</span>
                      <span className="text-xs text-gray-300 font-medium truncate w-full mt-1">{order.studentName.split(' ')[0]}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{order.counter.split(' - ')[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Ready for Pickup (7 cols) */}
        <div className="lg:col-span-7 bg-[#161726] border-2 border-emerald-500/30 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#26283D]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <h2 className="text-2xl font-black text-emerald-400 tracking-wide uppercase flex items-center gap-2">
                  READY FOR PICKUP
                </h2>
                <p className="text-xs text-gray-400">Please proceed to designated collection counter</p>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-sm font-bold">
              {readyOrders.length} Ready
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center py-16">
                <Sparkles className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-lg font-medium text-gray-400">No ready tokens awaiting pickup at this moment.</p>
                <p className="text-xs text-gray-500 mt-1">Kitchen staff are actively preparing your hot meals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-2 border-emerald-500/60 rounded-2xl flex flex-col items-center text-center shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all duration-200"
                  >
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">TOKEN</span>
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono my-1 tracking-tight">
                      #{order.tokenNumber}
                    </span>
                    <div className="w-full pt-2 mt-2 border-t border-white/10 text-left">
                      <p className="text-xs font-semibold text-gray-200 truncate">{order.studentName}</p>
                      <p className="text-[11px] text-cyan-300 font-medium truncate mt-0.5">{order.counter.split(' - ')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Marquee ticker */}
          <div className="mt-4 pt-3 border-t border-[#26283D] flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Keep student ID card or payment QR ready at counter.
            </span>
            <span className="hidden sm:inline text-gray-500">CanteenX Campus Kitchen Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
