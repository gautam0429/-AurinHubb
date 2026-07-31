import React from 'react';

interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillGradientId?: string;
  fillColorStart?: string;
  fillColorEnd?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 300,
  height = 100,
  strokeColor = '#3b82f6',
  fillGradientId = 'chart-grad',
  fillColorStart = 'rgba(59, 130, 246, 0.25)',
  fillColorEnd = 'rgba(59, 130, 246, 0)'
}) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  
  const points = data.map((val, idx) => {
    const x = idx * stepX;
    // Keep 10px buffer top/bottom to prevent clipping
    const y = height - ((val - min) / range) * (height - 20) - 10;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x},${p.y}` : ` L ${p.x},${p.y}`);
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColorStart} />
          <stop offset="100%" stopColor={fillColorEnd} />
        </linearGradient>
      </defs>
      {/* Area Fill */}
      <path d={areaD} fill={`url(#${fillGradientId})`} />
      {/* Stroke Path Line */}
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots on points */}
      {points.map((p, idx) => {
        // Draw dots for start, middle, end points for visual polish
        if (idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1) {
          return (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-white stroke-brand-600 stroke-[2px]"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};
