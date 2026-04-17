'use client';

import { cn } from '@/lib/tienIch';
import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function InsightCard({ title, value, subtitle, icon: Icon, trend, className }: InsightCardProps) {
  return (
    <div className={cn(
<<<<<<< HEAD
      'rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(33,33,33,0.96),rgba(22,22,22,0.94))] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.28)]',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(30,215,96,0.12)]">
          <Icon className="h-5 w-5 text-[var(--brand-accent)]" />
=======
      'glass rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--song-primary)]" />
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.isPositive 
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
