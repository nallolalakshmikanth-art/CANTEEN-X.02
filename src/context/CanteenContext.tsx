import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  MenuItem, 
  Order, 
  OrderStatus, 
  Transaction, 
  StockStatus, 
  PaymentMethod, 
  CounterStation 
} from '../types';
import { 
  INITIAL_STAFF_USERS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_TRANSACTIONS, 
  COUNTERS 
} from '../data/mockData';
import { soundManager } from '../utils/audio';

interface CanteenContextType {
  currentUser: User | null;
  currentRole: UserRole;
  allUsers: User[];
  menuItems: MenuItem[];
  orders: Order[];
  transactions: Transaction[];
  currentServingToken: number;
  readyTokens: number[];
  soundEnabled: boolean;
  autoSimulateOrders: boolean;
  selectedCounterFilter: string;
  setSelectedCounterFilter: (counter: string) => void;
  
  // Auth
  login: (role: UserRole, user?: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  
  // Kitchen & Order Management
  updateOrderStatus: (orderId: string, status: OrderStatus, preparedBy?: string) => void;
  advanceOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  simulateNewOrder: () => void;
  
  // Token System
  callNextToken: () => void;
  setServingToken: (token: number) => void;
  recallToken: (token: number) => void;
  
  // Menu Management (CRUD)
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateStockStatus: (id: string, status: StockStatus, currentStockQty?: number) => void;
  
  // Staff Management
  addStaff: (user: Omit<User, 'id' | 'joinedDate'>) => void;
  updateStaff: (id: string, updates: Partial<User>) => void;
  deleteStaff: (id: string) => void;
  
  // Payments & Transactions
  processTopup: (studentName: string, studentId: string, amount: number, method: PaymentMethod, notes?: string) => Transaction;
  refundTransaction: (txId: string, reason: string) => void;
  
  // Preferences
  toggleSound: () => void;
  toggleAutoSimulate: () => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'campus_canteenx_state_v1';

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_STAFF_USERS[1]); // Default Chef Ramesh
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_menu`);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [currentServingToken, setCurrentServingToken] = useState<number>(104);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoSimulateOrders, setAutoSimulateOrders] = useState<boolean>(false);
  const [selectedCounterFilter, setSelectedCounterFilter] = useState<string>('All');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_menu`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  // Sound manager sync
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Derived ready tokens
  const readyTokens = orders
    .filter(o => o.status === 'ready')
    .map(o => o.tokenNumber);

