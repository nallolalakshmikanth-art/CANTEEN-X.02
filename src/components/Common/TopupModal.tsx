import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { PaymentMethod, Transaction } from '../../types';
import { CreditCard, CheckCircle2, X, IndianRupee, QrCode, Banknote, Sparkles, Printer } from 'lucide-react';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
  const { processTopup } = useCanteen();
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState<number>(200);
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [notes, setNotes] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const handleQuickAmount = (val: number) => {
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentId || amount <= 0) return;

    const tx = processTopup(studentName, studentId, amount, method, notes);
    setCompletedTx(tx);
  };

  const handleReset = () => {
    setCompletedTx(null);
    setStudentName('');
    setStudentId('');
    setAmount(200);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#161726] border border-[#26283D] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26283D] bg-[#1A1B2D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Campus Card Top-up Station</h3>
              <p className="text-xs text-gray-400">Recharge student digital meal wallet & RFID</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completedTx ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Student ID / Roll No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS2023049"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 uppercase"
                />
              </div>
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Select Top-up Amount (₹)</label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      amount === val
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                        : 'bg-[#0D0E15] border-[#26283D] text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
              <div className="mt-3 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Custom Amount"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Payment Mode Received */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Payment Received Via</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    method === 'upi'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-[#0D0E15] border-[#26283D] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI / QR Scan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('cash')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    method === 'cash'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#0D0E15] border-[#26283D] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Cash Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('net_banking')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    method === 'net_banking'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-[#0D0E15] border-[#26283D] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Net Banking / POS</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Remarks / Counter Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Month start recharge, Parent online transfer receipt"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Confirm & Add ₹{amount}
              </button>
            </div>
          </form>
        ) : (
          /* Receipt View */
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in-50 duration-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Top-up Successful!</h4>
              <p className="text-sm text-gray-400 mt-1">
                Credited ₹{completedTx.amount} to {completedTx.studentName}'s Campus Card
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 bg-[#0D0E15] border border-[#26283D] rounded-xl text-left space-y-2 text-xs font-mono text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-semibold">{completedTx.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Student ID:</span>
                <span className="text-white font-semibold">{completedTx.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Mode:</span>
                <span className="text-cyan-400 uppercase font-semibold">{completedTx.method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-gray-300">{new Date(completedTx.timestamp).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-dashed border-[#26283D] flex justify-between text-sm font-sans font-bold">
                <span className="text-gray-200">Amount Added:</span>
                <span className="text-emerald-400">₹{completedTx.amount}.00</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-gray-200 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Receipt Slip
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
