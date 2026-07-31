import {
  Bell,
  CircleUserRound,
  LayoutDashboard,
  Moon,
  PieChart,
  Search,
  SlidersHorizontal,
  Sun,
  Target,
  WalletCards,
  Menu
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const Sprout = ({ size = 46 }: { size?: number }) => (
  <span className="sprout" style={{ width: size, height: size }} aria-hidden="true">
    <i />
    <b />
    <em />
  </span>
);

type HeaderAction = 'bell' | 'filter';

export function PageHeader({
  subtitle = "You're building a beautiful future.",
  action = 'bell',
  onSearch,
  onNotifications,
  onFilter
}: {
  subtitle?: string;
  action?: HeaderAction;
  onSearch: () => void;
  onNotifications: () => void;
  onFilter?: () => void;
}) {
  const { notifications, theme, toggleTheme } = useApp();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <header className="mobile-header">
      <button className="avatar-scene" type="button" onClick={onSearch} aria-label="Open search">
        JR
      </button>
      <div className="greeting">
        <strong>Good morning, Jubayr <span aria-hidden="true">sunny</span></strong>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        <button type="button" aria-label="Search" onClick={onSearch}>
          <Search />
        </button>
        <button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button
          type="button"
          aria-label={action === 'filter' ? 'Filter goals' : 'Notifications'}
          onClick={action === 'filter' && onFilter ? onFilter : onNotifications}
          className={unreadCount && action !== 'filter' ? 'has-badge' : ''}
        >
          {action === 'filter' ? <SlidersHorizontal /> : <Bell />}
          {unreadCount && action !== 'filter' ? <span>{unreadCount}</span> : null}
        </button>
      </div>
    </header>
  );
}

import React from 'react';

const navItems = [
  { path: '/home', label: 'Home', icon: LayoutDashboard },
  { path: '/accounts', label: 'Accounts', icon: WalletCards },
  { path: '/transactions', label: 'Transactions', icon: PieChart },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/profile', label: 'Profile', icon: CircleUserRound }
];

export function BottomNav({ onSearch }: { onSearch: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isSidebarExpanded, setIsSidebarExpanded } = useApp();

  return (
    <>
      {/* Mobile/Tablet Bottom Nav */}
      <nav className="bottom-nav mobile-only-nav" aria-label="Main navigation">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path === '/profile' && pathname.startsWith('/profile'));
          return (
            <button
              className={active ? 'active' : ''}
              onClick={() => navigate(path)}
              key={path}
              type="button"
              aria-current={active ? 'page' : undefined}
              onDoubleClick={onSearch}
            >
              <Icon />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Sidebar Layout (Single Rail) */}
      <div className={`desktop-sidebar ${isSidebarExpanded ? 'expanded' : ''}`} aria-label="Desktop navigation">
        {/* Left Dark Rail */}
        <div className="primary-rail">
          <div className="rail-header">
            <button
              className="rail-toggle"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              type="button"
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={24} />
            </button>
            <div className="logo-container">
              <Sprout size={28} />
              <b className="logo-text">FR</b>
            </div>
          </div>

          <div className="rail-menu">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = pathname === path || (path === '/profile' && pathname.startsWith('/profile'));
              return (
                <button
                  key={path}
                  className={`rail-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(path)}
                  type="button"
                  title={isSidebarExpanded ? undefined : label}
                  aria-label={label}
                >
                  <Icon size={24} />
                  <span className="rail-label">{label}</span>
                  <span className="dot-indicator" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function AppPage({
  children,
  subtitle,
  action,
  onSearch,
  onNotifications,
  onFilter
}: {
  children: React.ReactNode;
  subtitle?: string;
  action?: HeaderAction;
  onSearch: () => void;
  onNotifications: () => void;
  onFilter?: () => void;
}) {
  const { isSidebarExpanded } = useApp();

  return (
    <main className={`finora-mobile ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <PageHeader
        subtitle={subtitle}
        action={action}
        onSearch={onSearch}
        onNotifications={onNotifications}
        onFilter={onFilter}
      />
      {children}
      <BottomNav onSearch={onSearch} />
    </main>
  );
}

export const IconTile = ({
  children,
  tone = 'blue'
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'mint' | 'violet' | 'amber' | 'rose';
}) => <span className={`icon-tile ${tone}`}>{children}</span>;

export const BankIcon = ({
  children,
  tone = 'blue'
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'mint' | 'violet' | 'amber' | 'rose';
}) => <span className={`bank-icon ${tone}`}>{children}</span>;
