import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  UtensilsCrossed, 
  ChefHat, 
  Shield, 
  Volume2, 
  VolumeX, 
  Tv, 
  Eye, 
  LogOut, 
  Sparkles, 
  PlusCircle, 
  Bell, 
  ChevronDown,
  Play,
  Pause
} from 'lucide-react';

interface NavbarProps {
  onOpenTV: () => void;
  onOpenMenuPreview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTV, onOpenMenuPreview }) => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    logout, 
    soundEnabled, 
    toggleSound, 
    currentServingToken, 
    callNextToken, 
    simulateNewOrder,
    autoSimulateOrders,
    toggleAutoSimulate
  } = useCanteen();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-[#161726] border-b border-[#26283D] sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Brand + Role Switcher */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-600/20 text-white font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight">CANTEEN<span className="text-cyan-400">X</span></span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Campus Central Cafeteria</p>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="p-1 bg-[#0D0E15] border border-[#26283D] rounded-xl flex items-center">
            <button
              id="role-switch-staff-btn"
              onClick={() => switchRole('staff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'staff'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Staff Portal</span>
            </button>
            <button
              id="role-switch-admin-btn"
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Right: Quick actions & User profile */}
        <div className="flex items-center flex-wrap justify-between md:justify-end gap-2 sm:gap-3">
          {/* Token Quick Pill with Call Next */}
          <div className="hidden sm:flex items-center bg-[#0D0E15] border border-[#26283D] rounded-xl pl-3 pr-1 py-1">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Serving:</span>
              <span className="text-sm font-extrabold text-cyan-400 font-mono">#{currentServingToken}</span>
            </div>
            <button
              onClick={callNextToken}
              title="Increment and announce next token"
              className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Next +1
            </button>
          </div>

          {/* Simulate Live Order */}
          <div className="flex items-center gap-1">
            <button
              onClick={simulateNewOrder}
              title="Simulate a new student order"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">+ Simulate</span> Order
            </button>

            <button
              onClick={toggleAutoSimulate}
              title={autoSimulateOrders ? 'Pause auto orders generation' : 'Start generating mock student orders every 20s'}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                autoSimulateOrders 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                  : 'bg-[#0D0E15] border-[#26283D] text-gray-400 hover:text-gray-200'
              }`}
            >
              {autoSimulateOrders ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Fullscreen TV Button */}
          <button
            onClick={onOpenTV}
            title="Open Fullscreen TV Waiting Screen"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D0E15] hover:bg-[#1A1B2D] text-gray-300 hover:text-white border border-[#26283D] rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">TV Screen</span>
          </button>

          {/* Kiosk Preview Button */}
          <button
            onClick={onOpenMenuPreview}
            title="Student Kiosk Live Preview"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D0E15] hover:bg-[#1A1B2D] text-gray-300 hover:text-white border border-[#26283D] rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Kiosk View</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Sound is Enabled' : 'Sound is Muted'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'bg-[#0D0E15] border-[#26283D] text-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* User Profile / Logout */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="flex items-center gap-2 p-1.5 pr-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl hover:border-gray-600 transition-colors cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-white leading-tight">{currentUser?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">{currentRole}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#161726] border border-[#26283D] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 pb-3 border-b border-[#26283D]">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'User'}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{currentUser?.name}</h4>
                    <p className="text-[11px] text-gray-400">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold uppercase">
                      {currentUser?.role === 'admin' ? 'Campus Admin' : 'Kitchen Operator'}
                    </span>
                  </div>
                </div>

                <div className="py-2 text-xs text-gray-400 space-y-1">
                  {currentUser?.counterAssignment && (
                    <p><span className="text-gray-500">Station:</span> <span className="text-gray-200">{currentUser.counterAssignment}</span></p>
                  )}
                  {currentUser?.shift && (
                    <p><span className="text-gray-500">Shift:</span> <span className="text-gray-200">{currentUser.shift}</span></p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#26283D]">
                  <button
                    id="user-logout-btn"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
