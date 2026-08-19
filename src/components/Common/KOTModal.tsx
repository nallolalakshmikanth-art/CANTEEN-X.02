import React from 'react';
import { Order } from '../../types';
import { Printer, X, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KOTModalProps {
  order: Order | null;
  onClose: () => void;
}

export const KOTModal: React.FC<KOTModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        id="kot-ticket-container"
        className="w-full max-w-md bg-[#161726] border border-[#26283D] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26283D] bg-[#1A1B2D]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <h3 className="text-base font-semibold text-white">Kitchen Order Ticket (KOT)</h3>
          </div>
          <button 
            id="close-kot-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="p-6 bg-[#0D0E15] text-gray-200 font-mono text-sm space-y-4">
          <div className="text-center border-b border-dashed border-[#26283D] pb-4">
            <h2 className="text-lg font-bold text-white tracking-wider">CAMPUS CANTEEN-X</h2>
            <p className="text-xs text-gray-400">Main Cafeteria • Central Block</p>
            <div className="mt-3 inline-block px-4 py-1.5 bg-blue-600/20 border border-blue-500/40 rounded-lg">
              <span className="text-xs text-blue-400 block font-sans font-medium">ORDER TOKEN</span>
              <span className="text-3xl font-extrabold text-blue-400 font-sans">#{order.tokenNumber}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-dashed border-[#26283D]">
            <div>
              <span className="text-gray-400 block">Student:</span>
              <span className="text-white font-semibold">{order.studentName}</span>
              <span className="text-gray-400 block text-[11px]">{order.studentId}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block">Station:</span>
              <span className="text-cyan-400 font-semibold">{order.counter.split(' - ')[0]}</span>
              <span className="text-gray-400 block text-[11px]">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-gray-400 block text-[11px]">Hostel: {order.hostelBlock}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 py-2 border-b border-dashed border-[#26283D]">
            <div className="flex justify-between text-xs text-gray-400 font-semibold uppercase">
              <span>Qty • Item</span>
              <span>Price</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-cyan-300 font-bold text-xs">
                      {item.quantity}x
                    </span>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  {item.spiceLevel && (
                    <span className="text-[11px] text-amber-400 ml-7 block">
                      Spice: {item.spiceLevel}
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-[11px] text-gray-400 italic ml-7 block">
                      Note: "{item.notes}"
                    </span>
                  )}
                </div>
                <span className="text-gray-300 font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Notes & Summary */}
          {order.notes && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Special Note: {order.notes}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-gray-400">Total Amount:</span>
            <span className="text-lg font-bold text-white">₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
            <span>Payment Method:</span>
            <span className="text-emerald-400 font-medium uppercase">{order.paymentMethod.replace('_', ' ')} (PAID)</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#26283D] bg-[#1A1B2D]">
          <button
            id="print-kot-ticket-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print KOT Slip
          </button>
          <button
            id="close-kot-action-btn"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
