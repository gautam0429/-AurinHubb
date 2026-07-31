import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileBarChart,
  Flag,
  LockKeyhole,
  Mail,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Search,
  Share2,
  ShieldCheck,
  Trash2,
  WalletCards,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Account, Budget, Goal, Transaction } from '../types';
import { AppPage, BankIcon, IconTile, Sprout } from '../components/finora/MobileShell';

const currencyMeta = {
  AED: { symbol: 'AED', rate: 1 },
  USD: { symbol: '$', rate: 0.27 },
  EUR: { symbol: 'EUR', rate: 0.25 },
  GBP: { symbol: 'GBP', rate: 0.21 },
  INR: { symbol: 'INR', rate: 22.7 },
  SAR: { symbol: 'SAR', rate: 1.02 },
  QAR: { symbol: 'QAR', rate: 0.99 }
};

type CurrencyCode = keyof typeof currencyMeta;
type ToastTone = 'success' | 'info' | 'danger';
type QuickAddKind = 'Expense' | 'Income' | 'Transfer' | 'Goal' | 'Budget' | 'Account' | 'Category';
type GoalStatus = 'All Goals' | 'Active' | 'Pending' | 'Completed' | 'Archived';
type MenuTarget = { title: string; kind: 'account' | 'budget' | 'goal' | 'transaction' } | null;

const searchResults = [
  { title: 'Dashboard', description: 'Net worth, trends and upcoming activity', path: '/home' },
  { title: 'Accounts', description: 'Bank, cash, investment and loan accounts', path: '/accounts' },
  { title: 'Transactions', description: 'Recent transactions and activity history', path: '/transactions' },
  { title: 'Budgets', description: 'Monthly spending plans and budget status', path: '/budgets' },
  { title: 'Goals', description: 'Savings goals and progress tracking', path: '/goals' },
  { title: 'Profile', description: 'Personal details, preferences and security', path: '/profile' },
  { title: 'Settings', description: 'Theme, notifications and app preferences', path: '/profile' },
  { title: 'Notifications', description: 'Alerts, reminders and account updates', path: '/home', panel: 'notifications' },
  { title: 'Reports', description: 'Monthly financial summary and exports', path: '/transactions' },
  { title: 'Analytics', description: 'Spending patterns and trend insights', path: '/home' }
];

const monthOptions = ['May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025'];
const quickKinds: QuickAddKind[] = ['Expense', 'Income', 'Transfer', 'Goal', 'Budget', 'Account', 'Category'];
const goalTabs: GoalStatus[] = ['All Goals', 'Active', 'Pending', 'Completed', 'Archived'];

