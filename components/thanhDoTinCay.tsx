'use client';

import { cn } from '@/lib/tienIch';

interface ConfidenceBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: 'primary' | 'secondary' | 'accent';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function ConfidenceBar({
  label,
  value,
  maxValue = 100,
  color = 'primary',
  showPercentage = true,
  size = 'md',
  animated = true,
  className,
}: ConfidenceBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const colorClasses = {
<<<<<<< HEAD
    primary: 'bg-[var(--brand-accent)]',
    secondary: 'bg-[var(--song-primary)]',
=======
    primary: 'bg-[var(--song-primary)]',
    secondary: 'bg-[var(--song-secondary)]',
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
    accent: 'bg-[var(--song-accent)]',
  };

  const glowClasses = {
    primary: 'shadow-[0_0_10px_var(--song-glow)]',
    secondary: 'shadow-[0_0_8px_var(--song-glow)]',
    accent: 'shadow-[0_0_6px_var(--song-glow)]',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {showPercentage && (
          <span className="text-sm font-medium text-foreground tabular-nums">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className={cn(
<<<<<<< HEAD
        'w-full overflow-hidden rounded-full bg-white/8',
=======
        'w-full rounded-full bg-secondary/50 overflow-hidden',
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            colorClasses[color],
            animated && glowClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
