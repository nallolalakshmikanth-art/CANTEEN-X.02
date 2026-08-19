import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { UserRole } from '../../types';
import { UtensilsCrossed, Shield, ChefHat, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, allUsers } = useCanteen();
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('ramesh.k@campus.edu');
  const [password, setPassword] = useState('canteen123');
  const [error, setError] = useState('');

  const adminUsers = allUsers.filter(u => u.role === 'admin');
  const staffUsers = allUsers.filter(u => u.role === 'staff');

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin.canteen@campus.edu');
    } else {
      setEmail('ramesh.k@campus.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole);
    if (!matched) {
      // Fallback: create or allow login with selected role
      login(selectedRole);
      return;
    }
    login(selectedRole, matched);
  };

  const handleQuickLogin = (role: UserRole, userEmail: string) => {
    const user = allUsers.find(u => u.email === userEmail && u.role === role);
    login(role, user);
  };

  return (
    <div className="min-h-screen bg-[#0D0E15] flex flex-col justify-center items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#161726] border border-[#26283D] rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">CAMPUS CANTEEN<span className="text-cyan-400">X</span></h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Staff & Admin Operations Portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0D0E15] border border-[#26283D] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleTabChange('staff')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'staff'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Kitchen Staff
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin Portal
          </button>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Official Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Security PIN / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Enter as {selectedRole === 'admin' ? 'Administrator' : 'Kitchen Staff'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Presets */}
        <div className="mt-8 pt-6 border-t border-[#26283D]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Test Accounts</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('staff', 'ramesh.k@campus.edu')}
              className="w-full p-2.5 bg-[#0D0E15] hover:bg-[#1A1B2D] border border-[#26283D] hover:border-blue-500/40 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  👨‍🍳
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Chef Ramesh (Staff)</p>
                  <p className="text-[10px] text-gray-400">Counter 1 • Snacks & Rolls</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-400">Quick Login ➔</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin', 'admin.canteen@campus.edu')}
              className="w-full p-2.5 bg-[#0D0E15] hover:bg-[#1A1B2D] border border-[#26283D] hover:border-indigo-500/40 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  🛡️
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Dr. Alok Verma (Admin)</p>
                  <p className="text-[10px] text-gray-400">Full Access • Revenue & Menu CRUD</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-indigo-400">Quick Login ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
