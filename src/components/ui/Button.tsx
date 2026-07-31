import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'fab';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm rounded-2xl',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-95 shadow-md shadow-blue-500/10 rounded-2xl',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-2xl',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 rounded-2xl',
    text: 'bg-transparent text-brand-600 hover:text-brand-700 px-0 py-0'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2',
    fab: 'p-4 rounded-full bg-brand-600 text-white shadow-fab hover:scale-105 active:scale-95 duration-150'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  );
};
