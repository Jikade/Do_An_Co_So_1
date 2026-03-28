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
      'glass rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--song-primary)]" />
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
