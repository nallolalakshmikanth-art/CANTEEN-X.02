import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { Order, OrderStatus, DietaryType, CounterStation } from '../../types';
import { COUNTERS } from '../../data/mockData';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Banknote,
  ChefHat,
  XCircle
} from 'lucide-react';
import { KOTModal } from '../Common/KOTModal';

export const LiveKitchenTerminal: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    advanceOrder, 
    cancelOrder,
    selectedCounterFilter, 
    setSelectedCounterFilter 
  } = useCanteen();

  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeKOTOrder, setActiveKOTOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter === 'active' && (order.status === 'completed' || order.status === 'cancelled')) return false;
    if (statusFilter === 'received' && order.status !== 'received') return false;
    if (statusFilter === 'preparing' && order.status !== 'preparing') return false;
    if (statusFilter === 'ready' && order.status !== 'ready') return false;
    if (statusFilter === 'completed' && order.status !== 'completed') return false;

    // Counter filter
    if (selectedCounterFilter !== 'All' && order.counter !== selectedCounterFilter) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchToken = order.tokenNumber.toString().includes(q);
      const matchName = order.studentName.toLowerCase().includes(q);
      const matchId = order.studentId.toLowerCase().includes(q);
      const matchItem = order.items.some(i => i.name.toLowerCase().includes(q));
      if (!matchToken && !matchName && !matchId && !matchItem) return false;
    }

    return true;
  });

  // Calculate counts
  const countReceived = orders.filter(o => o.status === 'received').length;
  const countPreparing = orders.filter(o => o.status === 'preparing').length;
  const countReady = orders.filter(o => o.status === 'ready').length;
  const countCompleted = orders.filter(o => o.status === 'completed').length;
  const countActive = countReceived + countPreparing + countReady;

  const getDietaryIcon = (type: DietaryType) => {
    if (type === 'veg') {
      return <span className="w-3 h-3 rounded-full border-2 border-emerald-500 flex items-center justify-center p-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span></span>;
    }
    if (type === 'non-veg') {
      return <span className="w-3 h-3 rounded-full border-2 border-red-500 flex items-center justify-center p-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span>;
    }
    if (type === 'vegan') {
      return <span className="w-3 h-3 rounded-full border-2 border-teal-400 flex items-center justify-center p-0.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span></span>;
    }
    return <span className="w-3 h-3 rounded-full border-2 border-amber-400 flex items-center justify-center p-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span></span>;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Received
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-3 h-3 text-amber-400 animate-bounce" /> Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Ready for Pickup
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <CheckCircle2 className="w-3 h-3 text-gray-400" /> Handed Over
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 text-red-400" /> Cancelled
          </span>
        );
    }
  };

  const getElapsedMinutes = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Control Strip & Counters */}
      <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
              }`}
            >
              <span>🔥 Active Orders</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px]">{countActive}</span>
            </button>

            <button
              onClick={() => setStatusFilter('received')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === 'received'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
              }`}
            >
              <span>New (Received)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px]">{countReceived}</span>
            </button>

            <button
              onClick={() => setStatusFilter('preparing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === 'preparing'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-extrabold'
                  : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
              }`}
            >
              <span>In Kitchen (Prep)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">{countPreparing}</span>
            </button>

            <button
              onClick={() => setStatusFilter('ready')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === 'ready'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
              }`}
            >
              <span>Ready for Pickup</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{countReady}</span>
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
              }`}
            >
              <span>Completed</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px]">{countCompleted}</span>
            </button>
          </div>

          {/* Counter Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedCounterFilter}
              onChange={(e) => setSelectedCounterFilter(e.target.value)}
              className="px-3 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Counter Stations</option>
              {COUNTERS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Token Number (#108), Student Name, Student ID (CS2023), or Dish Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* Orders Grid / Kitchen Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#161726] border border-[#26283D] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0D0E15] border border-[#26283D] flex items-center justify-center text-gray-500 mb-3">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mt-1">
            There are no orders matching your current filter. You can click "+ Simulate Order" in the top bar to generate student test orders!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isUrgent = order.status !== 'completed' && order.status !== 'cancelled' && (Date.now() - new Date(order.createdAt).getTime() > 10 * 60000);

            return (
              <div
                key={order.id}
                className={`bg-[#161726] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-lg ${
                  order.status === 'ready'
                    ? 'border-emerald-500/50 shadow-emerald-950/20'
                    : order.status === 'preparing'
                    ? 'border-amber-500/40 shadow-amber-950/20'
                    : isUrgent
                    ? 'border-red-500/60 animate-pulse'
                    : 'border-[#26283D] hover:border-gray-600'
                }`}
              >
                {/* Card Header: Token & Status */}
                <div className="p-4 bg-[#1A1B2D] border-b border-[#26283D] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/40 rounded-xl text-center">
                      <span className="text-[10px] text-blue-300 font-bold block uppercase">TOKEN</span>
                      <span className="text-2xl font-black text-blue-400 font-mono leading-none">#{order.tokenNumber}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{order.studentName}</h4>
                      <p className="text-[11px] text-gray-400">{order.studentId} • {order.hostelBlock.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 mt-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span className={isUrgent ? 'text-red-400 font-bold' : ''}>{elapsed}</span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#26283D]">
                    <span>Items to Prepare</span>
                    <span className="text-[11px] text-cyan-400 font-normal">{order.counter.split(' - ')[0]}</span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between text-xs bg-[#0D0E15] p-2.5 rounded-xl border border-[#26283D]">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5">{getDietaryIcon(item.dietary)}</span>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white">
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px]">
                                {item.quantity}x
                              </span>
                              <span>{item.name}</span>
                            </div>
                            {item.spiceLevel && (
                              <span className="text-[10px] text-amber-400 font-medium block mt-0.5">
                                Spice: {item.spiceLevel}
                              </span>
                            )}
                            {item.notes && (
                              <span className="text-[10px] text-gray-400 italic block mt-0.5">
                                Note: {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-gray-300">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Special Kitchen Notes */}
                  {order.notes && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  {/* Payment & Prepared By */}
                  <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                      {order.paymentMethod === 'campus_card' && <CreditCard className="w-3.5 h-3.5" />}
                      {order.paymentMethod === 'upi' && <QrCode className="w-3.5 h-3.5" />}
                      {order.paymentMethod === 'cash' && <Banknote className="w-3.5 h-3.5" />}
                      <span className="uppercase text-[11px]">{order.paymentMethod.replace('_', ' ')} (PAID)</span>
                    </div>
                    <span className="text-sm font-bold text-white">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Card Footer: Kitchen Actions */}
                <div className="p-3.5 bg-[#1A1B2D] border-t border-[#26283D] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveKOTOrder(order)}
                    title="Print / View Kitchen Slip"
                    className="p-2 text-gray-400 hover:text-white bg-[#0D0E15] border border-[#26283D] hover:border-gray-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {order.status === 'received' && (
                    <button
                      onClick={() => advanceOrder(order.id)}
                      className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Start Preparing ➔</span>
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => advanceOrder(order.id)}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mark Ready for Pickup ➔</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => advanceOrder(order.id)}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Hand Over & Complete ✔</span>
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <span className="text-xs font-semibold text-gray-500 py-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                      Collected by student
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable KOT Modal */}
      <KOTModal order={activeKOTOrder} onClose={() => setActiveKOTOrder(null)} />
    </div>
  );
};
