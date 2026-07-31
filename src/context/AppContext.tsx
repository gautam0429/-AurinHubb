import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Account, Transaction, Budget, Goal, UpcomingBill, Notification } from '../types';

interface AppContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  upcomingBills: UpcomingBill[];
  setUpcomingBills: React.Dispatch<React.SetStateAction<UpcomingBill[]>>;
  
  // UI States
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  netWorthView: 'current' | 'all';
  setNetWorthView: (view: 'current' | 'all') => void;
  
  // App states
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;

  // Phase 2 States
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAllAsRead: () => void;
  updateUserProfile: (name: string, email: string) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (val: boolean) => void;
}

const initialUser: User = {
  name: 'Jubayr Rahman',
  email: 'jubayr@gmail.com',
  financialHealth: 82,
  financialHealthLabel: 'Excellent',
  totalNetWorth: 185420,
  baseCurrency: 'AED'
};

const initialAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Savings Account',
    bankName: 'Emirates NBD',
    type: 'Savings',
    lastFourDigits: '4321',
    balance: 24850.00,
    currency: 'AED',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'emirates'
  },
  {
    id: 'acc-2',
    name: 'Current Account',
    bankName: 'ADCB',
    type: 'Current',
    lastFourDigits: '9876',
    balance: 48670.50,
    currency: 'AED',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'adcb'
  },
  {
    id: 'acc-3',
    name: 'Savings Account',
    bankName: 'State Bank of India',
    type: 'Savings',
    lastFourDigits: '2468',
    balance: 185430.00,
    currency: 'INR',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'sbi'
  },
  {
    id: 'acc-4',
    name: 'Salary Account',
    bankName: 'Mashreq Bank',
    type: 'Salary',
    lastFourDigits: '1357',
    balance: 12340.75,
    currency: 'AED',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'mashreq'
  },
  {
    id: 'acc-5',
    name: 'Investment Account',
    bankName: 'Wahed Invest',
    type: 'Investment',
    lastFourDigits: '7789',
    balance: 56200.00,
    currency: 'AED',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'wahed'
  },
  {
    id: 'acc-6',
    name: 'Cash Account',
    bankName: 'Cash in Hand',
    type: 'Cash',
    lastFourDigits: 'CASH',
    balance: 5400.00,
    currency: 'AED',
    isSynced: false,
    lastSyncedText: 'Not Synced',
    logoKey: 'cash'
  },
  {
    id: 'acc-7',
    name: 'Savings Account',
    bankName: 'HDFC Bank',
    type: 'Savings',
    lastFourDigits: '9911',
    balance: 120000.00,
    currency: 'INR',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'hdfc'
  },
  {
    id: 'acc-8',
    name: 'Savings Account',
    bankName: 'ICICI Bank',
    type: 'Savings',
    lastFourDigits: '8822',
    balance: 80000.00,
    currency: 'INR',
    isSynced: true,
    lastSyncedText: 'Synced',
    logoKey: 'icici'
  }
];

