'use client';

import { cn } from '@/lib/tienIch';
import type { Emotion } from '@/lib/duLieuGiaLap';
import { emotionColors } from '@/lib/duLieuGiaLap';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Smile, Frown, Moon, Flame, Heart, Clock, Zap, AlertCircle } from 'lucide-react';

const emotionIcons: Record<Emotion, typeof Smile> = {
  happy: Smile,
  sad: Frown,
  calm: Moon,
  angry: Flame,
  romantic: Heart,
  nostalgic: Clock,
  energetic: Zap,
  stressed: AlertCircle,
};

interface MoodBadgeProps {
  emotion?: Emotion;
  mood?: Emotion;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export function MoodBadge({ 
  emotion, 
  mood,
  size = 'md', 
  showIcon = true, 
  showLabel = true,
  className,
  animated = false
}: MoodBadgeProps) {
  const { t } = useTheme();
  const trangThai = emotion ?? mood ?? 'happy';
  const colors = emotionColors[trangThai];
  const Icon = emotionIcons[trangThai];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-300',
        colors.bg,
        colors.text,
        sizeClasses[size],
        animated && 'animate-pulse-glow',
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {showLabel && <span>{t(trangThai)}</span>}
    </span>
  );
}
