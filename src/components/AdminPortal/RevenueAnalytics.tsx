import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { PaymentMethod, Transaction } from '../../types';
import { 
  TrendingUp, 
  IndianRupee, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Calendar, 
  Search, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';
import { TopupModal } from '../Common/TopupModal';

export const RevenueAnalytics: React.FC = () => {
  const { transactions, orders, menuItems, refundTransaction } = useCanteen();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [refundTxId, setRefundTxId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Calculations
  const successfulTx = transactions.filter(t => t.status === 'success');
  
  // Total Sales from orders
  const totalSales = successfulTx
    .filter(t => t.type === 'order_payment')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total Card Top-ups
  const totalTopups = successfulTx
    .filter(t => t.type === 'card_topup')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total refunds
  const totalRefunds = successfulTx
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Orders count
  const paidOrdersCount = orders.filter(o => o.status !== 'cancelled').length;
  const avgOrderValue = paidOrdersCount > 0 ? Math.round(totalSales / paidOrdersCount) : 0;

  // Payment methods breakdown
  const methodStats = {
    campus_card: successfulTx.filter(t => t.method === 'campus_card' && t.type === 'order_payment').reduce((acc, t) => acc + t.amount, 0),
    upi: successfulTx.filter(t => t.method === 'upi' && t.type === 'order_payment').reduce((acc, t) => acc + t.amount, 0),
    cash: successfulTx.filter(t => t.method === 'cash' && t.type === 'order_payment').reduce((acc, t) => acc + t.amount, 0),
    net_banking: successfulTx.filter(t => t.method === 'net_banking' && t.type === 'order_payment').reduce((acc, t) => acc + t.amount, 0)
  };

  const totalMethodSales = (methodStats.campus_card + methodStats.upi + methodStats.cash + methodStats.net_banking) || 1;

  // Filtered transactions
  const filteredTx = transactions.filter(t => {
    const matchesMethod = selectedMethod === 'All' || t.method === selectedMethod;
    const matchesType = selectedType === 'All' || t.type === selectedType;
    const matchesSearch = t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Student Name', 'Student ID', 'Type', 'Amount (INR)', 'Method', 'Status', 'Timestamp', 'Reference'];
    const rows = transactions.map(t => [
      t.id,
      t.studentName,
      t.studentId,
      t.type,
      t.amount,
      t.method,
      t.status,
      new Date(t.timestamp).toISOString(),
      t.referenceId
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CanteenX_Revenue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmRefund = () => {
    if (!refundTxId) return;
    refundTransaction(refundTxId, refundReason || 'Customer requested / Kitchen cancellation');
    setRefundTxId(null);
    setRefundReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Live Payment & Financial Analytics</h3>
          <p className="text-xs text-gray-400">Audited revenue streams, RFID meal balances, and real-time transaction ledger</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="open-topup-station-btn"
            onClick={() => setIsTopupModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Card Top-up Station</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#161726] hover:bg-[#1A1B2D] border border-[#26283D] text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Order Revenue */}
        <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono my-1">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        {/* Total Orders Served */}
        <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Orders Processed</span>
            <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono my-1">
            {paidOrdersCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            98.5% on-time kitchen fulfillment
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono my-1">
            ₹{avgOrderValue}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Avg 2.4 items per student basket
          </div>
        </div>

        {/* Total Card Topups */}
        <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Card Recharge Vol.</span>
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono my-1">
            ₹{totalTopups.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Active digital balance on campus RFID
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Payment Method Distribution & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Methods Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-[#161726] border border-[#26283D] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26283D]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Payment Method Share</h4>
            <span className="text-xs text-gray-400">Live Breakdown</span>
          </div>

          <div className="space-y-4">
            {/* Campus RFID Card */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2 font-bold text-blue-400">
                  <CreditCard className="w-3.5 h-3.5" /> Campus RFID Card
                </span>
                <span className="font-mono text-white font-bold">
                  ₹{methodStats.campus_card} ({Math.round((methodStats.campus_card / totalMethodSales) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#0D0E15] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((methodStats.campus_card / totalMethodSales) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* UPI QR Scan */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2 font-bold text-cyan-400">
                  <QrCode className="w-3.5 h-3.5" /> UPI / Dynamic QR Scan
                </span>
                <span className="font-mono text-white font-bold">
                  ₹{methodStats.upi} ({Math.round((methodStats.upi / totalMethodSales) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#0D0E15] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((methodStats.upi / totalMethodSales) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cash at Counter */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2 font-bold text-emerald-400">
                  <Banknote className="w-3.5 h-3.5" /> Cash Register Deposit
                </span>
                <span className="font-mono text-white font-bold">
                  ₹{methodStats.cash} ({Math.round((methodStats.cash / totalMethodSales) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#0D0E15] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((methodStats.cash / totalMethodSales) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0D0E15] border border-[#26283D] rounded-2xl flex items-center justify-between text-xs text-gray-400">
            <span>Fastest clearing mode:</span>
            <span className="text-cyan-400 font-bold">Campus RFID Tap (&lt;0.8s)</span>
          </div>
        </div>

        {/* Peak Rush Hour Heat Visualizer (6 cols) */}
        <div className="lg:col-span-6 bg-[#161726] border border-[#26283D] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26283D]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Rush Hour Volume</h4>
            <span className="text-xs text-amber-400 font-semibold">1:00 PM - 2:30 PM Peak</span>
          </div>

          {/* Simple hourly bars */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {[
              { slot: '08-10 AM', count: 32, label: 'Breakfast', height: '40%' },
              { slot: '10-12 PM', count: 48, label: 'Snacks', height: '55%' },
              { slot: '12-02 PM', count: 95, label: 'Lunch Rush', height: '100%', peak: true },
              { slot: '02-04 PM', count: 38, label: 'Afternoon', height: '45%' },
              { slot: '04-07 PM', count: 76, label: 'Evening Tea', height: '80%' },
              { slot: '07-10 PM', count: 62, label: 'Dinner', height: '68%' },
            ].map((slot, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-full h-24 bg-[#0D0E15] rounded-xl flex items-end p-1 border border-[#26283D]">
                  <div 
                    className={`w-full rounded-lg transition-all duration-500 ${
                      slot.peak ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-cyan-500/30' : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={{ height: slot.height }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-white block">{slot.slot.split(' ')[0]}</span>
                  <span className="text-[9px] text-gray-500 block truncate">{slot.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0D0E15] border border-[#26283D] rounded-2xl flex items-center justify-between text-xs text-gray-400">
            <span>Average Ticket Preparation:</span>
            <span className="text-emerald-400 font-bold font-mono">5.8 mins / order</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-[#161726] border border-[#26283D] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#26283D]">
          <div>
            <h3 className="text-base font-bold text-white">Live Transaction Ledger</h3>
            <p className="text-xs text-gray-400">Complete audit trail of meal checkouts, wallet top-ups, and refunds</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search Student or Ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="campus_card">Campus Card</option>
              <option value="upi">UPI QR</option>
              <option value="cash">Cash</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="order_payment">Meal Order</option>
              <option value="card_topup">Card Top-up</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#26283D] text-gray-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Tx ID / Ref</th>
                <th className="pb-3">Student</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Time</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26283D]">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#1A1B2D]/40 transition-colors">
                  <td className="py-3 pl-2 font-mono">
                    <span className="font-semibold text-white block">{tx.referenceId}</span>
                    <span className="text-[10px] text-gray-500">{tx.id}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-gray-200 block">{tx.studentName}</span>
                    <span className="text-[10px] text-gray-400">{tx.studentId}</span>
                  </td>
                  <td className="py-3">
                    {tx.type === 'order_payment' ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                        Meal Order
                      </span>
                    ) : tx.type === 'card_topup' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Card Top-up
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                        Refunded
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="uppercase text-[11px] font-semibold text-cyan-300">
                      {tx.method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-right font-mono font-bold">
                    <span className={tx.type === 'refund' ? 'text-red-400' : tx.type === 'card_topup' ? 'text-emerald-400' : 'text-white'}>
                      {tx.type === 'refund' ? '-' : '+'}₹{Math.abs(tx.amount)}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    {tx.type === 'order_payment' && tx.status === 'success' && (
                      <button
                        onClick={() => {
                          setRefundTxId(tx.id);
                          setRefundReason('Order cancelled by student');
                        }}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Topup Modal */}
      <TopupModal isOpen={isTopupModalOpen} onClose={() => setIsTopupModalOpen(false)} />

      {/* Refund Confirm Modal */}
      {refundTxId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#161726] border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-white">Process Refund?</h4>
              <p className="text-xs text-gray-400 mt-1">
                The amount will be credited back to the student's campus card / UPI source.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Reason for Refund</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Dish unavailable, accidental double order"
                className="w-full px-3 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setRefundTxId(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
