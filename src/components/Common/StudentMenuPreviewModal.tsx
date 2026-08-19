import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { MenuItem } from '../../types';
import { X, Search, Utensils, Clock, Flame, ShieldAlert, Sparkles, Check, ShoppingBag } from 'lucide-react';

interface StudentMenuPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentMenuPreviewModal: React.FC<StudentMenuPreviewModalProps> = ({ isOpen, onClose }) => {
  const { menuItems } = useCanteen();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Breakfast', 'Quick Bites', 'Main Course', 'Beverages', 'Desserts', 'Combos'];

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getDietaryBadge = (dietary: string) => {
    if (dietary === 'veg') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Veg
        </span>
      );
    }
    if (dietary === 'non-veg') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Non-Veg
        </span>
      );
    }
    if (dietary === 'vegan') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Vegan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
        Jain
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0F0F1A] border border-[#26283D] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with live sync notice */}
        <div className="px-6 py-4 bg-[#161726] border-b border-[#26283D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Student Kiosk Menu Preview</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Live View
                </span>
              </div>
              <p className="text-xs text-gray-400">See real-time changes made in Admin Menu & Inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="p-6 pb-2 space-y-4 border-b border-[#26283D] bg-[#121320]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student dishes, rolls, beverages, combos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-gray-600 transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-[#1A1B2D] text-gray-400 hover:text-gray-200 border border-[#26283D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-[#161726] border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                item.stockStatus === 'sold_out'
                  ? 'border-red-500/20 opacity-60'
                  : 'border-[#26283D] hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20'
              }`}
            >
              {/* Image & Badges */}
              <div className="h-36 relative overflow-hidden bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Dietary badge */}
                <div className="absolute top-2.5 left-2.5">
                  {getDietaryBadge(item.dietary)}
                </div>

                {/* Stock Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  {item.stockStatus === 'sold_out' ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-lg">
                      SOLD OUT
                    </span>
                  ) : item.stockStatus === 'low_stock' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-black shadow-md">
                      Only {item.currentStockQty} Left!
                    </span>
                  ) : null}
                </div>

                <div className="absolute bottom-2 left-2.5 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-lg text-[11px] text-gray-200">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{item.prepTimeMinutes}m prep</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug">{item.name}</h4>
                    <span className="text-base font-extrabold text-cyan-400 shrink-0">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#26283D] flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px]">{item.counter.split(' - ')[0]}</span>
                  {item.stockStatus === 'sold_out' ? (
                    <span className="text-red-400 font-semibold text-xs">Unavailable</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> In Stock ({item.currentStockQty})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#161726] border-t border-[#26283D] flex items-center justify-between text-xs text-gray-400">
          <span>Showing {filteredItems.length} active menu items</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