const initialTransactions: Transaction[] = [
  // Today
  {
    id: 't-1',
    title: 'Salary Received',
    type: 'income',
    amount: 12000.00,
    currency: 'AED',
    category: 'Salary',
    date: '2025-07-25',
    time: '09:15 AM',
    accountName: 'Emirates NBD',
    categoryIcon: 'wallet'
  },
  {
    id: 't-2',
    title: 'Starbucks Coffee',
    type: 'expense',
    amount: 24.00,
    currency: 'AED',
    category: 'Food & Dining',
    date: '2025-07-25',
    time: '10:42 AM',
    accountName: 'Cash in Hand',
    categoryIcon: 'coffee'
  },
  {
    id: 't-3',
    title: 'Uber Ride',
    type: 'expense',
    amount: 45.00,
    currency: 'AED',
    category: 'Transport',
    date: '2025-07-25',
    time: '08:30 AM',
    accountName: 'ADCB',
    categoryIcon: 'car'
  },
  // Yesterday
  {
    id: 't-4',
    title: 'Amazon Purchase',
    type: 'expense',
    amount: 420.50,
    currency: 'AED',
    category: 'Shopping',
    date: '2025-07-24',
    time: '07:45 PM',
    accountName: 'Emirates NBD',
    categoryIcon: 'shopping-bag'
  },
  {
    id: 't-5',
    title: 'Cashback Credit',
    type: 'income',
    amount: 12.00,
    currency: 'AED',
    category: 'Refunds',
    date: '2025-07-24',
    time: '06:20 PM',
    accountName: 'Emirates NBD',
    categoryIcon: 'refresh-cw'
  },
  // 23 Jul
  {
    id: 't-6',
    title: 'Freelance Payment',
    type: 'income',
    amount: 2500.00,
    currency: 'AED',
    category: 'Income',
    date: '2025-07-23',
    time: '11:30 AM',
    accountName: 'Bank Transfer',
    categoryIcon: 'trending-up'
  },
  {
    id: 't-7',
    title: 'Spotify Subscription',
    type: 'expense',
    amount: 23.00,
    currency: 'AED',
    category: 'Entertainment',
    date: '2025-07-23',
    time: '01:15 PM',
    accountName: 'Emirates NBD',
    categoryIcon: 'play'
  },
  // 22 Jul
  {
    id: 't-8',
    title: 'Internet Bill',
    type: 'expense',
    amount: 350.00,
    currency: 'AED',
    category: 'Utilities',
    date: '2025-07-22',
    time: '09:10 PM',
    accountName: 'ADCB',
    categoryIcon: 'smartphone'
  },
  {
    id: 't-9',
    title: 'Netflix Standard',
    type: 'expense',
    amount: 45.00,
    currency: 'AED',
    category: 'Entertainment',
    date: '2025-07-22',
    time: '06:40 PM',
    accountName: 'ADCB',
    categoryIcon: 'play'
  },
  // 21 Jul
  {
    id: 't-10',
    title: 'Electricity Bill',
    type: 'expense',
    amount: 180.00,
    currency: 'AED',
    category: 'Utilities',
    date: '2025-07-21',
    time: '08:50 PM',
    accountName: 'Emirates NBD',
    categoryIcon: 'home'
  }
];

const initialBudgets: Budget[] = [
  {
    id: 'b-1',
    category: 'Housing',
    limit: 5000,
    spent: 3200,
    status: 'good',
    statusText: "You're on track",
    iconName: 'home'
  },
  {
    id: 'b-2',
    category: 'Food & Dining',
    limit: 1000,
    spent: 780,
    status: 'warning',
    statusText: 'Slightly high this month',
    iconName: 'utensils'
  },
  {
    id: 'b-3',
    category: 'Transport',
    limit: 1000,
    spent: 420,
    status: 'good',
    statusText: "You're on track",
    iconName: 'car'
  },
  {
    id: 'b-4',
    category: 'Shopping',
    limit: 1000,
    spent: 920,
    status: 'critical',
    statusText: 'Almost at your limit',
    iconName: 'shopping-bag'
  },
  {
    id: 'b-5',
    category: 'Health & Wellness',
    limit: 500,
    spent: 190,
    status: 'good',
    statusText: "You're doing great",
    iconName: 'heart'
  },
  {
    id: 'b-6',
    category: 'Entertainment',
    limit: 600,
    spent: 330,
    status: 'good',
    statusText: "You're on track",
    iconName: 'play'
  }
];

const initialGoals: Goal[] = [
  {
    id: 'g-1',
    name: 'Emergency Fund 🛡️',
    category: 'Financial Security',
    targetAmount: 30000,
    currentAmount: 30000,
    deadlineText: 'Completed',
    progress: 100,
    imageKey: 'lake'
  },
  {
    id: 'g-2',
    name: 'Europe Trip ✈️',
    category: 'Experiences',
    targetAmount: 15000,
    currentAmount: 9300,
    deadlineText: '3 months left',
    progress: 62,
    imageKey: 'bali'
  },
  {
    id: 'g-3',
    name: 'New Home 🏡',
    category: 'Big Purchase',
    targetAmount: 300000,
    currentAmount: 156000,
    deadlineText: '18 months to go',
    progress: 52,
    imageKey: 'home'
  },
  {
    id: 'g-4',
    name: 'New Car 🚗',
    category: 'Big Purchase',
    targetAmount: 80000,
    currentAmount: 22400,
    deadlineText: '10 months to go',
    progress: 28,
    imageKey: 'car'
  },
  {
    id: 'g-5',
    name: 'Education 🎓',
    category: 'For the Future',
    targetAmount: 20000,
    currentAmount: 8400,
    deadlineText: '14 months to go',
    progress: 42,
    imageKey: 'education'
  },
  {
    id: 'g-6',
    name: 'Retirement Fund 👴',
    category: 'Financial Security',
    targetAmount: 500000,
    currentAmount: 50000,
    deadlineText: '120 months to go',
    progress: 10,
    imageKey: 'lake'
  }
];

