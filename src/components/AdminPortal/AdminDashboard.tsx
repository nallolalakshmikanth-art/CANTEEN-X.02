import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { MenuManagement } from './MenuManagement';
import { RevenueAnalytics } from './RevenueAnalytics';
import { StaffManagement } from './StaffManagement';
import { 
  UtensilsCrossed, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, menuItems, transactions, orders, allUsers } = useCanteen();
  const [activeTab, setActiveTab] = useState<'menu' | 'analytics' | 'staff'>('menu');

  return (
    <div className="space-y-6">
      {/* Admin Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26283D]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">CANTEEN ADMIN CONTROL CENTER</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
              FULL PRIVILEGES
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Logged in as <strong className="text-gray-200">{currentUser?.name}</strong> • Cafeteria Master Administration
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-[#161726] border border-[#26283D] rounded-2xl self-start sm:self-auto">
          <button
            id="admin-tab-menu-btn"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-cyan-400" />
            <span>Menu Catalog (CRUD)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {menuItems.length}
            </span>
          </button>

          <button
            id="admin-tab-analytics-btn"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Revenue & Ledger</span>
          </button>

          <button
            id="admin-tab-staff-btn"
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Staff & Stations</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              {allUsers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'menu' && <MenuManagement />}
      {activeTab === 'analytics' && <RevenueAnalytics />}
      {activeTab === 'staff' && <StaffManagement />}
    </div>
  );
};
