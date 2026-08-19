import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { LiveKitchenTerminal } from './LiveKitchenTerminal';
import { TokenDisplayManager } from './TokenDisplayManager';
import { InventoryQuickManager } from './InventoryQuickManager';
import { 
  Flame, 
  Tv, 
  Package, 
  ChefHat, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';

interface StaffDashboardProps {
  onOpenTV: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onOpenTV }) => {
  const { currentUser, orders } = useCanteen();
  const [activeTab, setActiveTab] = useState<'kitchen' | 'tokens' | 'inventory'>('kitchen');

  const activeOrdersCount = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Station Sub-Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26283D]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">KITCHEN OPS CONSOLE</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
              {currentUser?.counterAssignment || 'Counter Station'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Logged in as <strong className="text-gray-200">{currentUser?.name}</strong> • {currentUser?.shift}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-[#161726] border border-[#26283D] rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kitchen'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Live Kitchen Terminal</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>Token Calling & Display</span>
            {readyOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] font-extrabold">
                {readyOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span>Inventory Toggle</span>
          </button>
        </div>
      </div>

      {/* Render Selected Tab */}
      {activeTab === 'kitchen' && <LiveKitchenTerminal />}
      {activeTab === 'tokens' && <TokenDisplayManager onOpenTV={onOpenTV} />}
      {activeTab === 'inventory' && <InventoryQuickManager />}
    </div>
  );
};