const formatPlain = (value: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(value);

const ringStyle = (value: number, color = '#2f86f6') =>
  ({ '--value': `${Math.max(0, Math.min(value, 100)) * 3.6}deg`, '--ring': color } as React.CSSProperties);

function useMoney() {
  const { baseCurrency } = useApp();
  const code = (baseCurrency in currencyMeta ? baseCurrency : 'AED') as CurrencyCode;
  const meta = currencyMeta[code];
  return {
    code,
    format: (value: number) => `${meta.symbol} ${formatPlain(value * meta.rate)}`
  };
}

function getBudgetStatus(spent: number, limit: number): Budget['status'] {
  const percentage = limit ? spent / limit : 0;
  if (percentage >= 0.9) return 'critical';
  if (percentage >= 0.75) return 'warning';
  return 'good';
}

function getGoalStatus(goal: Goal): Exclude<GoalStatus, 'All Goals'> {
  if (goal.deadlineText.toLowerCase().includes('archived')) return 'Archived';
  if (goal.progress >= 100) return 'Completed';
  if (goal.currentAmount <= 0) return 'Pending';
  return 'Active';
}

function cleanGoalName(name: string) {
  return name.replace(/[^\w\s&.-]/g, '').replace(/\s+/g, ' ').trim();
}

function useFinoraUi() {
  const navigate = useNavigate();
  const {
    baseCurrency,
    setBaseCurrency,
    notifications,
    setNotifications,
    markAllAsRead,
    accounts,
    setAccounts,
    setTransactions,
    setBudgets,
    setGoals
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [menuTarget, setMenuTarget] = useState<MenuTarget>(null);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Dashboard', 'Budgets', 'Goals']);

  const showToast = (message: string, tone: ToastTone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2200);
  };

  const addTransaction = (values: DemoValues, kind: Transaction['type']) => {
    const amount = Number(values.amount || 0);
    const newItem: Transaction = {
      id: `t-${Date.now()}`,
      title: values.title || (kind === 'income' ? 'New income' : 'New expense'),
      type: kind,
      amount,
      currency: baseCurrency,
      category: values.category || (kind === 'income' ? 'Income' : 'General'),
      date: new Date().toISOString().slice(0, 10),
      time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
      accountName: values.account || accounts[0]?.bankName || 'Cash',
      categoryIcon: kind === 'income' ? 'trending-up' : 'wallet'
    };
    setTransactions((prev) => [newItem, ...prev]);
  };

  const addBudget = (values: DemoValues) => {
    const limit = Number(values.amount || values.limit || 0);
    const spent = Number(values.spent || 0);
    const status = getBudgetStatus(spent, limit);
    const newBudget: Budget = {
      id: `b-${Date.now()}`,
      category: values.title || values.category || 'New Budget',
      limit,
      spent,
      status,
      statusText: status === 'critical' ? 'Almost at your limit' : status === 'warning' ? 'Slightly high this month' : "You're on track",
      iconName: 'wallet'
    };
    setBudgets((prev) => [newBudget, ...prev]);
  };

  const addGoal = (values: DemoValues) => {
    const target = Number(values.amount || values.targetAmount || 0);
    const current = Number(values.savedAmount || values.currentAmount || 0);
    const progress = target ? Math.round((current / target) * 100) : 0;
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      name: values.title || values.name || 'New Goal',
      category: values.category || 'Future Plan',
      targetAmount: target,
      currentAmount: current,
      deadlineText: values.deadline ? `Due ${values.deadline}` : 'Pending',
      progress,
      imageKey: 'custom'
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const addAccount = (values: DemoValues) => {
    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      name: values.title || values.name || 'New Account',
      bankName: values.account || values.bankName || 'Demo Bank',
      type: 'Savings',
      lastFourDigits: '2026',
      balance: Number(values.amount || 0),
      currency: baseCurrency,
      isSynced: true,
      lastSyncedText: 'Synced',
      logoKey: 'demo'
    };
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const submitQuickAdd = (kind: QuickAddKind, values: DemoValues) => {
    if (kind === 'Expense') addTransaction(values, 'expense');
    if (kind === 'Income') addTransaction(values, 'income');
    if (kind === 'Transfer') addTransaction({ ...values, title: values.title || 'Transfer between accounts', category: 'Transfer' }, 'expense');
    if (kind === 'Goal') addGoal(values);
    if (kind === 'Budget') addBudget(values);
    if (kind === 'Account') addAccount(values);
    if (kind === 'Category') showToast(`${values.title || 'Category'} category is ready for demo use.`, 'success');
    setQuickAddOpen(false);
    showToast(`${kind} saved successfully.`);
  };

  const submitBudget = (values: DemoValues) => {
    addBudget(values);
    setBudgetOpen(false);
    showToast('Budget created successfully.');
  };

  const submitGoal = (values: DemoValues) => {
    addGoal(values);
    setGoalOpen(false);
    showToast('Goal created successfully.');
  };

  const handleSearchSelect = (result: (typeof searchResults)[number]) => {
    setRecentSearches((prev) => [result.title, ...prev.filter((item) => item !== result.title)].slice(0, 5));
    setSearchOpen(false);
    navigate(result.path);
    if (result.panel === 'notifications') setNotificationsOpen(true);
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared.', 'info');
  };

  const menuAction = (label: string) => {
    if (!menuTarget) return;
    setMenuTarget(null);
    showToast(`${label} action applied to ${menuTarget.title}.`, label === 'Delete' ? 'danger' : 'info');
  };

  return {
    baseCurrency,
    setBaseCurrency,
    searchOpen,
    setSearchOpen,
    notificationsOpen,
    setNotificationsOpen,
    quickAddOpen,
    setQuickAddOpen,
    budgetOpen,
    setBudgetOpen,
    goalOpen,
    setGoalOpen,
    menuTarget,
    setMenuTarget,
    toast,
    recentSearches,
    notifications,
    setNotifications,
    markAllAsRead,
    clearNotifications,
    submitQuickAdd,
    submitBudget,
    submitGoal,
    handleSearchSelect,
    menuAction,
    shellProps: {
      onSearch: () => setSearchOpen(true),
      onNotifications: () => setNotificationsOpen(true)
    }
  };
}

function FinoraChrome({ ui }: { ui: ReturnType<typeof useFinoraUi> }) {
  return (
    <>
      <SearchModal open={ui.searchOpen} onClose={() => ui.setSearchOpen(false)} recent={ui.recentSearches} onSelect={ui.handleSearchSelect} />
      <NotificationPanel
        open={ui.notificationsOpen}
        onClose={() => ui.setNotificationsOpen(false)}
        notifications={ui.notifications}
        setNotifications={ui.setNotifications}
        markAllAsRead={ui.markAllAsRead}
        clearNotifications={ui.clearNotifications}
      />
      <QuickAddModal open={ui.quickAddOpen} onClose={() => ui.setQuickAddOpen(false)} onSave={ui.submitQuickAdd} />
      <BudgetModal open={ui.budgetOpen} onClose={() => ui.setBudgetOpen(false)} onSave={ui.submitBudget} />
      <GoalModal open={ui.goalOpen} onClose={() => ui.setGoalOpen(false)} onSave={ui.submitGoal} />
      <ContextMenu target={ui.menuTarget} onClose={() => ui.setMenuTarget(null)} onAction={ui.menuAction} />
      {ui.toast ? <div className={`toast ${ui.toast.tone}`} role="status">{ui.toast.message}</div> : null}
    </>
  );
}

export function SplashPage() {
  const nav = useNavigate();
  return (
    <button className="splash-screen" onClick={() => nav('/onboarding')} aria-label="Start Finora" type="button">
      <div className="splash-brand">
        <Sprout size={78} />
        <b>Finora</b>
        <p>Financial freedom. <span>Beautifully simple.</span></p>
      </div>
    </button>
  );
}

const onboarding = [
  ['Build better', 'financial habits,', 'one day at a time.', 'Small, consistent habits today create a stronger you tomorrow.'],
  ['See your money', 'clearly,', 'without the stress.', 'Bring your financial life into one calm, simple place.'],
  ['A future you', 'can feel good', 'about.', 'Small choices today create lasting freedom tomorrow.']
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const slide = onboarding[step];
  const next = () => (step === onboarding.length - 1 ? nav('/login') : setStep((current) => current + 1));

  return (
    <main className="onboarding-page">
      <button className="skip" onClick={() => nav('/login')} type="button">Skip <ChevronRight /></button>
      <div className="onboarding-art" aria-hidden="true"><Sprout size={96} /></div>
      <section className="onboarding-sheet">
        <div className="onboarding-mark"><Sprout size={54} /></div>
        <h1>{slide.slice(0, 3).map((line, index) => <React.Fragment key={line}>{index === 1 ? <span>{line}</span> : line}<br /></React.Fragment>)}</h1>
        <p>{slide[3]}</p>
        <div className="dots" aria-label={`Slide ${step + 1} of ${onboarding.length}`}>
          {onboarding.map((item, index) => <i key={item[0]} className={index === step ? 'active' : ''} />)}
        </div>
        <button className="primary-button" onClick={next} type="button">{step === 2 ? 'Get started' : 'Continue'} <ArrowRight /></button>
      </section>
    </main>
  );
}

export function LoginPage() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [sentReset, setSentReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const canSubmit = email.trim() && password.trim() && !loading;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSentReset(false);
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      if (login(email.trim(), password)) {
        if (remember) sessionStorage.setItem('finora_remember', 'true');
        nav('/link-accounts');
      } else {
        setError('Invalid email or password.');
        setLoading(false);
      }
    }, 650);
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <Sprout size={64} />
        <h1>Welcome to Finora</h1>
        <p>Log in to continue your journey to financial freedom.</p>
      </section>
      <section className="auth-card">
        <div className="auth-tabs">
          <button className="selected" type="button">Log In</button>
          <button type="button" onClick={() => setSentReset(true)}>Sign Up</button>
        </div>
        <form onSubmit={submit} noValidate>
          <Field icon={<Mail />} label="Email or Mobile Number" placeholder="Enter your email or mobile number" value={email} onValueChange={setEmail} autoComplete="username" />
          <Field
            icon={<LockKeyhole />}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onValueChange={setPassword}
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            trailing={<button type="button" onClick={() => setShow((value) => !value)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff /> : <Eye />}</button>}
          />
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          {sentReset ? <p className="form-success" role="status">Password reset instructions are ready in this demo flow.</p> : null}
          <div className="auth-options">
            <label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> <span>Remember me</span></label>
            <button type="button" onClick={() => { setSentReset(true); setError(''); }}>Forgot password?</button>
          </div>
          <button className="primary-button" disabled={!canSubmit}>{loading ? 'Logging in...' : <>Log In <ArrowRight /></>}</button>
        </form>
        <div className="secure-note">
          <IconTile tone="mint"><ShieldCheck /></IconTile>
          <p><b>Your data stays private and secure.</b><br />We never share your information.</p>
        </div>
      </section>
      <p className="auth-footer"><b>Small steps today, big freedom tomorrow.</b><br />You're doing great. We're here for you.</p>
    </main>
  );
}

