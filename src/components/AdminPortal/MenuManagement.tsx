import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { MenuItem, DietaryType, StockStatus, CounterStation } from '../../types';
import { COUNTERS } from '../../data/mockData';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Clock, 
  Flame, 
  IndianRupee, 
  X, 
  Sparkles, 
  Check, 
  Utensils, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useCanteen();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuItem['category']>('Quick Bites');
  const [price, setPrice] = useState<number>(80);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(8);
  const [calories, setCalories] = useState<number>(350);
  const [dietary, setDietary] = useState<DietaryType>('veg');
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [counter, setCounter] = useState<CounterStation>(COUNTERS[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentStockQty, setCurrentStockQty] = useState<number>(40);
  const [maxDailyStock, setMaxDailyStock] = useState<number>(50);
  const [isPopular, setIsPopular] = useState<boolean>(false);

  const categories = ['All', 'Breakfast', 'Quick Bites', 'Main Course', 'Beverages', 'Desserts', 'Combos'];

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.counter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('Quick Bites');
    setPrice(80);
    setPrepTimeMinutes(8);
    setCalories(350);
    setDietary('veg');
    setSpiceLevel('Medium');
    setCounter(COUNTERS[0]);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80');
    setCurrentStockQty(40);
    setMaxDailyStock(50);
    setIsPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setPrepTimeMinutes(item.prepTimeMinutes);
    setCalories(item.calories);
    setDietary(item.dietary);
    setSpiceLevel(item.spiceLevel || 'Medium');
    setCounter(item.counter);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCurrentStockQty(item.currentStockQty);
    setMaxDailyStock(item.maxDailyStock);
    setIsPopular(item.isPopular || false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    let stockStatus: StockStatus = 'in_stock';
    if (currentStockQty === 0) stockStatus = 'sold_out';
    else if (currentStockQty <= 10) stockStatus = 'low_stock';

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name,
        category,
        price,
        prepTimeMinutes,
        calories,
        dietary,
        spiceLevel,
        counter,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
        stockStatus,
        currentStockQty,
        maxDailyStock,
        isPopular,
        isAvailable: stockStatus !== 'sold_out'
      });
    } else {
      addMenuItem({
        name,
        category,
        price,
        prepTimeMinutes,
        calories,
        dietary,
        spiceLevel,
        counter,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
        stockStatus,
        currentStockQty,
        maxDailyStock,
        isPopular,
        isAvailable: stockStatus !== 'sold_out'
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Add Dish Button */}
      <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Menu Item Catalog & Pricing</h3>
            <p className="text-xs text-gray-400">Add, edit, or delete items directly affecting the live student ordering menu</p>
          </div>

          <button
            id="add-new-dish-btn"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search dishes by name, ingredients, or counter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-[#0D0E15] text-gray-400 hover:text-white border border-[#26283D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#161726] border border-[#26283D] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-gray-600 transition-all duration-200"
          >
            {/* Image Preview & Badges */}
            <div className="h-40 relative overflow-hidden bg-black/40">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              {/* Category Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-gray-200 border border-white/10">
                  {item.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  item.dietary === 'veg' ? 'bg-emerald-500/80 text-black' :
                  item.dietary === 'non-veg' ? 'bg-red-500/80 text-white' :
                  item.dietary === 'vegan' ? 'bg-teal-500/80 text-black' : 'bg-amber-500/80 text-black'
                }`}>
                  {item.dietary}
                </span>
              </div>

              {/* Price Pill */}
              <div className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-black/80 backdrop-blur-xs rounded-xl border border-cyan-500/40 text-cyan-400 font-extrabold text-sm font-mono">
                ₹{item.price}
              </div>

              {/* Stock status indicator */}
              <div className="absolute top-2.5 right-2.5">
                {item.stockStatus === 'sold_out' ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    Sold Out
                  </span>
                ) : item.stockStatus === 'low_stock' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    Low ({item.currentStockQty})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-black text-[10px] font-bold">
                    Stock: {item.currentStockQty}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white leading-snug">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#0D0E15] border border-[#26283D] rounded-xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">Prep Time</span>
                  <span className="font-bold text-white">{item.prepTimeMinutes}m</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Calories</span>
                  <span className="font-bold text-white">{item.calories} kcal</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Spice</span>
                  <span className="font-bold text-amber-400">{item.spiceLevel || 'Mild'}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>Station:</span>
                <span className="text-cyan-400 font-semibold">{item.counter.split(' - ')[0]}</span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-3 bg-[#1A1B2D] border-t border-[#26283D] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Item</span>
              </button>

              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#161726] border border-[#26283D] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#1A1B2D] border-b border-[#26283D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingItem ? 'Edit Dish Details' : 'Add New Dish to Canteen Menu'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dish Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paneer Butter Masala Roll"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Prep Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Prep Time (Minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Dietary Tag */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Dietary Tag</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value as DietaryType)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="veg">🟢 Veg</option>
                    <option value="non-veg">🔴 Non-Veg</option>
                    <option value="vegan">🌱 Vegan</option>
                    <option value="jain">🟡 Jain</option>
                  </select>
                </div>

                {/* Spice Level */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Spice Level</label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Mild">🌶️ Mild</option>
                    <option value="Medium">🌶️🌶️ Medium</option>
                    <option value="Spicy">🌶️🌶️🌶️ Spicy</option>
                  </select>
                </div>

                {/* Counter Station Assignment */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Assigned Kitchen Counter</label>
                  <select
                    value={counter}
                    onChange={(e) => setCounter(e.target.value as CounterStation)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {COUNTERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Initial Prep Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={currentStockQty}
                    onChange={(e) => setCurrentStockQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Max Daily Target */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Daily Max Target</label>
                  <input
                    type="number"
                    min="1"
                    value={maxDailyStock}
                    onChange={(e) => setMaxDailyStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Image URL (Unsplash or CDN)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Dish Description & Ingredients</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe taste, special chutneys, bread types, or toppings..."
                    className="w-full px-3.5 py-2 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26283D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#161726] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Delete Menu Dish?</h4>
              <p className="text-xs text-gray-400 mt-1">
                This item will be permanently removed from all staff terminals and student kiosk menus.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
