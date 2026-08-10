import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: LucideIcon;
  progress?: number; // 0 to 100
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  progress,
  accentColor = 'cyan',
}) => {
  const getBadgeStyle = () => {
    switch (accentColor) {
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  const getProgressColor = () => {
    switch (accentColor) {
      case 'purple':
        return 'bg-purple-500';
      case 'emerald':
        return 'bg-emerald-400';
      case 'amber':
        return 'bg-amber-400';
      default:
        return 'bg-cyan-400';
    }
  };

  return (
    <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${getBadgeStyle()} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">{value}</span>

        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {/* Optional Progress bar */}
      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        </div>
      )}

      {/* Subtext */}
      {subtext && <p className="text-[11px] text-slate-400 font-mono mt-2">{subtext}</p>}
    </div>
  );
};
