import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Strict frontend validations
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (email !== 'demo@finora.app' || password !== 'Finora@123') {
      setError('Invalid email or password. Please use the demo credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate auth check latency
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      
      if (success) {
        navigate('/home');
      } else {
        setError('Authentication failed. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3effd] via-[#f8fafd] to-[#e8f1fc] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/10">
          🌱
        </div>
        <h2 className="text-3xl font-extrabold text-slate-805 dark:text-white tracking-tight">
          Welcome to Finora
        </h2>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          Sign in to access your accounts and logs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="px-6 py-8 md:px-10 dark:bg-slate-900 dark:border-slate-850">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 rounded-2xl text-xs font-semibold leading-relaxed border border-rose-100 dark:border-rose-900/30 animate-shake">
                {error}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@finora.app"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/55 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-sm text-slate-750 dark:text-slate-200 transition-all font-medium"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-450" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#/login" className="text-[10px] font-bold text-brand-600 dark:text-brand-450 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/55 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-sm text-slate-750 dark:text-slate-200 transition-all font-medium"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-450" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Credentials hints for quick assessment evaluation */}
        <div className="mt-6 p-4 text-center text-[11px] text-slate-400 dark:text-slate-550 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 leading-relaxed max-w-sm mx-auto shadow-sm">
          💡 <span className="font-bold">Demo Account Access</span>:<br />
          Email: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300">demo@finora.app</code><br />
          Password: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300">Finora@123</code>
        </div>

      </div>
    </div>
  );
};
