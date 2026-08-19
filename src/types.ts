export type UserRole = 'admin' | 'staff';

export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'jain';

export type StockStatus = 'in_stock' | 'low_stock' | 'sold_out';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export type PaymentMethod = 'campus_card' | 'upi' | 'cash' | 'net_banking';

export type CounterStation = 
  | 'Counter 1 - Snacks & Rolls'
  | 'Counter 2 - Main Meals & Thali'
  | 'Counter 3 - Beverages & Desserts'
  | 'Counter 4 - Quick Bites & Chaat';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  counterAssignment: CounterStation;
  shift: 'Morning (08:00 - 14:00)' | 'Evening Rush (14:00 - 22:00)' | 'Full Day';
  phone: string;
  active: boolean;
  joinedDate: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Quick Bites' | 'Main Course' | 'Beverages' | 'Desserts' | 'Combos';
  price: number;
  prepTimeMinutes: number;
  calories: number;
  dietary: DietaryType;
  description: string;
  imageUrl: string;
  stockStatus: StockStatus;
  currentStockQty: number;
  maxDailyStock: number;
  isPopular?: boolean;
  isAvailable: boolean;
  counter: CounterStation;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  notes?: string;
  dietary: DietaryType;
}

export interface Order {
  id: string;
  tokenNumber: number;
  studentName: string;
  studentId: string;
  hostelBlock: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  counter: CounterStation;
  createdAt: string;
  estimatedPickupTime: string;
  notes?: string;
  completedAt?: string;
  preparedBy?: string;
}

export interface Transaction {
  id: string;
  orderId?: string;
  type: 'order_payment' | 'card_topup' | 'refund';
  amount: number;
  studentName: string;
  studentId: string;
  method: PaymentMethod;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  referenceId: string;
  notes?: string;
}

export interface CounterInfo {
  id: string;
  name: CounterStation;
  assignedStaffNames: string[];
  activeOrders: number;
  isOpen: boolean;
}
