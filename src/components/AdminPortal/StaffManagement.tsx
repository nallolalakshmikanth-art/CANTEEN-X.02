import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { User, CounterStation, UserRole } from '../../types';
import { COUNTERS } from '../../data/mockData';
import { 
  Users, 
  UserPlus, 
  ChefHat, 
  Shield, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Clock, 
  X, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { allUsers, addStaff, updateStaff, deleteStaff, currentUser } = useCanteen();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [counterAssignment, setCounterAssignment] = useState<CounterStation>(COUNTERS[0]);
  const [shift, setShift] = useState<User['shift']>('Morning (08:00 - 14:00)');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setRole('staff');
    setCounterAssignment(COUNTERS[0]);
    setShift('Morning (08:00 - 14:00)');
    setPhone('+91 98');
    setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingStaff(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setCounterAssignment(user.counterAssignment);
    setShift(user.shift);
    setPhone(user.phone);
    setAvatar(user.avatar);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        email,
        role,
        counterAssignment,
        shift,
        phone,
        avatar
      });
    } else {
      addStaff({
        name,
        email,
        role,
        counterAssignment,
        shift,
        phone,
        active: true,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (user: User) => {
    updateStaff(user.id, { active: !user.active });
  };

  const handleDelete = (id: string) => {
    deleteStaff(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-[#161726] border border-[#26283D] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Staff Roster & Kitchen Stations</h3>
          <p className="text-xs text-gray-400">Manage cafeteria chefs, counter operators, shift schedules, and access privileges</p>
        </div>

        <button
          id="add-staff-account-btn"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Counter Station Coverage Matrix */}
      <div className="bg-[#161726] border border-[#26283D] rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Live Station Deployment Matrix</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COUNTERS.map((counter) => {
            const assignedPeople = allUsers.filter(u => u.counterAssignment === counter && u.active);
            return (
              <div key={counter} className="p-4 bg-[#0D0E15] border border-[#26283D] rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 block">{counter}</span>
                  <div className="mt-2 space-y-1">
                    {assignedPeople.length === 0 ? (
                      <span className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Unstaffed station
                      </span>
                    ) : (
                      assignedPeople.map(p => (
                        <div key={p.id} className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span className="truncate">{p.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#26283D] flex items-center justify-between text-[11px] text-gray-400">
                  <span>Coverage:</span>
                  <span className={assignedPeople.length > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {assignedPeople.length} Operator{assignedPeople.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allUsers.map((user) => (
          <div
            key={user.id}
            className={`bg-[#161726] border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 ${
              user.active ? 'border-[#26283D] hover:border-gray-600' : 'border-red-500/20 opacity-70'
            }`}
          >
            <div>
              {/* Top info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#26283D]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{user.name}</h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {user.role === 'admin' ? 'Campus Admin' : 'Kitchen Operator'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(user)}
                  title={user.active ? 'Click to mark on leave / inactive' : 'Click to activate'}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    user.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {user.active ? 'Active' : 'Off-duty'}
                </button>
              </div>

              {/* Station & Shift Info */}
              <div className="mt-4 pt-3 border-t border-[#26283D] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Counter Station:</span>
                  <span className="text-cyan-400 font-semibold truncate ml-2 text-right">{user.counterAssignment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Shift Timing:</span>
                  <span className="text-gray-300 font-medium">{user.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-300 font-mono">{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-[#26283D] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(user)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              {user.id !== currentUser?.id && (
                <button
                  onClick={() => setDeleteConfirmId(user.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#161726] border border-[#26283D] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#1A1B2D] border-b border-[#26283D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingStaff ? 'Edit Staff Account' : 'Register New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Campus Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Role Privileges</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="staff">Kitchen Staff (Operator)</option>
                    <option value="admin">Full Campus Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Assigned Counter Responsibility</label>
                <select
                  value={counterAssignment}
                  onChange={(e) => setCounterAssignment(e.target.value as CounterStation)}
                  className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {COUNTERS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Shift Schedule</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Morning (08:00 - 14:00)">Morning (08:00 - 14:00)</option>
                    <option value="Evening Rush (14:00 - 22:00)">Evening Rush (14:00 - 22:00)</option>
                    <option value="Full Day">Full Day Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98451 12345"
                    className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#0D0E15] border border-[#26283D] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

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
                  {editingStaff ? 'Save Staff Details' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#161726] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Remove Staff Account?</h4>
              <p className="text-xs text-gray-400 mt-1">
                This account will lose kitchen terminal access and station assignments.
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
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
