import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'dashed' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-3xl transition-all duration-200';
  
  const variants = {
    default: 'shadow-premium-card border border-slate-100/50',
    interactive: 'shadow-premium-card border border-slate-100/50 hover:shadow-card-hover hover:scale-[1.01] cursor-pointer',
    dashed: 'border-2 border-dashed border-slate-200 bg-transparent hover:border-brand-300 hover:bg-slate-50/50 cursor-pointer',
    gradient: 'bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3 md:p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8'
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
