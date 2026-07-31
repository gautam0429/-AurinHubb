import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { LineChart } from '../components/ui/LineChart';
import { Switch } from '../components/ui/Switch';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Calendar,
  Lock,
  ChevronRight,
  ChevronDown,
  LogOut,
  Shield,
  Smartphone,
  Eye,
  Settings,
  MessageSquare,
  User as UserIcon,
  HelpCircle,
  Activity,
  Heart,
  Globe,
  Fingerprint,
  ChevronLeft,
  KeyRound,
  Plus,
  MoreVertical,
  TrendingDown,
  ArrowRight,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

// Helper for formatting currencies
const formatCurrency = (amount: number, currency = 'AED') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// ==========================================
// 1. SPLASH SCREEN
// ==========================================
export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate('/onboarding')}
      className="min-h-screen bg-gradient-to-b from-[#e3effd] via-[#f7fbfe] to-[#e8f1fc] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-between py-12 px-6 cursor-pointer select-none"
    >
      <div />
      
      {/* Center content */}
      <div className="flex flex-col items-center text-center animate-fade-in gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl shadow-xl shadow-blue-500/10">
          🌱
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">Finora</h1>
        <p className="text-sm font-medium text-slate-500">
          Financial freedom. <span className="text-brand-600">Beautifully simple.</span>
        </p>
      </div>

      {/* Bottom text */}
      <div className="text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest animate-pulse">
          Tap to start
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. ONBOARDING SCREEN
// ==========================================
export const OnboardingPage: React.FC = () => {
  const { setHasCompletedOnboarding } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setHasCompletedOnboarding(true);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <div className="flex justify-between items-center px-6 py-5">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Finora</div>
        <button 
          onClick={() => {
            setHasCompletedOnboarding(true);
            navigate('/home');
          }}
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:max-w-md md:mx-auto">
        {step === 1 ? (
          <div className="text-center flex flex-col items-center gap-6">
            {/* Visual Plant illustration wrapper */}
            <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-sky-100 to-emerald-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center relative shadow-inner">
              <span className="text-7xl">🪴</span>
              <div className="absolute top-4 right-4 text-xl">✨</div>
              <div className="absolute bottom-6 left-6 text-xl">💧</div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight">
                See your money <span className="text-brand-600 dark:text-brand-400 block">clearly, without the stress.</span>
              </h2>
              <p className="text-sm text-slate-455 dark:text-slate-450 leading-relaxed">
                Understand your finances in a simple, beautiful way. Track goals and budgets effortlessly.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-6">
            {/* Visual Road illustration wrapper */}
            <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-brand-100 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center relative shadow-inner">
              <span className="text-7xl">🏃‍♂️</span>
              <div className="absolute top-6 left-8 text-xl">🏞️</div>
              <div className="absolute bottom-6 right-8 text-xl">🎯</div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight">
                Every step brings <span className="text-brand-600 dark:text-brand-400 block">you closer to freedom.</span>
              </h2>
              <p className="text-sm text-slate-455 dark:text-slate-450 leading-relaxed">
                Stay focused, keep going, and enjoy the financial freedom and the life you dream of.
              </p>
            </div>
          </div>
        )}

        {/* Indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-8">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-5 bg-brand-600' : 'w-1.5 bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-5 bg-brand-600' : 'w-1.5 bg-slate-200 dark:bg-slate-800'}`} />
        </div>
      </div>

      {/* Button Action */}
      <div className="p-6 md:max-w-md md:mx-auto md:w-full">
        <Button 
          variant="gradient"
          fullWidth 
          onClick={handleNext}
          icon={<ChevronRight size={16} />}
        >
          {step === 1 ? 'Continue' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};

// ==========================================
// 3. HOME / DASHBOARD PAGE
// ==========================================
export const HomePage: React.FC = () => {
  const { user, upcomingBills, goals } = useApp();
  const [netWorthType, setNetWorthType] = useState<'assets' | 'all'>('assets');
  
  // Dynamic calculation values
  const assetsAmount = 185420;
  const receivables = 18500;
  const payables = 7300;
  const displayNetWorth = netWorthType === 'assets' ? assetsAmount : (assetsAmount + receivables - payables);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* 1. Overview Grid: Net Worth + Health Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Net Worth Card */}
        <Card className="lg:col-span-2 flex flex-col justify-between gap-5 dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
          <div className="z-10">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Net Worth
            </span>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                AED {displayNetWorth.toLocaleString()}
              </h3>
            </div>
            
            {/* Base currency info */}
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-500">
              <span>Base Currency:</span>
              <Badge variant="brand">🇦🇪 AED</Badge>
            </div>
          </div>

          {/* Selector Switch tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full sm:max-w-xs z-10">
            <button
              onClick={() => setNetWorthType('assets')}
              className={`flex-1 py-2 text-center text-xs font-extrabold rounded-xl transition-all ${
                netWorthType === 'assets'
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Current Assets
            </button>
            <button
              onClick={() => setNetWorthType('all')}
              className={`flex-1 py-2 text-center text-xs font-extrabold rounded-xl transition-all ${
                netWorthType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Payables & Receiv.
            </button>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <DollarSign size={200} className="text-brand-500" />
          </div>
        </Card>

        {/* Health Ring Card */}
        <Card className="flex flex-col items-center justify-center text-center p-6 gap-3.5 dark:bg-slate-900 dark:border-slate-800">
          <ProgressCircle
            percentage={user.financialHealth}
            size={110}
            strokeWidth={8}
            colorClass="stroke-brand-600 dark:stroke-brand-500"
            trackColorClass="stroke-slate-100 dark:stroke-slate-800"
            showText={true}
            textElement={
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">
                  {user.financialHealth}%
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                  Health
                </span>
              </div>
            }
          />
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
              Health Status: <span className="text-emerald-500">{user.financialHealthLabel}</span>
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mt-1">
              You're doing fantastic! 82% of your parameters are completely synced.
            </p>
          </div>
        </Card>
      </div>

      {/* 2. Horizontal Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Receivables Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold shadow-inner">
            📥
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Receivables</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED {receivables.toLocaleString()}</h5>
            <p className="text-[8px] font-bold text-emerald-600 mt-0.5">3 pending requests</p>
          </div>
        </Card>

        {/* Payables Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 flex items-center justify-center text-sm font-bold shadow-inner">
            📤
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Payables</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED {payables.toLocaleString()}</h5>
            <p className="text-[8px] font-bold text-rose-500 mt-0.5">Due in 5 days</p>
          </div>
        </Card>

        {/* Investments Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold shadow-inner">
            📈
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Investments</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED 96,200</h5>
            <p className="text-[8px] font-bold text-emerald-600 mt-0.5">↑ 8.2% this month</p>
          </div>
        </Card>

        {/* Loans Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold shadow-inner">
            💼
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Loans</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED 12,000</h5>
            <p className="text-[8px] font-bold text-amber-500 mt-0.5">2 active loans</p>
          </div>
        </Card>

        {/* Cash Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold shadow-inner">
            💵
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Cash</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED 5,400</h5>
            <p className="text-[8px] font-bold text-slate-500 mt-0.5">3 base currencies</p>
          </div>
        </Card>

        {/* Bank Accounts Card */}
        <Card padding="sm" className="flex flex-col gap-2 dark:bg-slate-900 dark:border-slate-850 hover:shadow-card-hover cursor-pointer transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold shadow-inner">
            🏦
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Bank Accounts</p>
            <h5 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AED 73,000</h5>
            <p className="text-[8px] font-bold text-slate-500 mt-0.5">5 active accounts</p>
          </div>
        </Card>
      </div>

      {/* 3. Goals Progress Carousel/Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Active Goals Progress
          </h4>
          <a href="#/goals" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            View all goals
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {goals.slice(0, 3).map((goal) => (
            <Card 
              key={goal.id} 
              padding="sm" 
              className="w-80 shrink-0 snap-start flex items-center gap-4 dark:bg-slate-900 dark:border-slate-800 hover:scale-[1.01] transition-transform"
            >
              {/* Left visual representation */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl shadow-inner">
                {goal.imageKey === 'bali' ? '✈️' : goal.imageKey === 'home' ? '🏡' : goal.imageKey === 'car' ? '🚗' : '🛡️'}
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{goal.name}</h5>
                <p className="text-[9px] text-slate-400 font-semibold">{goal.category}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white">AED {goal.currentAmount.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-450 dark:text-slate-550 font-bold">/ {goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Right Ring */}
              <ProgressCircle
                percentage={goal.progress}
                size={44}
                strokeWidth={4.5}
                colorClass="stroke-brand-600 dark:stroke-brand-500"
                trackColorClass="stroke-slate-100 dark:stroke-slate-800"
              />
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Lower Row: Trend Chart + Upcoming Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend line chart */}
        <Card className="flex flex-col justify-between gap-5 dark:bg-slate-900 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Net Worth Trend
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">+AED 18,750</h3>
              <Badge variant="success">↑ 11.2% this month</Badge>
            </div>
          </div>

          {/* SVG line chart path wrapper */}
          <div className="h-44 w-full">
            <LineChart 
              data={[110000, 115000, 125000, 120050, 130000, 140000, 150000, 145000, 160000, 175000, 185420]} 
              fillGradientId="home-trend-grad"
              strokeColor="#3b82f6"
            />
          </div>

          <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[9px] font-bold text-slate-400 dark:text-slate-500">
            <span>May 1</span>
            <span>May 8</span>
            <span>May 15</span>
            <span>May 22</span>
            <span>May 29</span>
            <span>May 31</span>
          </div>
        </Card>

        {/* Upcoming Bills List */}
        <Card className="flex flex-col justify-between gap-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Upcoming Bills & Credits
            </span>
            <a href="#/budgets" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
              View details
            </a>
          </div>

          <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800/40">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors px-1.5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-inner ${
                    bill.isExpense ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}>
                    {bill.isExpense ? '📅' : '💰'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">{bill.title}</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">{bill.date} • {bill.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-extrabold ${bill.isExpense ? 'text-slate-700 dark:text-slate-350' : 'text-emerald-500'}`}>
                    {bill.isExpense ? '-' : '+'} {bill.currency} {bill.amount.toLocaleString()}
                  </span>
                  <span className={`block text-[9px] font-bold mt-0.5 ${bill.isExpense ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {bill.dueDateText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};

// ==========================================
// 4. ACCOUNTS PAGE
// ==========================================
export const AccountsPage: React.FC = () => {
  const { accounts } = useApp();
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Top Header info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-805 dark:text-white tracking-tight">Accounts</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">All your financial accounts in one place.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-100 dark:border-emerald-950/50 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All accounts synced Just Now</span>
        </div>
      </div>

      {/* Overview Balance Card with Mini Line chart */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Total Balance
          </span>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1">
            AED 185,420
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold mt-1">
            Across {accounts.length} accounts
          </p>
        </div>

        {/* Mini rising trend chart */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div className="w-36 h-12">
            <LineChart 
              data={[140000, 148000, 145000, 152000, 160000, 170000, 165000, 185420]}
              fillGradientId="accounts-mini-grad"
              strokeColor="#3b82f6"
            />
          </div>
          <div className="shrink-0 text-right">
            <Badge variant="success">↑ 8.2%</Badge>
            <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">vs last month</span>
          </div>
        </div>
      </Card>

      {/* Grid List of bank cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          // Approximate INR conversion for HDFC / ICICI for visual feedback
          const displayApprox = acc.currency !== 'AED';
          const approxAED = displayApprox ? (acc.balance * 0.045) : acc.balance;

          return (
            <Card 
              key={acc.id} 
              padding="none" 
              className="overflow-hidden hover:shadow-card-hover hover:scale-[1.005] cursor-pointer transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="p-5 flex items-start justify-between gap-4">
                
                {/* Bank icon styling */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0 uppercase ${
                    acc.logoKey === 'emirates' ? 'bg-blue-600'
                    : acc.logoKey === 'adcb' ? 'bg-emerald-600'
                    : acc.logoKey === 'sbi' ? 'bg-sky-500'
                    : acc.logoKey === 'mashreq' ? 'bg-orange-500'
                    : acc.logoKey === 'wahed' ? 'bg-purple-600'
                    : acc.logoKey === 'hdfc' ? 'bg-blue-800'
                    : acc.logoKey === 'icici' ? 'bg-indigo-900'
                    : 'bg-slate-500'
                  }`}>
                    {acc.bankName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                      {acc.bankName}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                      {acc.name} • {acc.lastFourDigits}
                    </p>
                  </div>
                </div>

                {/* Account sync badge / Action dots */}
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    acc.isSynced 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700/50'
                  }`}>
                    {acc.isSynced ? '✓ Synced' : 'Not Synced'}
                  </span>
                  <button className="text-slate-350 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300">
                    <MoreVertical size={16} />
                  </button>
                </div>

              </div>

              {/* Lower Balance footer display */}
              <div className="px-5 py-3 border-t border-slate-50 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/40 flex justify-between items-baseline">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Balance
                </span>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">
                    {acc.currency} {formatCurrency(acc.balance)}
                  </span>
                  {displayApprox && (
                    <span className="block text-[10px] text-slate-400 dark:text-slate-650 font-bold mt-0.5">
                      ≈ AED {formatCurrency(approxAED)}
                    </span>
                  )}
                </div>
              </div>

            </Card>
          );
        })}

        {/* Add Account Dashed button */}
        <Card variant="dashed" padding="lg" className="flex flex-col items-center justify-center text-center gap-2 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-550 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Account</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Add bank, cash, investment or loan</p>
          </div>
        </Card>
      </div>

    </div>
  );
};