function Field({
  icon,
  label,
  trailing,
  value,
  onValueChange,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <label className="form-field">
      <span className="field-icon">{icon}</span>
      <span>
        <b>{label}</b>
        <input value={value} onChange={(event) => onValueChange(event.target.value)} {...props} />
      </span>
      {trailing ? <span className="field-trailing">{trailing}</span> : null}
    </label>
  );
}

export function LinkAccountsPage() {
  const nav = useNavigate();
  const ui = useFinoraUi();
  const cards = [
    ['Cash in hand', 'Add cash savings that you keep with you.', 'Cash', 'mint'],
    ['Bank account', 'Add your bank accounts and balances.', 'Bank', 'blue'],
    ['Investment or Loan', 'Add investments, loans or other sources.', 'Invest', 'violet']
  ] as const;

  return (
    <main className="link-page">
      <button className="back-button" onClick={() => nav(-1)} aria-label="Back" type="button"><ChevronLeft /></button>
      <div className="link-hero">
        <IconTile><WalletCards /></IconTile>
        <h1>Let's add your<br />financial sources</h1>
        <p>Add all the places your money comes from so we can give you a clearer picture.</p>
      </div>
      <section className="source-list" aria-label="Financial source types">
        {cards.map(([title, desc, icon, tone]) => (
          <button key={title} className="source-card" type="button" onClick={() => ui.setQuickAddOpen(true)}>
            <BankIcon tone={tone}>{icon}</BankIcon>
            <span><b>{title}</b><p>{desc}</p><small>Select country</small></span>
            <ChevronRight />
          </button>
        ))}
      </section>
      <div className="safe-card">
        <IconTile tone="mint"><ShieldCheck /></IconTile>
        <p><b>Your data is safe with us</b><br />Everything you add is private and secure.</p>
      </div>
      <button className="primary-button" onClick={() => nav('/home')} type="button">Continue to Dashboard <ArrowRight /></button>
      <button className="text-action" onClick={() => nav('/home')} type="button">Skip for now, I'll do this later</button>
      <FinoraChrome ui={ui} />
    </main>
  );
}

