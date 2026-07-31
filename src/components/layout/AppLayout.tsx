import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Wallet, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  User, 
  Search, 
  Bell, 
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Trash2,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    user, 
    baseCurrency, 
    setBaseCurrency,
    isAuthenticated,
    logout,
    theme,
    toggleTheme,
    notifications,
    setNotifications,
    markAllAsRead,
    accounts,
    transactions
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    accounts: typeof accounts;
    transactions: typeof transactions;
  }>({ accounts: [], transactions: [] });

  const notificationRef = useRef<HTMLDivElement>(null);

  // Compute current screen from pathname for single source of truth
  const path = location.pathname;
  const currentScreen = path.startsWith('/splash') ? 'splash'
    : path.startsWith('/onboarding') ? 'onboarding'
    : path.startsWith('/login') ? 'login'
    : path.startsWith('/home') ? 'home'
    : path.startsWith('/accounts') ? 'accounts'
    : path.startsWith('/transactions') ? 'transactions'
    : path.startsWith('/budgets') ? 'budgets'
    : path.startsWith('/goals') ? 'goals'
    : path.startsWith('/profile/security') ? 'security'
    : path.startsWith('/profile') ? 'profile'
    : 'home';

  // 1. Auth Guard Redirects
  useEffect(() => {
    // If not authenticated and trying to view dashboard screens, force redirect to /login
    if (!isAuthenticated && !['splash', 'onboarding', 'login'].includes(currentScreen)) {
      navigate('/login');
    }
    // If authenticated and on login/splash/onboarding, redirect to home dashboard
    if (isAuthenticated && ['login'].includes(currentScreen)) {
      navigate('/home');
    }
  }, [isAuthenticated, currentScreen, navigate]);

  // Click outside listener for notifications popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Search filtering logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ accounts: [], transactions: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredAcc = accounts.filter(acc => 
      acc.name.toLowerCase().includes(query) || 
      acc.bankName.toLowerCase().includes(query)
    );
    const filteredTrans = transactions.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.category.toLowerCase().includes(query) ||
      t.accountName.toLowerCase().includes(query)
    );

    setSearchResults({
      accounts: filteredAcc,
      transactions: filteredTrans
    });
  }, [searchQuery, accounts, transactions]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'accounts', label: 'Accounts', icon: Wallet, path: '/accounts' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
    { id: 'budgets', label: 'Budgets', icon: PieChart, path: '/budgets' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const handleNavClick = (targetPath: string) => {
    navigate(targetPath);
    setShowMobileMenu(false);
    // Scroll to top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchResultClick = (targetPath: string) => {
    setShowSearchModal(false);
    setSearchQuery('');
    navigate(targetPath);
  };

  const handleNotificationDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Do not render shell wrapper if on Splash, Onboarding, or Login
  const isShellHidden = ['splash', 'onboarding', 'login'].includes(currentScreen);

  if (isShellHidden) {
    return <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>;
  }

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen bg-finora-bg dark:bg-slate-950 flex flex-col md:flex-row antialiased transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-sidebar shrink-0 sticky top-0 h-screen z-20">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-blue-500/10">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Finora</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">Financial Freedom</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (item.id === 'profile' && currentScreen === 'security');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div 
            onClick={() => handleNavClick('/profile')}
            className="flex items-center gap-3 p-2 bg-white dark:bg-slate-850 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 shadow-sm mb-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-brand-600 shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-950/30 transition-all duration-150"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ================= HEADER ================= */}
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-30">
          {/* Left: Greeting / Brand on Mobile */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Title / Info */}
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                Good morning, {user.name.split(' ')[0]} ☀️
              </h2>
              <p className="hidden md:block text-xs text-slate-400 dark:text-slate-500 font-medium">
                {currentScreen === 'home' 
                  ? "You're building a beautiful future! 💙" 
                  : currentScreen === 'accounts'
                  ? "All your financial accounts in one place."
                  : currentScreen === 'transactions'
                  ? "Track your money. Build your freedom. 💙"
                  : currentScreen === 'budgets'
                  ? "Let's make today a step closer to freedom. 💙"
                  : currentScreen === 'goals'
                  ? "Every goal you save for is a future you build. 💙"
                  : currentScreen === 'security'
                  ? "Maintain and configure your account privacy settings."
                  : "Stay on track. Freedom is built daily. 💙"
                }
              </p>
            </div>
          </div>

          {/* Right: Actions (Theme Toggle, Search, Notification Popover, Profile) */}
          <div className="flex items-center gap-2 md:gap-3.5">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all duration-150"
              >
                <span>{baseCurrency}</span>
                <ChevronDown size={12} className={`transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCurrencyDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowCurrencyDropdown(false)} />
                  <div className="absolute right-0 mt-1.5 w-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg py-1 z-30">
                    {['AED', 'USD', 'INR', 'EUR', 'GBP'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setBaseCurrency(curr);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          baseCurrency === curr ? 'text-brand-600 bg-brand-50/50' : 'text-slate-650 dark:text-slate-350'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggler */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-150"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Search Icon */}
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-150"
            >
              <Search size={18} />
            </button>

            {/* Notification Bell with Red Badge & Popover */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(prev => !prev);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all relative duration-150"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border border-white dark:border-slate-900 rounded-full animate-bounce"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-[-12px] md:right-0 mt-2.5 w-[calc(100vw-32px)] sm:w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl py-4 z-40 max-h-[80vh] flex flex-col overflow-hidden transform origin-top-right">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between px-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <Badge variant="danger">{unreadNotificationsCount} new</Badge>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Popover List */}
                  <div className="flex-1 overflow-y-auto no-scrollbar py-2 divide-y divide-slate-50 dark:divide-slate-800/50">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                        No notifications to show
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id)}
                          className={`px-5 py-3.5 flex gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer relative ${
                            !n.isRead ? 'bg-blue-50/5 dark:bg-blue-950/10' : ''
                          }`}
                        >
                          {/* Left Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 shadow-inner ${
                            n.type === 'sync' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            : n.type === 'bill' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}>
                            {n.type === 'sync' ? '🔄' : n.type === 'bill' ? '📅' : '🌱'}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 truncate">
                              {n.title}
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></span>
                              )}
                            </h5>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mt-0.5 line-clamp-2">
                              {n.description}
                            </p>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-650 mt-1 block">
                              {n.timeText}
                            </span>
                          </div>

                          {/* Right Action */}
                          <button
                            onClick={(e) => handleNotificationDelete(n.id, e)}
                            className="absolute right-4 top-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-450 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar on Desktop */}
            <div 
              onClick={() => handleNavClick('/profile')}
              className="hidden md:flex w-9 h-9 rounded-full bg-brand-100 border border-brand-200 cursor-pointer items-center justify-center font-bold text-brand-600 hover:ring-2 hover:ring-brand-500/20 transition-all shrink-0 shadow-sm"
            >
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Mobile menu dropdown */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-lg py-4 px-3 flex flex-col gap-1 z-20 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id || (item.id === 'profile' && currentScreen === 'security');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= PAGE WRAPPER ================= */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-28 md:pb-8 text-slate-700 dark:text-slate-200 transition-colors">
          {children}
        </main>

        {/* ================= MOBILE BOTTOM NAVBAR ================= */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-nav safe-pb z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (item.id === 'profile' && currentScreen === 'security');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="flex flex-col items-center justify-center w-12 py-1 select-none active:scale-95 transition-transform"
              >
                <Icon 
                  size={20} 
                  className={`mb-1 transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400 stroke-[2.5px]' : 'text-slate-400 dark:text-slate-500 stroke-[1.8px]'}`} 
                />
                <span className={`text-[9px] font-bold tracking-tight transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* ================= SEARCH MODAL OVERLAY ================= */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="Search Finora">
        <div className="space-y-5">
          {/* Input field */}
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions, accounts, categories..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white text-slate-850 dark:text-slate-200 outline-none text-xs font-semibold shadow-inner"
            />
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Results Area */}
          <div className="max-h-60 overflow-y-auto no-scrollbar space-y-4">
            {!searchQuery.trim() ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                Type above to look up transactions (e.g. <span className="font-bold text-slate-500">Salary</span>, <span className="font-bold text-slate-500">Coffee</span>) or accounts.
              </div>
            ) : searchResults.accounts.length === 0 && searchResults.transactions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                No matching results found for "{searchQuery}"
              </div>
            ) : (
              <>
                {/* 1. Accounts Section */}
                {searchResults.accounts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-450 dark:text-slate-550 uppercase tracking-widest pl-1 mb-2">
                      Accounts ({searchResults.accounts.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.accounts.map(acc => (
                        <div
                          key={acc.id}
                          onClick={() => handleSearchResultClick('/accounts')}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <CreditCard size={14} className="text-brand-500" />
                            <span className="text-xs font-bold text-slate-750 dark:text-slate-250 truncate">{acc.bankName}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-650 dark:text-slate-350">
                            {acc.currency} {acc.balance.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Transactions Section */}
                {searchResults.transactions.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-450 dark:text-slate-550 uppercase tracking-widest pl-1 mb-2">
                      Transactions ({searchResults.transactions.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.transactions.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleSearchResultClick('/transactions')}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 pr-4">
                            <p className="text-xs font-bold text-slate-750 dark:text-slate-250 truncate">{t.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{t.category} • {t.accountName}</p>
                          </div>
                          <span className={`text-xs font-extrabold shrink-0 ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'}`}>
                            {t.type === 'income' ? '+' : '-'} {t.currency} {t.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
};
