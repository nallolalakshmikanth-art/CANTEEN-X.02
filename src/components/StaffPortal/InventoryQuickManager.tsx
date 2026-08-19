import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { StockStatus } from '../../types';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Minus, 
  Sparkles,
  Eye,
  Filter
} from 'lucide-react';

export const InventoryQuickManager: React.FC = () => {
  const { menuItems, updateStockStatus } = useCanteen();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const categories = ['All', 'Breakfast', 'Quick Bites', 'Main Course', 'Beverages', 'Desserts', 'Combos'];

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || item.stockStatus === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.counter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const countInStock = menuItems.filter(i => i.stockStatus === 'in_stock').length;
  const countLowStock = menuItems.filter(i => i.stockStatus === 'low_stock').length;
  const countSoldOut = menuItems.filter(i => i.stockStatus === 'sold_out').length;

  const handleStockQtyChange = (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    let newStatus: StockStatus = 'in_stock';
    if (newQty === 0) {
      newStatus = 'sold_out';
    } else if (newQty <= 10) {
      newStatus = 'low_stock';
    }
    updateStockStatus(id, newStatus, newQty);
  };

  return (
    <div className="space-y-6">
      {/* Top summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter(statusFilter === 'in_stock' ? 'All' : 'in_stock')}
          className={`p-4 bg-[#161726] border rounded-2xl cursor-pointer transition-all ${
            statusFilter === 'in_stock' ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#26283D] hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold">In Stock Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{countInStock}</div>
          <span className="text-[10px] text-gray-500">Readily available for student orders</span>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'low_stock' ? 'All' : 'low_stock')}
          className={`p-4 bg-[#161726] border rounded-2xl cursor-pointer transition-all ${
            statusFilter === 'low_stock' ? 'border-amber-500 bg-amber-500/10' : 'border-[#26283D] hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{countLowStock}</div>
          <span className="text-[10px] text-gray-500">Fewer than 10 portions remaining</span>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'sold_out' ? 'All' : 'sold_out')}
          className={`p-4 bg-[#161726] border rounded-2xl cursor-pointer transition-all ${
            statusFilter === 'sold_out' ? 'border-red-500 bg-red-500/10' : 'border-[#26283D] hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold">Sold Out Dishes</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{countSoldOut}</div>
          <span className="text-[10px] text-gray-500">Disabled on student kiosk menu</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search dish or counter to adjust inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick status notice */}
        <p className="text-xs text-cyan-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          Changes to In Stock / Sold Out reflect immediately on the student ordering kiosk!
        </p>
      </div>

      {/* Inventory Item List / Table */}
      <div className="bg-[#161726] border border-[#26283D] rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-[#26283D]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1A1B2D]/50 transition-colors"
            >
              {/* Left Item Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-[#26283D] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <span className="text-xs font-extrabold text-cyan-400">₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="px-2 py-0.5 rounded-md bg-[#0D0E15] border border-[#26283D] text-[10px] font-medium text-gray-300">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] text-gray-400">{item.counter.split(' - ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Quantity Controller */}
              <div className="flex items-center gap-3 bg-[#0D0E15] p-2 rounded-2xl border border-[#26283D] self-start md:self-auto">
                <button
                  onClick={() => handleStockQtyChange(item.id, item.currentStockQty, -1)}
                  disabled={item.currentStockQty <= 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="text-center px-2 min-w-[70px]">
                  <span className="text-xs text-gray-400 block text-[10px] uppercase font-bold">Qty Left</span>
                  <span className="text-sm font-black text-white font-mono">{item.currentStockQty}</span>
                </div>
                <button
                  onClick={() => handleStockQtyChange(item.id, item.currentStockQty, 1)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right: 1-Click Stock Status Toggle Buttons */}
              <div className="flex items-center gap-1.5 self-start md:self-auto">
                <button
                  onClick={() => updateStockStatus(item.id, 'in_stock', item.currentStockQty > 0 ? item.currentStockQty : 30)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.stockStatus === 'in_stock'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-[#0D0E15] text-gray-400 hover:text-emerald-300 border border-[#26283D]'
                  }`}
                >
                  In Stock
                </button>

                <button
                  onClick={() => updateStockStatus(item.id, 'low_stock', 5)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.stockStatus === 'low_stock'
                      ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/30'
                      : 'bg-[#0D0E15] text-gray-400 hover:text-amber-300 border border-[#26283D]'
                  }`}
                >
                  Low Stock
                </button>

                <button
                  onClick={() => updateStockStatus(item.id, 'sold_out', 0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.stockStatus === 'sold_out'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-[#0D0E15] text-gray-400 hover:text-red-300 border border-[#26283D]'
                  }`}
                >
                  Sold Out
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