export function HomePage() {
  const ui = useFinoraUi();
  const { accounts, budgets, goals, transactions, upcomingBills, netWorthView, setNetWorthView, user } = useApp();
  const { code, format } = useMoney();
  const currentNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  const netWorth = netWorthView === 'all' ? currentNetWorth + 18500 - 7300 : currentNetWorth;
  const recentGoals = goals.filter((goal) => getGoalStatus(goal) !== 'Archived').slice(0, 2);

  return (
    <AppPage {...ui.shellProps}>
      <section className="networth-card">
        <div>
          <p className="eyebrow">NET WORTH</p>
          <h1>{format(netWorth)}</h1>
          <CurrencySelector code={code} onChange={ui.setBaseCurrency} />
          <p className="show-label">Show net worth as</p>
          <div className="segmented">
            <button className={netWorthView === 'current' ? 'active' : ''} onClick={() => setNetWorthView('current')} type="button">Current<br /><small>Assets only</small></button>
            <button className={netWorthView === 'all' ? 'active' : ''} onClick={() => setNetWorthView('all')} type="button">After Payables &<br />Receivables</button>
          </div>
        </div>
        <div className="health">
          <div className="progress-ring" style={ringStyle(user.financialHealth)}>
            <span><b>{user.financialHealth}<sup>%</sup></b><small>Financial Health</small><em>{user.financialHealthLabel}</em></span>
          </div>
          <p>You're on track.</p>
        </div>
      </section>
      <section className="overview-grid">
        <SummaryCard label="Receivables" value={format(18500)} hint="3 pending" tone="mint" />
        <SummaryCard label="Payables" value={format(7300)} hint="Due in 5 days" tone="rose" />
        <SummaryCard label="Investments" value={format(96200)} hint="+8.2% this month" tone="violet" />
        <SummaryCard label="Loans" value={format(12000)} hint="2 active loans" tone="amber" />
        <SummaryCard label="Cash" value={format(5400)} hint="3 currencies" tone="blue" />
        <SummaryCard label="Accounts" value={format(currentNetWorth)} hint={`${accounts.length} accounts`} tone="blue" />
      </section>
      <SectionTitle title="Goals Progress" action="View all" onAction={() => window.location.hash = '#/goals'} />
      <section className="goals-preview">
        {recentGoals.map((goal) => <GoalPreview key={goal.id} goal={goal} format={format} />)}
      </section>
      <section className="home-bottom">
        <article className="trend-card">
          <b>Net Worth Trend</b>
          <strong>{format(18750)}</strong>
          <small>+11.2% vs last month</small>
          <div className="fake-chart" />
        </article>
        <article className="upcoming-card">
          <b>Upcoming</b>
          {upcomingBills.slice(0, 4).map((bill) => <p key={bill.id}>{bill.title} <span>{bill.isExpense ? '-' : '+'} {format(bill.amount)}</span></p>)}
        </article>
      </section>
      <section className="dashboard-wide">
        <DataPanel title="Recent Transactions" action="View all" onAction={() => window.location.hash = '#/transactions'}>
          {transactions.slice(0, 5).map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} format={format} onMenu={ui.setMenuTarget} />)}
        </DataPanel>
        <DataPanel title="Budget Health" action="Manage" onAction={() => window.location.hash = '#/budgets'}>
          {budgets.slice(0, 4).map((budget) => <BudgetMini key={budget.id} budget={budget} format={format} />)}
        </DataPanel>
      </section>
      <button className="fab" aria-label="Quick add" type="button" onClick={() => ui.setQuickAddOpen(true)}><Plus /><small>Add</small></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function SummaryCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: 'blue' | 'mint' | 'violet' | 'amber' | 'rose' }) {
  return (
    <article className="summary-card">
      <BankIcon tone={tone}>{label.slice(0, 2)}</BankIcon>
      <div><b>{label}</b><strong>{value}</strong><small>{hint}</small></div>
      <ChevronRight />
    </article>
  );
}

function GoalPreview({ goal, format }: { goal: Goal; format: (value: number) => string }) {
  return (
    <article className="goal-preview">
      <div className="goal-image"><Flag /></div>
      <div>
        <b>{cleanGoalName(goal.name)}</b>
        <strong>{goal.progress}<sup>%</sup> <small>there</small></strong>
        <div className="thin-progress"><i style={{ width: `${goal.progress}%` }} /></div>
        <p>{format(goal.currentAmount)} of {format(goal.targetAmount)}<br />{goal.deadlineText}</p>
      </div>
    </article>
  );
}

