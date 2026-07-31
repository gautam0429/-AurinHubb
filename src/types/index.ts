export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  financialHealth: number; // 0-100
  financialHealthLabel: string; // e.g. "Excellent", "Good"
  totalNetWorth: number;
  baseCurrency: string;
}

export type AccountType = 'Savings' | 'Current' | 'Investment' | 'Salary' | 'Cash' | 'Loan';

export interface Account {
  id: string;
  name: string;
  bankName: string;
  type: AccountType;
  lastFourDigits?: string;
  balance: number;
  currency: string;
  isSynced: boolean;
  lastSyncedText: string;
  logoKey?: string; // key for custom styling/branding
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  accountName: string;
  accountLogo?: string;
  categoryIcon?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  status: 'good' | 'warning' | 'critical';
  statusText: string;
  iconName: string;
}

export interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadlineText: string; // e.g., "3 months left", "18 months to go"
  progress: number; // percentage 0-100
  imageKey: string; // key for rendering beautiful illustrations
}

export interface UpcomingBill {
  id: string;
  title: string;
  amount: number;
  currency: string;
  dueDateText: string; // e.g. "Due tomorrow", "In 3 days"
  isExpense: boolean;
  date: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timeText: string;
  isRead: boolean;
  type?: 'sync' | 'bill' | 'alert';
}
