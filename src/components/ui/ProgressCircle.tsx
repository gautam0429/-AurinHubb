import React from 'react';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackColorClass?: string;
  showText?: boolean;
  textElement?: React.ReactNode;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 60,
  strokeWidth = 5,
  colorClass = 'stroke-brand-600',
  trackColorClass = 'stroke-slate-100',
  showText = true,
  textElement
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, Math.min(100, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track Ring */}
        <circle
          className={`fill-none ${trackColorClass}`}
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Ring */}
        <circle
          className={`fill-none transition-all duration-500 ease-out ${colorClass}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {textElement ? (
            textElement
          ) : (
            <span className="text-sm font-bold text-slate-800">{percentage}%</span>
          )}
        </div>
      )}
    </div>
  );
};