export function AccountsPage() {
  const ui = useFinoraUi();
  const { accounts } = useApp();
  const { format } = useMoney();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get('type'); // 'savings' | 'investment' | 'loan' | 'cash'

  const filteredAccounts = useMemo(() => {
    if (!filterType) return accounts;
    if (filterType === 'savings') {
      // Show savings/current/salary bank accounts
      return accounts.filter((acc) => ['savings', 'current', 'salary'].includes(acc.type.toLowerCase()));
    }
    return accounts.filter((acc) => acc.type.toLowerCase() === filterType.toLowerCase());
  }, [accounts, filterType]);

  const total = useMemo(() => {
    return filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  }, [filteredAccounts]);

  return (
    <AppPage subtitle="Stay on track. Freedom is built daily." {...ui.shellProps}>
      <section className="page-heading">
        <h1>Accounts</h1>
        <p>
          {filterType 
            ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Accounts` 
            : 'All your financial accounts in one place.'}
        </p>
      </section>
      <section className="total-card">
        <div><b>Total Balance</b><h2>{format(total)}</h2><p>Across {filteredAccounts.length} accounts</p></div>
        <div className="mini-chart"><FileBarChart /><small>+8.2%<br />vs last month</small></div>
      </section>
      <section className="account-list">
        {filteredAccounts.map((account, index) => <AccountCard key={account.id} account={account} index={index} format={format} onMenu={ui.setMenuTarget} />)}
      </section>
      <button className="add-row" type="button" onClick={() => ui.setQuickAddOpen(true)}><PlusCircle /> <span><b>Add Account</b><small>Add bank, cash, investment or loan</small></span><ChevronRight /></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function AccountCard({ account, index, format, onMenu }: { account: Account; index: number; format: (value: number) => string; onMenu: (target: MenuTarget) => void }) {
  const tone = index % 5 === 1 ? 'mint' : index % 5 === 2 ? 'violet' : index % 5 === 3 ? 'amber' : index % 5 === 4 ? 'rose' : 'blue';
  return (
    <article className="account-card">
      <BankIcon tone={tone}>{account.bankName.slice(0, 4).toUpperCase()}</BankIcon>
      <div><b>{account.bankName}</b><p>{account.name}</p><small>Ending {account.lastFourDigits || '----'}</small></div>
      <div className="account-amount">{account.isSynced ? <small className="synced">Synced</small> : <small>Manual</small>}<strong>{format(account.balance)}</strong></div>
      <button className="icon-button" type="button" aria-label={`Account actions for ${account.bankName}`} onClick={() => onMenu({ title: account.bankName, kind: 'account' })}><MoreHorizontal /></button>
    </article>
  );
}

export function BudgetsPage() {
  const ui = useFinoraUi();
  const { budgets } = useApp();
  const { format } = useMoney();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status'); // 'critical' | 'warning' | 'good'

  const filteredBudgets = useMemo(() => {
    if (!statusFilter) return budgets;
    return budgets.filter((b) => b.status === statusFilter);
  }, [budgets, statusFilter]);

  const [month, setMonth] = useState('July 2025');
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const monthModifier = monthOptions.indexOf(month) - monthOptions.indexOf('July 2025');
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0) + monthModifier * 190;
  const progress = totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <AppPage subtitle="Let's make today a step closer to freedom." {...ui.shellProps}>
      <section className="page-heading inline-heading">
        <div>
          <h1>Budgets</h1>
          <p>
            {statusFilter 
              ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Alerts` 
              : 'Monthly spending plan'}
          </p>
        </div>
        <select className="select-button" value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Budget month">
          {monthOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>
      <section className="budget-overview">
        <div><p>Monthly Overview</p><h2>{format(totalSpent)} <small>of {format(totalLimit)}</small></h2><div className="thin-progress"><i style={{ width: `${Math.min(progress, 100)}%` }} /></div><span>{Math.max(0, 100 - progress)}% of your budget remains.</span></div>
        <div className="progress-ring small" style={ringStyle(progress)}><b>{progress}<sup>%</sup><small>Used</small></b></div>
      </section>
      <div className="two-cards"><InfoCard title="Receivables Today" amount={format(2450)} tone="mint" /><InfoCard title="Payables Today" amount={format(1280)} tone="amber" /></div>
      <SectionTitle title="Your Budgets" action="View all budgets" onAction={() => window.location.hash = '#/budgets'} />
      <section className="budget-list">
        {filteredBudgets.map((budget, index) => <BudgetRow key={budget.id} budget={budget} index={index} format={format} onMenu={ui.setMenuTarget} />)}
      </section>
      <button className="add-row" type="button" onClick={() => ui.setBudgetOpen(true)}><PlusCircle /><span><b>Add Budget</b><small>Create a new budget category</small></span><ChevronRight /></button>
      <button className="fab" aria-label="Add budget" type="button" onClick={() => ui.setBudgetOpen(true)}><Plus /><small>Add</small></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function InfoCard({ title, amount, tone }: { title: string; amount: string; tone: 'mint' | 'amber' }) {
  return (
    <article className="info-card">
      <BankIcon tone={tone}>{tone === 'mint' ? 'In' : 'Out'}</BankIcon>
      <b>{title}</b>
      <strong>{amount}</strong>
      <p>{tone === 'mint' ? '2 payments due to you' : '3 payments you need to make'}</p>
      <button type="button" onClick={() => window.location.hash = '#/transactions'}>View all</button>
    </article>
  );
}

function BudgetRow({ budget, index, format, onMenu }: { budget: Budget; index: number; format: (value: number) => string; onMenu: (target: MenuTarget) => void }) {
  const colors = ['#49c495', '#ffad32', '#3686f7', '#fa5c5c', '#50c899', '#9e6cf5'];
  const color = colors[index % colors.length];
  const percent = budget.limit ? Math.round((budget.spent / budget.limit) * 100) : 0;
  return (
    <article>
      <IconTile tone={budget.status === 'critical' ? 'rose' : budget.status === 'warning' ? 'amber' : 'mint'}>{budget.category.slice(0, 2)}</IconTile>
      <div className="progress-ring tiny" style={ringStyle(percent, color)}><b>{percent}%</b></div>
      <div><b>{budget.category}</b><p><strong style={{ color }}>{format(budget.spent)}</strong> of {format(budget.limit)}</p><small style={{ color }}>{budget.statusText}</small></div>
      <button className="icon-button" type="button" aria-label={`Budget actions for ${budget.category}`} onClick={() => onMenu({ title: budget.category, kind: 'budget' })}><MoreHorizontal /></button>
    </article>
  );
}

function BudgetMini({ budget, format }: { budget: Budget; format: (value: number) => string }) {
  const percent = budget.limit ? Math.round((budget.spent / budget.limit) * 100) : 0;
  return (
    <div className="mini-row">
      <span>{budget.category}</span>
      <b>{format(budget.spent)}</b>
      <div className="thin-progress"><i style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

export function GoalsPage() {
  const ui = useFinoraUi();
  const { goals } = useApp();
  const { format } = useMoney();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const urlTab = queryParams.get('tab') as GoalStatus | null;
  const tab = urlTab && goalTabs.includes(urlTab) ? urlTab : 'Active';

  const setTab = (newTab: GoalStatus) => {
    navigate(`/goals?tab=${newTab}`);
  };

  const filteredGoals = tab === 'All Goals' ? goals : goals.filter((goal) => getGoalStatus(goal) === tab);

  return (
    <AppPage subtitle="Every goal you save for is a future you build." action="filter" onFilter={() => ui.setSearchOpen(true)} {...ui.shellProps}>
      <section className="page-heading goals-heading">
        <h1>Goals</h1>
        <p>Your dreams. Your plan. Your freedom.</p>
      </section>
      <div className="tab-row" role="tablist" aria-label="Goal status filters">
        {goalTabs.map((item) => <button key={item} type="button" className={tab === item ? 'active' : ''} onClick={() => setTab(item)} role="tab" aria-selected={tab === item}>{item}</button>)}
      </div>
      <section className="goal-list">
        {filteredGoals.length ? filteredGoals.map((goal, index) => <GoalCard key={goal.id} goal={goal} index={index} format={format} onMenu={ui.setMenuTarget} />) : <EmptyState title="No goals here yet" description="Add a goal or switch filters to see more demo data." />}
      </section>
      <button className="add-row" type="button" onClick={() => ui.setGoalOpen(true)}><PlusCircle /><span><b>Add New Goal</b><small>Dream it. Plan it. Achieve it.</small></span><ChevronRight /></button>
      <button className="fab" aria-label="Add goal" type="button" onClick={() => ui.setGoalOpen(true)}><Plus /><small>Add Goal</small></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function GoalCard({ goal, index, format, onMenu }: { goal: Goal; index: number; format: (value: number) => string; onMenu: (target: MenuTarget) => void }) {
  const colors = ['#2f86f6', '#4bc493', '#9d6bf4', '#ffb329'];
  const color = colors[index % colors.length];
  return (
    <article className="full-goal">
      <div className="goal-photo"><Flag /></div>
      <div className="goal-copy">
        <IconTile tone="blue"><Flag /></IconTile>
        <h2>{cleanGoalName(goal.name)}</h2>
        <p>{goal.category}</p>
        <strong>{format(goal.currentAmount)}</strong>
        <span>of {format(goal.targetAmount)}</span>
        <small>{goal.deadlineText}</small>
      </div>
      <div className="progress-ring goal-ring" style={ringStyle(goal.progress, color)}><b>{goal.progress}<sup>%</sup><small>Saved</small></b></div>
      <button className="more-button" type="button" aria-label={`Options for ${goal.name}`} onClick={() => onMenu({ title: cleanGoalName(goal.name), kind: 'goal' })}><MoreHorizontal /></button>
    </article>
  );
}

export function TransactionsPage() {
  const ui = useFinoraUi();
  const { transactions } = useApp();
  const { format } = useMoney();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeFilter = queryParams.get('type'); // 'income' | 'expense'

  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType = !typeFilter || transaction.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = `${transaction.title} ${transaction.category} ${transaction.accountName}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, query]);

  return (
    <AppPage subtitle="Track your money. Build your freedom." {...ui.shellProps}>
      <section className="page-heading">
        <h1>Transactions</h1>
        <p>
          {typeFilter 
            ? `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)} Transactions` 
            : 'Your recent activity, all in one place.'}
        </p>
      </section>
      <label className="inline-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" /></label>
      <DataPanel title="Recent Activity" action="Export" onAction={() => ui.menuAction('Export')}>
        {filtered.length ? filtered.slice(0, visibleCount).map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} format={format} onMenu={ui.setMenuTarget} />) : <EmptyState title="No transactions found" description="Try a different merchant, category or account." />}
        {filtered.length > visibleCount ? <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 8)}>Load more</button> : null}
      </DataPanel>
      <button className="fab" aria-label="Quick add transaction" type="button" onClick={() => ui.setQuickAddOpen(true)}><Plus /><small>Add</small></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function TransactionRow({ transaction, format, onMenu }: { transaction: Transaction; format: (value: number) => string; onMenu: (target: MenuTarget) => void }) {
  return (
    <button className="activity-row" type="button" onClick={() => onMenu({ title: transaction.title, kind: 'transaction' })}>
      <IconTile tone={transaction.type === 'income' ? 'mint' : 'blue'}>{transaction.type === 'income' ? 'In' : 'Out'}</IconTile>
      <span><b>{transaction.title}</b><small>{transaction.date} at {transaction.time} - {transaction.accountName}</small></span>
      <strong className={transaction.type === 'income' ? 'positive' : ''}>{transaction.type === 'income' ? '+' : '-'} {format(transaction.amount)}</strong>
    </button>
  );
}

export function ProfilePage() {
  const ui = useFinoraUi();
  const { user, logout, accounts, goals, transactions, notifications, updateUserProfile } = useApp();
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const saveProfile = () => {
    updateUserProfile(name, email);
    setEditing(false);
    ui.menuAction('Save profile');
  };

  return (
    <AppPage subtitle="You're doing great. Keep going." {...ui.shellProps}>
      <section className="profile-hero">
        <div className="profile-photo">JR</div>
        <div>
          {editing ? (
            <div className="profile-edit">
              <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Name" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email" />
              <button type="button" onClick={saveProfile}>Save</button>
            </div>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <small>Getting closer to freedom</small>
            </>
          )}
        </div>
        <div className="profile-stats">
          <span><i>G</i><b>{goals.length}</b><small>Goals</small></span>
          <span><i>A</i><b>{accounts.length}</b><small>Accounts</small></span>
          <span><i>T</i><b>{transactions.length}</b><small>Transactions</small></span>
          <span><i>N</i><b>{notifications.filter((item) => !item.isRead).length}</b><small>Unread</small></span>
        </div>
      </section>
      <SettingsGroup title="ACCOUNT" items={[['Personal Information', 'Update your name, email and phone number', () => setEditing(true)], ['Preferences', 'Currency, date format and language', () => ui.setSearchOpen(true)], ['Linked Accounts', 'Manage your banks and financial accounts', () => nav('/accounts')]]} />
      <SettingsGroup title="NOTIFICATIONS" items={[['Push Notifications', 'Manage what you want to be notified about', () => ui.setNotificationsOpen(true)], ['Email Notifications', 'Manage your email notification preferences', () => ui.setNotificationsOpen(true)], ['Reminder Settings', 'Bills, goals and important reminders', () => ui.setSearchOpen(true)]]} />
      <SettingsGroup title="SECURITY" items={[['Change Password', 'Keep your account secure', () => ui.menuAction('Change password')], ['Biometric & Passcode', 'Use biometric or passcode access', () => ui.menuAction('Passcode')], ['Two-Factor Authentication', 'Add an extra layer of security', () => ui.menuAction('Two-factor authentication')]]} />
      <SettingsGroup title="SUPPORT" items={[['Help Center', 'Find answers to common questions', () => ui.setSearchOpen(true)], ['Contact Support', "We're here to help you", () => ui.menuAction('Contact support')], ['Give Feedback', 'Help us make Finora better', () => ui.menuAction('Feedback')]]} />
      <button className="logout-row" type="button" onClick={() => { logout(); nav('/login'); }}>Log Out <ChevronRight /></button>
      <FinoraChrome ui={ui} />
    </AppPage>
  );
}

function SettingsGroup({ title, items }: { title: string; items: Array<[string, string, () => void]> }) {
  return (
    <section className="settings-group">
      <h2>{title}</h2>
      {items.map(([name, desc, action], index) => (
        <button key={name} type="button" onClick={action}>
          <IconTile tone={index === 1 ? 'mint' : index === 2 ? 'violet' : 'blue'}>{name.slice(0, 1)}</IconTile>
          <span><b>{name}</b><small>{desc}</small></span>
          {title === 'NOTIFICATIONS' && index < 2 ? <i className="switch-on" /> : <ChevronRight />}
        </button>
      ))}
    </section>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action ? <button type="button" onClick={onAction}>{action}</button> : null}
    </div>
  );
}

function DataPanel({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section className="settings-group transaction-list">
      <h2>{title}</h2>
      {action ? <button className="panel-action" type="button" onClick={onAction}>{action}</button> : null}
      {children}
    </section>
  );
}

function CurrencySelector({ code, onChange }: { code: CurrencyCode; onChange: (currency: string) => void }) {
  return (
    <label className="currency-pill">
      <span className="sr-only">Currency</span>
      <select value={code} onChange={(event) => onChange(event.target.value)}>
        {Object.keys(currencyMeta).map((currency) => <option key={currency}>{currency}</option>)}
      </select>
    </label>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <Search />
      <b>{title}</b>
      <p>{description}</p>
    </div>
  );
}

type DemoValues = {
  title?: string;
  name?: string;
  category?: string;
  amount?: string;
  limit?: string;
  spent?: string;
  savedAmount?: string;
  currentAmount?: string;
  targetAmount?: string;
  deadline?: string;
  account?: string;
  bankName?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
};

function DemoForm({
  fields,
  initial,
  onSubmit,
  submitLabel
}: {
  fields: Array<{ key: keyof DemoValues; label: string; type?: string; required?: boolean; placeholder?: string }>;
  initial?: DemoValues;
  onSubmit: (values: DemoValues) => void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<DemoValues>(initial || {});
  const [error, setError] = useState('');
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const missing = fields.find((field) => field.required && !String(values[field.key] || '').trim());
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    const amountField = fields.find((field) => ['amount', 'limit', 'targetAmount'].includes(field.key));
    if (amountField && Number(values[amountField.key] || 0) <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    setError('');
    onSubmit(values);
  };

  return (
    <form className="demo-form" onSubmit={submit}>
      {fields.map((field) => (
        <label key={field.key}>
          <span>{field.label}</span>
          {field.key === 'notes' ? (
            <textarea value={values[field.key] || ''} onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))} placeholder={field.placeholder} />
          ) : (
            <input
              value={values[field.key] || ''}
              type={field.type || 'text'}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
              placeholder={field.placeholder}
            />
          )}
        </label>
      ))}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="primary-button" type="submit">{submitLabel}</button>
    </form>
  );
}

function Overlay({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`modal-card ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function SearchModal({ open, onClose, recent, onSelect }: { open: boolean; onClose: () => void; recent: string[]; onSelect: (result: (typeof searchResults)[number]) => void }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => searchResults.filter((result) => `${result.title} ${result.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Overlay open={open} title="Search Finora" onClose={onClose} wide>
      <label className="modal-search"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Dashboard, Accounts, Goals..." /><button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X /></button></label>
      {!query && recent.length ? <div className="recent-searches"><b>Recent</b>{recent.map((item) => <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>)}</div> : null}
      <div className="result-list">
        {filtered.length ? filtered.map((result) => (
          <button key={result.title} type="button" onClick={() => onSelect(result)}>
            <IconTile>{result.title.slice(0, 1)}</IconTile>
            <span><b>{result.title}</b><small>{result.description}</small></span>
            <ChevronRight />
          </button>
        )) : <EmptyState title="No results found" description="Try Dashboard, Budget, Settings or Reports." />}
      </div>
    </Overlay>
  );
}

function NotificationPanel({
  open,
  onClose,
  notifications,
  setNotifications,
  markAllAsRead,
  clearNotifications
}: {
  open: boolean;
  onClose: () => void;
  notifications: ReturnType<typeof useApp>['notifications'];
  setNotifications: ReturnType<typeof useApp>['setNotifications'];
  markAllAsRead: () => void;
  clearNotifications: () => void;
}) {
  const markOneRead = (id: string) => setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, isRead: true } : item));
  return (
    <Overlay open={open} title="Notifications" onClose={onClose}>
      <div className="panel-toolbar">
        <button type="button" onClick={markAllAsRead}>Mark all as read</button>
        <button type="button" onClick={clearNotifications}>Clear</button>
      </div>
      <div className="notification-list">
        {notifications.length ? notifications.map((item) => (
          <button key={item.id} type="button" className={!item.isRead ? 'unread' : ''} onClick={() => markOneRead(item.id)}>
            <IconTile tone={item.type === 'bill' ? 'amber' : item.type === 'alert' ? 'rose' : 'mint'}>{item.type === 'bill' ? 'B' : item.type === 'alert' ? 'A' : 'S'}</IconTile>
            <span><b>{item.title}</b><small>{item.description}</small><em>{item.timeText}</em></span>
          </button>
        )) : <EmptyState title="All clear" description="You have no notifications right now." />}
      </div>
    </Overlay>
  );
}

function QuickAddModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (kind: QuickAddKind, values: DemoValues) => void }) {
  const [kind, setKind] = useState<QuickAddKind>('Expense');
  return (
    <Overlay open={open} title="Quick Add" onClose={onClose}>
      <div className="quick-kind-row">{quickKinds.map((item) => <button key={item} className={kind === item ? 'active' : ''} type="button" onClick={() => setKind(item)}>{item}</button>)}</div>
      <DemoForm
        key={kind}
        submitLabel={`Save ${kind}`}
        fields={[
          { key: 'title', label: `${kind} name`, required: true, placeholder: `${kind} title` },
          { key: 'category', label: 'Category', required: kind !== 'Account', placeholder: 'Food, Salary, Savings...' },
          { key: 'amount', label: 'Amount', type: 'number', required: kind !== 'Category', placeholder: '0.00' },
          { key: 'account', label: 'Account', placeholder: 'Emirates NBD' },
          { key: 'notes', label: 'Notes', placeholder: 'Optional note' }
        ]}
        onSubmit={(values) => onSave(kind, values)}
      />
    </Overlay>
  );
}

function BudgetModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (values: DemoValues) => void }) {
  return (
    <Overlay open={open} title="Add Budget" onClose={onClose}>
      <DemoForm
        submitLabel="Save Budget"
        fields={[
          { key: 'title', label: 'Budget name', required: true, placeholder: 'Food and dining' },
          { key: 'category', label: 'Category', required: true, placeholder: 'Food' },
          { key: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '1200' },
          { key: 'startDate', label: 'Start date', type: 'date', required: true },
          { key: 'endDate', label: 'End date', type: 'date', required: true },
          { key: 'notes', label: 'Notes', placeholder: 'Optional notes' }
        ]}
        onSubmit={onSave}
      />
    </Overlay>
  );
}

function GoalModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (values: DemoValues) => void }) {
  return (
    <Overlay open={open} title="Add Goal" onClose={onClose}>
      <DemoForm
        submitLabel="Save Goal"
        fields={[
          { key: 'name', label: 'Goal name', required: true, placeholder: 'Japan trip' },
          { key: 'targetAmount', label: 'Target amount', type: 'number', required: true, placeholder: '15000' },
          { key: 'savedAmount', label: 'Saved amount', type: 'number', required: true, placeholder: '2500' },
          { key: 'deadline', label: 'Deadline', type: 'date', required: true },
          { key: 'category', label: 'Category', required: true, placeholder: 'Experiences' },
          { key: 'notes', label: 'Notes', placeholder: 'Priority, status or notes' }
        ]}
        onSubmit={onSave}
      />
    </Overlay>
  );
}

function ContextMenu({ target, onClose, onAction }: { target: MenuTarget; onClose: () => void; onAction: (label: string) => void }) {
  const actions = [
    ['Edit', Edit3],
    ['Rename', Edit3],
    ['Duplicate', Copy],
    ['Archive', CalendarDays],
    ['Export', Download],
    ['Share', Share2],
    ['Delete', Trash2]
  ] as const;
  return (
    <Overlay open={Boolean(target)} title={target ? `${target.title} actions` : 'Actions'} onClose={onClose}>
      <div className="context-actions">
        {actions.map(([label, Icon]) => <button key={label} type="button" className={label === 'Delete' ? 'danger' : ''} onClick={() => onAction(label)}><Icon />{label}</button>)}
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </Overlay>
  );
}