const initialUpcomingBills: UpcomingBill[] = [
  {
    id: 'ub-1',
    title: 'Internet Bill',
    amount: 350,
    currency: 'AED',
    dueDateText: 'Due tomorrow',
    isExpense: true,
    date: 'Tomorrow',
    category: 'Utilities'
  },
  {
    id: 'ub-2',
    title: 'Salary',
    amount: 12000,
    currency: 'AED',
    dueDateText: 'In 3 days',
    isExpense: false,
    date: '26 Jul',
    category: 'Income'
  },
  {
    id: 'ub-3',
    title: 'Receive from Ahmed',
    amount: 2500,
    currency: 'AED',
    dueDateText: 'In 6 days',
    isExpense: false,
    date: '29 Jul',
    category: 'Income'
  },
  {
    id: 'ub-4',
    title: 'Car Loan EMI',
    amount: 1250,
    currency: 'AED',
    dueDateText: 'In 7 days',
    isExpense: true,
    date: '30 Jul',
    category: 'Loans'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'Salary Received',
    description: 'Your monthly salary of AED 12,000 has been credited to your Emirates NBD account.',
    timeText: 'Just now',
    isRead: false,
    type: 'sync'
  },
  {
    id: 'n-2',
    title: 'Budget Exceeded ⚠️',
    description: 'Your Shopping budget limit of AED 1,000 has been exceeded.',
    timeText: '1 hour ago',
    isRead: false,
    type: 'bill'
  },
  {
    id: 'n-3',
    title: 'Goal Completed 🎉',
    description: 'Congratulations! You have completed your Emergency Fund savings goal.',
    timeText: '3 hours ago',
    isRead: false,
    type: 'alert'
  },
  {
    id: 'n-4',
    title: 'Investment Increased',
    description: 'Your investment portfolio in Wahed Invest grew by 8.2% this month.',
    timeText: '1 day ago',
    isRead: true,
    type: 'alert'
  },
  {
    id: 'n-5',
    title: 'Bill Due Tomorrow',
    description: 'Your Internet Bill payment of AED 350 is due tomorrow.',
    timeText: '2 days ago',
    isRead: true,
    type: 'bill'
  },
  {
    id: 'n-6',
    title: 'New Bank Account Synced',
    description: 'Your ADCB current account has been synced successfully.',
    timeText: '3 days ago',
    isRead: true,
    type: 'sync'
  }
];

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(initialUpcomingBills);
  
  // State for onboarding status, splash screen view, active currency selection
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [baseCurrency, setBaseCurrencyState] = useState<string>('AED');
  const [netWorthView, setNetWorthView] = useState<'current' | 'all'>('current');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('finora_sidebar_expanded');
    return saved !== 'false';
  });

  const setSidebarExpandedWithPersist = (val: boolean) => {
    setIsSidebarExpanded(val);
    localStorage.setItem('finora_sidebar_expanded', String(val));
  };

  // Authentication & Session Persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('finora_session') === 'true';
  });

  // Dark/Light Theme configuration state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('finora_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Real-time notifications state
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const setBaseCurrency = (currency: string) => {
    setBaseCurrencyState(currency);
    setUser(prev => ({ ...prev, baseCurrency: currency }));
  };

  const login = (email: string, password: string): boolean => {
    if (email === 'demo@finora.app' && password === 'Finora@123') {
      localStorage.setItem('finora_session', 'true');
      setIsAuthenticated(true);
      setUser(prev => ({ ...prev, email, name: 'Jubayr Rahman' }));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('finora_session');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('finora_theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateUserProfile = (name: string, email: string) => {
    setUser(prev => ({
      ...prev,
      name,
      email
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        accounts,
        setAccounts,
        transactions,
        setTransactions,
        budgets,
        setBudgets,
        goals,
        setGoals,
        upcomingBills,
        setUpcomingBills,
        currentScreen,
        setCurrentScreen,
        baseCurrency,
        setBaseCurrency,
        netWorthView,
        setNetWorthView,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        isAuthenticated,
        login,
        logout,
        theme,
        toggleTheme,
        notifications,
        setNotifications,
        markAllAsRead,
        updateUserProfile,
        isSidebarExpanded,
        setIsSidebarExpanded: setSidebarExpandedWithPersist
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
