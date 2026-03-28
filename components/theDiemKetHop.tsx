'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Activity } from 'lucide-react';

interface FusionScoreCardProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FusionScoreCard({ className, size = 'md' }: FusionScoreCardProps) {
  const { fusionScore, t } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-[var(--song-primary)]';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 85) return 'shadow-emerald-500/30';
    if (score >= 70) return 'shadow-[var(--song-glow)]';
    if (score >= 50) return 'shadow-amber-500/30';
    return 'shadow-red-500/30';
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  };

  const ringSize = {
    sm: 56,
    md: 84,
    lg: 112,
  };

  const strokeWidth = {
    sm: 4,
    md: 5,
    lg: 6,
  };

  const radius = (ringSize[size] - strokeWidth[size] * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fusionScore / 100) * circumference;

  return (
    <div className={cn('glass rounded-2xl p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-[var(--song-primary)]" />
        <span className="text-sm font-medium text-foreground">{t('fusionScore')}</span>
      </div>
      <div className="flex items-center justify-center">
        <div className={cn('relative', sizeClasses[size])}>
          <svg 
            className="w-full h-full -rotate-90"
            viewBox={`0 0 ${ringSize[size]} ${ringSize[size]}`}
          >
            {/* Background circle */}
            <circle
              cx={ringSize[size] / 2}
              cy={ringSize[size] / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth[size]}
              className="text-secondary"
            />
            {/* Progress circle */}
            <circle
              cx={ringSize[size] / 2}
              cy={ringSize[size] / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth[size]}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-700 ease-out',
                getScoreColor(fusionScore)
              )}
            />
          </svg>
          <div className={cn(
            'absolute inset-0 flex items-center justify-center font-bold tabular-nums',
            getScoreColor(fusionScore)
          )}>
            {fusionScore}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        {fusionScore >= 85 
          ? (t('confidence') === 'Độ tin cậy' ? 'Rất chính xác' : 'Very accurate')
          : fusionScore >= 70
          ? (t('confidence') === 'Độ tin cậy' ? 'Chính xác' : 'Accurate')
          : (t('confidence') === 'Độ tin cậy' ? 'Đang cải thiện' : 'Improving')
        }
      </p>
    </div>
  );
}