  // Authentication Handlers
  const login = useCallback((role: UserRole, user?: User) => {
    setCurrentRole(role);
    if (user) {
      setCurrentUser(user);
    } else {
      const defaultUser = allUsers.find(u => u.role === role) || allUsers[0];
      setCurrentUser(defaultUser);
    }
  }, [allUsers]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    const matchedUser = allUsers.find(u => u.role === role) || (role === 'admin' ? allUsers[0] : allUsers[1]);
    setCurrentUser(matchedUser);
  }, [allUsers]);

  // Kitchen Order Status Management
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, preparedBy?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const updated: Order = {
        ...order,
        status,
        preparedBy: preparedBy || order.preparedBy || currentUser?.name || 'Staff'
      };

      if (status === 'completed') {
        updated.completedAt = new Date().toISOString();
        updated.estimatedPickupTime = 'Picked Up';
      } else if (status === 'ready') {
        updated.estimatedPickupTime = 'Ready Now';
        // Sound and speech announcement
        soundManager.playTokenBell();
        soundManager.speakToken(order.tokenNumber, order.counter);
      } else if (status === 'preparing') {
        updated.estimatedPickupTime = '3-5 mins';
        soundManager.playAdvanceSound();
      }

      return updated;
    }));
  }, [currentUser]);

  // Advance Order Step
  const advanceOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === 'received') {
      updateOrderStatus(orderId, 'preparing');
    } else if (order.status === 'preparing') {
      updateOrderStatus(orderId, 'ready');
    } else if (order.status === 'ready') {
      updateOrderStatus(orderId, 'completed');
    }
  }, [orders, updateOrderStatus]);

  const cancelOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'cancelled' as OrderStatus,
        notes: reason ? `${order.notes ? order.notes + ' | ' : ''}Cancelled: ${reason}` : order.notes
      };
    }));
  }, []);

  // Token Controls
  const callNextToken = useCallback(() => {
    // Look for ready tokens or next in sequence
    const nextToken = currentServingToken + 1;
    setCurrentServingToken(nextToken);
    soundManager.playTokenBell();
    soundManager.speakToken(nextToken);
  }, [currentServingToken]);

  const setServingToken = useCallback((token: number) => {
    setCurrentServingToken(token);
    soundManager.playTokenBell();
    soundManager.speakToken(token);
  }, []);

  const recallToken = useCallback((token: number) => {
    soundManager.playTokenBell();
    soundManager.speakToken(token);
  }, []);

  // Menu Management CRUD
  const addMenuItem = useCallback((itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu_${Date.now()}`
    };
    setMenuItems(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateStockStatus = useCallback((id: string, stockStatus: StockStatus, currentStockQty?: number) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        stockStatus,
        currentStockQty: currentStockQty !== undefined ? currentStockQty : (stockStatus === 'sold_out' ? 0 : item.currentStockQty),
        isAvailable: stockStatus !== 'sold_out'
      };
    }));
  }, []);

  // Staff Management
  const addStaff = useCallback((userData: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      joinedDate: 'Just now'
    };
    setAllUsers(prev => [...prev, newUser]);
  }, []);

  const updateStaff = useCallback((id: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser]);

  const deleteStaff = useCallback((id: string) => {
    setAllUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  // Payments & Top-ups
  const processTopup = useCallback((studentName: string, studentId: string, amount: number, method: PaymentMethod, notes?: string) => {
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-6)}`,
      type: 'card_topup',
      amount,
      studentName,
      studentId,
      method,
      status: 'success',
      timestamp: new Date().toISOString(),
      referenceId: `TOPUP_CARD_${Math.floor(10000 + Math.random() * 90000)}`,
      notes: notes || `Card balance topped up via ${method.toUpperCase()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    soundManager.playAdvanceSound();
    return newTx;
  }, []);

  const refundTransaction = useCallback((txId: string, reason: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id !== txId) return tx;
      return {
        ...tx,
        status: 'failed',
        notes: `${tx.notes ? tx.notes + ' | ' : ''}Refunded: ${reason}`
      };
    }));

    // Also add a refund entry
    const targetTx = transactions.find(t => t.id === txId);
    if (targetTx) {
      const refundEntry: Transaction = {
        id: `tx_ref_${Date.now().toString().slice(-5)}`,
        orderId: targetTx.orderId,
        type: 'refund',
        amount: -targetTx.amount,
        studentName: targetTx.studentName,
        studentId: targetTx.studentId,
        method: targetTx.method,
        status: 'success',
        timestamp: new Date().toISOString(),
        referenceId: `REF_${Math.floor(1000 + Math.random() * 9000)}`,
        notes: `Refund processed: ${reason}`
      };
      setTransactions(prev => [refundEntry, ...prev]);
    }
  }, [transactions]);

  // Simulate incoming new student order
  const simulateNewOrder = useCallback(() => {
    const sampleStudents = [
      { name: 'Devansh Kulkarni', id: 'CS2023012', block: 'Aryabhatta Block A-202' },
      { name: 'Meera Nambiar', id: 'EC2022084', block: 'Gargi Girls Hostel C-301' },
      { name: 'Aditya Singhania', id: 'ME2024055', block: 'Kalam Hostel B-104' },
      { name: 'Tanvi Agarwal', id: 'BT2023091', block: 'Sarojini Hostel A-405' },
      { name: 'Rahul Chawla', id: 'CE2021066', block: 'Bhabha Hostel D-209' },
      { name: 'Ishita Roy', id: 'AI2024033', block: 'Gargi Girls Hostel B-112' }
    ];

    const student = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];
    const availableItems = menuItems.filter(m => m.stockStatus !== 'sold_out');
    if (availableItems.length === 0) return;

    // Pick 1 to 3 items
    const itemCount = Math.floor(Math.random() * 2) + 1;
    const selectedOrderItems = [];
    let orderTotal = 0;

    for (let i = 0; i < itemCount; i++) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      const qty = Math.random() > 0.7 ? 2 : 1;
      orderTotal += randomItem.price * qty;
      selectedOrderItems.push({
        menuItemId: randomItem.id,
        name: randomItem.name,
        price: randomItem.price,
        quantity: qty,
        spiceLevel: randomItem.spiceLevel || 'Medium',
        dietary: randomItem.dietary,
        notes: Math.random() > 0.6 ? 'Serve hot with extra napkins' : undefined
      });
    }

    // Determine highest token number
    const maxToken = orders.reduce((max, o) => Math.max(max, o.tokenNumber), 108);
    const nextToken = maxToken + 1;

    const paymentMethods: PaymentMethod[] = ['campus_card', 'upi', 'cash'];
    const chosenMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const chosenCounter = selectedOrderItems[0] ? (menuItems.find(m => m.name === selectedOrderItems[0].name)?.counter || COUNTERS[0]) : COUNTERS[0];

    const newOrder: Order = {
      id: `ord_${nextToken}`,
      tokenNumber: nextToken,
      studentName: student.name,
      studentId: student.id,
      hostelBlock: student.block,
      items: selectedOrderItems,
      totalAmount: orderTotal,
      status: 'received',
      paymentStatus: 'paid',
      paymentMethod: chosenMethod,
      counter: chosenCounter,
      createdAt: new Date().toISOString(),
      estimatedPickupTime: '6-8 mins',
      notes: Math.random() > 0.7 ? 'Break time rush order' : undefined
    };

    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-6)}`,
      orderId: newOrder.id,
      type: 'order_payment',
      amount: orderTotal,
      studentName: student.name,
      studentId: student.id,
      method: chosenMethod,
      status: 'success',
      timestamp: new Date().toISOString(),
      referenceId: `${chosenMethod.toUpperCase()}_ORDER_${nextToken}`,
      notes: `Online Kiosk Order (Token #${nextToken})`
    };

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    // Play chime for staff
    soundManager.playNewOrderSound();
  }, [menuItems, orders]);

  // Auto simulate timer
  useEffect(() => {
    if (!autoSimulateOrders) return;
    const interval = setInterval(() => {
      simulateNewOrder();
    }, 20000); // New order every 20s when active

    return () => clearInterval(interval);
  }, [autoSimulateOrders, simulateNewOrder]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleAutoSimulate = useCallback(() => {
    setAutoSimulateOrders(prev => !prev);
  }, []);

  return (
    <CanteenContext.Provider
      value={{
        currentUser,
        currentRole,
        allUsers,
        menuItems,
        orders,
        transactions,
        currentServingToken,
        readyTokens,
        soundEnabled,
        autoSimulateOrders,
        selectedCounterFilter,
        setSelectedCounterFilter,
        login,
        logout,
        switchRole,
        setCurrentUser,
        updateOrderStatus,
        advanceOrder,
        cancelOrder,
        simulateNewOrder,
        callNextToken,
        setServingToken,
        recallToken,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateStockStatus,
        addStaff,
        updateStaff,
        deleteStaff,
        processTopup,
        refundTransaction,
        toggleSound,
        toggleAutoSimulate
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
