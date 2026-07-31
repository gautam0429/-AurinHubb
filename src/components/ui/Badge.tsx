import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'brand';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold';
  
  const variants = {
    success: 'bg-emerald-50 text-emerald-600',
    danger: 'bg-rose-50 text-rose-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600',
    brand: 'bg-blue-50 text-blue-600',
    neutral: 'bg-slate-100 text-slate-600'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {icon && <span className="flex items-center text-[10px]">{icon}</span>}
      {children}
    </span>
  );
};