// ==========================================
// 5. TRANSACTIONS PAGE
// ==========================================
export const TransactionsPage: React.FC = () => {
  const { transactions } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories list chips
  const categories = ['All', 'Salary', 'Shopping', 'Transport', 'Utilities', 'Entertainment', 'Food & Dining', 'Refunds'];

  // Filter transactions based on category chips & query input
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          t.accountName.toLowerCase().includes(filterQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || t.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Group transactions by date string
  const groupedTransactions = filteredTransactions.reduce((groups, t) => {
    const date = t.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-20 relative">
      
      {/* Title */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold text-slate-805 dark:text-white tracking-tight">Transactions</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Track your money. Build your freedom.</p>
      </div>

      {/* Search Input bar */}
      <div className="relative px-1">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Search transaction logs..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 outline-none text-xs font-semibold shadow-premium-card text-slate-800 dark:text-white"
        />
        <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
        <button className="absolute right-4 top-3 text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <Filter size={14} />
        </button>
      </div>

      {/* Horizontal Category chips scroll bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 snap-x px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all snap-start ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow shadow-brand-500/10'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Log list items grouped by date */}
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <Card className="py-12 text-center text-slate-400 dark:text-slate-550 dark:bg-slate-900 dark:border-slate-800">
            No transaction records found matching your selection.
          </Card>
        ) : (
          sortedDates.map((dateStr) => {
            const list = groupedTransactions[dateStr];
            
            // Format nice human date: e.g. "Today, 25 Jul 2025"
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            
            let displayHeader = formattedDate;
            const todayStr = new Date().toISOString().split('T')[0];
            if (dateStr === todayStr) {
              displayHeader = `Today • ${formattedDate}`;
            } else if (dateStr === '2025-07-25') {
              displayHeader = `Today • 25 Jul 2025`; // Alignment for demo dates
            } else if (dateStr === '2025-07-24') {
              displayHeader = `Yesterday • 24 Jul 2025`;
            }

            // Sum Income & Expense
            const dayIncome = list.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const dayExpense = list.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            return (
              <div key={dateStr} className="space-y-2">
                {/* Date header with daily sums */}
                <div className="flex justify-between items-baseline px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>{displayHeader}</span>
                  <div className="flex gap-2">
                    {dayIncome > 0 && <span className="text-emerald-500">+AED {dayIncome.toLocaleString()}</span>}
                    {dayExpense > 0 && <span className="text-slate-500 dark:text-slate-400">-AED {dayExpense.toLocaleString()}</span>}
                  </div>
                </div>

                {/* Group transactions list cards */}
                <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                    {list.map((t) => (
                      <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-3">
                          
                          {/* Category icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-inner shrink-0 ${
                            t.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          }`}>
                            {t.title.includes('Coffee') ? '☕' 
                              : t.title.includes('Uber') ? '🚗' 
                              : t.title.includes('Amazon') ? '🛍️'
                              : t.title.includes('Spotify') ? '🎵'
                              : t.title.includes('Netflix') ? '📺'
                              : t.title.includes('Bill') ? '🔌'
                              : t.type === 'income' ? '💰' : '💸'}
                          </div>

                          <div>
                            <h5 className="font-bold text-slate-850 dark:text-slate-100 text-xs leading-tight">
                              {t.title}
                            </h5>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {t.accountName} • {t.time}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <span className={`text-xs font-extrabold ${
                          t.type === 'income' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {t.type === 'income' ? '+' : '-'} {t.currency} {t.amount.toLocaleString()}
                        </span>

                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-20 right-6 p-4.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-fab hover:scale-105 duration-150 z-20 flex items-center justify-center">
        <Plus size={20} />
      </button>

    </div>
  );
};

// ==========================================
// 6. BUDGETS PAGE
// ==========================================
export const BudgetsPage: React.FC = () => {
  const { budgets } = useApp();
  
  return (
    <div className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* Title */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold text-slate-805 dark:text-white tracking-tight">Budgets</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Let's make today a step closer to freedom.</p>
      </div>

      {/* Overview Donut Ring Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center gap-6 relative overflow-hidden">
        <div className="z-10">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Monthly Overview
          </span>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1">
            AED 4,820
          </h3>
          <p className="text-xs text-slate-450 dark:text-slate-550 font-bold mt-1">
            of AED 8,500 budget limit
          </p>
          <div className="mt-3.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 inline-block">
            You're doing great! 43% of your budget used.
          </div>
        </div>

        {/* Ring circle */}
        <div className="shrink-0 z-10">
          <ProgressCircle
            percentage={43}
            size={90}
            strokeWidth={7}
            colorClass="stroke-brand-600 dark:stroke-brand-500"
            trackColorClass="stroke-slate-100 dark:stroke-slate-800"
            showText={true}
            textElement={
              <div className="flex flex-col items-center">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">43%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest uppercase">Used</span>
              </div>
            }
          />
        </div>
        
        {/* Abstract background mountain graphic */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-28 h-28 bg-brand-500 rounded-full blur-2xl" />
      </Card>

      {/* Receivables vs Payables Splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receivables today */}
        <Card className="dark:bg-slate-900 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
              Receivables Today
            </span>
            <Badge variant="success">2 items</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center">AA</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">Ahmed Ali</span>
              </div>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">AED 1,500</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center">SM</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">Sara Mohamed</span>
              </div>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">AED 950</span>
            </div>
          </div>
        </Card>

        {/* Payables today */}
        <Card className="dark:bg-slate-900 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
              Payables Today
            </span>
            <Badge variant="warning">3 items</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-850 dark:text-slate-200">Etisalat</span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">AED 200</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-850 dark:text-slate-200">Car Loan EMI</span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">AED 850</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-850 dark:text-slate-200">Spotify</span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">AED 230</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Your budgets categories detail list */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
          Your Budgets
        </h4>

        <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
            {budgets.map((b) => {
              const pct = Math.floor((b.spent / b.limit) * 100);
              
              return (
                <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Category Icon */}
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shadow-inner shrink-0">
                      {b.category === 'Housing' ? '🏠' 
                        : b.category.includes('Food') ? '🍔' 
                        : b.category === 'Transport' ? '🚗'
                        : b.category === 'Shopping' ? '🛍️'
                        : b.category.includes('Health') ? '❤️' : '🎬'}
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-850 dark:text-slate-100 text-xs leading-none">
                        {b.category}
                      </h5>
                      <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold mt-1">
                        AED {b.spent.toLocaleString()} of {b.limit.toLocaleString()} limit
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-1 h-1 rounded-full ${b.status === 'good' ? 'bg-emerald-500' : b.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className={`text-[8px] font-bold ${b.status === 'good' ? 'text-emerald-500' : b.status === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>
                          {b.statusText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Circle progress */}
                  <div className="flex items-center gap-2">
                    <ProgressCircle
                      percentage={pct}
                      size={44}
                      strokeWidth={4}
                      colorClass={b.status === 'good' ? 'stroke-emerald-500' : b.status === 'warning' ? 'stroke-amber-500' : 'stroke-rose-500'}
                      trackColorClass="stroke-slate-100 dark:stroke-slate-800"
                    />
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>

                </div>
              );
            })}
          </div>
        </Card>
      </div>

    </div>
  );
};

// ==========================================
// 7. GOALS PAGE
// ==========================================
export const GoalsPage: React.FC = () => {
  const { goals } = useApp();
  
  return (
    <div className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-805 dark:text-white tracking-tight">Goals</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Your dreams. Your plan. Your freedom.</p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm">
          <span>Active Goals</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* List of Goal Cards */}
      <div className="space-y-4">
        {goals.map((goal) => {
          return (
            <Card 
              key={goal.id} 
              padding="none" 
              className="overflow-hidden dark:bg-slate-900 dark:border-slate-800 hover:shadow-card-hover hover:scale-[1.005] transition-all flex flex-col sm:flex-row items-stretch"
            >
              {/* Left landscape color placeholder card */}
              <div className={`w-full sm:w-36 shrink-0 flex items-center justify-center p-6 text-3xl font-bold bg-gradient-to-br relative ${
                goal.imageKey === 'lake' ? 'from-emerald-400 to-teal-500 text-emerald-950'
                : goal.imageKey === 'bali' ? 'from-sky-400 to-blue-500 text-sky-950'
                : goal.imageKey === 'home' ? 'from-indigo-400 to-blue-500 text-indigo-950'
                : goal.imageKey === 'car' ? 'from-purple-400 to-pink-500 text-purple-950'
                : 'from-amber-400 to-orange-500 text-amber-950'
              }`}>
                {goal.imageKey === 'lake' ? '🛡️' : goal.imageKey === 'bali' ? '✈️' : goal.imageKey === 'home' ? '🏡' : goal.imageKey === 'car' ? '🚗' : '🎓'}
                
                {/* Visual texture */}
                <div className="absolute inset-0 bg-white/5 opacity-40 pointer-events-none" />
              </div>

              {/* Goal parameters detail card */}
              <div className="flex-1 p-5 flex items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 pr-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest leading-none">
                      {goal.category}
                    </h4>
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 truncate mt-1">
                      {goal.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">AED {goal.currentAmount.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-650 font-bold">/ {goal.targetAmount.toLocaleString()}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100/50 dark:border-slate-800/50 mt-1.5">
                    <span>⏳ {goal.deadlineText}</span>
                  </div>
                </div>

                {/* Right Ring */}
                <div className="flex items-center gap-3 shrink-0">
                  <ProgressCircle
                    percentage={goal.progress}
                    size={56}
                    strokeWidth={5}
                    colorClass={goal.progress === 100 ? 'stroke-emerald-500' : 'stroke-brand-600 dark:stroke-brand-500'}
                    trackColorClass="stroke-slate-100 dark:stroke-slate-800"
                    showText={true}
                    textElement={
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">{goal.progress}%</span>
                        <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Saved</span>
                      </div>
                    }
                  />
                  <button className="text-slate-350 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300">
                    <MoreVertical size={16} />
                  </button>
                </div>

              </div>

            </Card>
          );
        })}

        {/* Add Goal dashed box button */}
        <Card variant="dashed" padding="lg" className="flex flex-col items-center justify-center text-center gap-2 dark:border-slate-850 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-550 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Goal</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Dream it. Plan it. Achieve it.</p>
          </div>
        </Card>
      </div>

    </div>
  );
};

// ==========================================
// 8. PROFILE PAGE (INTERACTIVE)
// ==========================================
export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, logout, goals, accounts, transactions } = useApp();
  const navigate = useNavigate();

  // Edit Profile Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggles states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(editName, editEmail);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-10">
      
      {/* 1. Header Card (Background and stats) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
        {/* User avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-brand-100 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-3xl font-bold text-brand-600">
            {user.name.charAt(0)}
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-600 text-white shadow border border-white dark:border-slate-800 cursor-pointer hover:bg-brand-700 transition-colors">
            <span className="text-xs">📸</span>
          </div>
        </div>

        {/* User details */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{user.name}</h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{user.email}</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-100 dark:border-emerald-950/50">
            <span>🌱 Getting closer to freedom</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-4 gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{goals.length}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Goals</p>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{accounts.length}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Accounts</p>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{transactions.length}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Trans.</p>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">92%</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">On Track</p>
          </div>
        </div>
      </div>

      {/* 2. Account Sections */}
      <div className="space-y-4">
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">
            Account
          </h4>
          <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Personal Information */}
            <div 
              onClick={() => {
                setEditName(user.name);
                setEditEmail(user.email);
                setIsEditModalOpen(true);
              }}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserIcon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Personal Information</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Update your name, email and phone number</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Preferences */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Preferences</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Currency, date format and language</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Linked Accounts */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Linked Accounts</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Manage your banks and financial accounts</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </Card>
        </div>

        {/* 3. Notifications settings */}
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">
            Notifications
          </h4>
          <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Push Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Manage what you want to be notified about</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onChange={setPushEnabled} id="toggle-push" />
            </div>

            {/* Email Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Manage your email notification preferences</p>
                </div>
              </div>
              <Switch checked={emailEnabled} onChange={setEmailEnabled} id="toggle-email" />
            </div>

            {/* Reminder Settings */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Settings size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Reminder Settings</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Bills, goals and important reminders</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </Card>
        </div>

        {/* 4. Security options */}
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">
            Security
          </h4>
          <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Change password -> security page */}
            <div 
              onClick={() => navigate('/profile/security')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change Password</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Keep your account secure</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Passcode */}
            <div 
              onClick={() => navigate('/profile/security')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Fingerprint size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric & Passcode</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Use Face ID / Touch ID or passcode</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* 2FA */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Two-Factor Authentication</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Add an extra layer of security</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </Card>
        </div>

        {/* 5. Support options */}
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">
            Support
          </h4>
          <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Help */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <HelpCircle size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Help Center</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Find answers to common questions</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Support */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Contact Support</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">We're here to help you</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Feedback */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Heart size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Give Feedback</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Help us make Finora better</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </Card>
        </div>

        {/* 6. Logout action */}
        <div className="pt-2">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-950/30 rounded-2xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </div>

      {/* ================= EDIT INFORMATION MODAL ================= */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Personal Information">
        <form onSubmit={handleProfileSave} className="space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold text-center border border-emerald-100 dark:border-emerald-900">
              ✓ Information saved successfully!
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white text-slate-800 dark:text-slate-200 outline-none text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white text-slate-800 dark:text-slate-200 outline-none text-xs font-medium"
            />
          </div>
          <div className="pt-2">
            <Button type="submit" variant="gradient" fullWidth>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

// ==========================================
// 9. SECURITY PAGE (INTERACTIVE)
// ==========================================
export const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-10">
      {/* Custom Header back navigation trigger */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <button
          onClick={() => navigate('/profile')}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Go Back</span>
      </div>

      {/* Premium illustration Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 shadow-lg flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
        <div className="space-y-1.5 flex-1 z-10 text-center md:text-left">
          <h3 className="text-lg font-extrabold tracking-tight">Your security, your peace of mind</h3>
          <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
            Simple settings to keep your account safe and secure. Modify PIN settings or active sessions in real-time.
          </p>
        </div>
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-inner z-10 text-4xl">
          🛡️
        </div>
        {/* Subtle blur circles background */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-xl" />
      </div>

      {/* Security Actions Cards */}
      <div className="space-y-4">
        <Card padding="none" className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          
          {/* Change PIN */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change PIN</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Update your 4-digit PIN to keep your account secure</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>

          {/* Biometric Login */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Fingerprint size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric Login</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Use your fingerprint or face to login quickly and securely</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400">{biometricEnabled ? 'Enabled' : 'Disabled'}</span>
              <Switch checked={biometricEnabled} onChange={setBiometricEnabled} id="toggle-bio" />
            </div>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Lock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change Password</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Choose a strong password to protect your account</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>

          {/* Active Sessions */}
          <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Sessions</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">See where you're logged in and manage active sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="brand">2 active</Badge>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        </Card>

        {/* Protection card info */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-brand-50/50 to-indigo-50/20 dark:from-slate-900 dark:to-slate-800/30 border border-slate-100 dark:border-slate-800/50 flex gap-4 items-start shadow-sm">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 text-lg">
            🛡️
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">You're protected</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold mt-0.5">
              We use industry-standard encryption protocols and secure bank syncing procedures to keep your private data safe.
            </p>
          </div>
        </div>

        {/* Need Help trigger block */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-premium-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold">
              🎧
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Need help?</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Our security support is here for you</p>
            </div>
          </div>
          <button className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
            Contact Support
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
