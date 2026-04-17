'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Crown, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpgradeCardProps {
  className?: string;
  variant?: 'banner' | 'compact' | 'full';
}

export function UpgradeCard({ className, variant = 'banner' }: UpgradeCardProps) {
  const { language } = useTheme();

  const content = {
    vi: {
      title: 'Nâng cấp VIP Pro',
      description: 'Mở khóa tất cả tính năng AI cao cấp',
      cta: 'Nâng cấp ngay',
      features: [
        'Phân tích cảm xúc đa phương thức',
        'Playlist AI không giới hạn',
        'Giao diện song ngữ',
        'Đồng bộ đa thiết bị',
      ],
    },
    en: {
      title: 'Upgrade to VIP Pro',
      description: 'Unlock all premium AI features',
      cta: 'Upgrade Now',
      features: [
        'Multimodal emotion analysis',
        'Unlimited AI playlists',
        'Bilingual interface',
        'Cross-device sync',
      ],
    },
  };

  const t = content[language];

  if (variant === 'compact') {
    return (
      <div className={cn(
<<<<<<< HEAD
        'flex items-center gap-3 rounded-2xl border border-white/8 bg-[linear-gradient(90deg,rgba(30,215,96,0.12),rgba(255,255,255,0.03))] p-4',
        className
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)]">
          <Crown className="h-4 w-4 text-[var(--brand-accent)]" />
=======
        'glass rounded-xl p-3 flex items-center gap-3',
        'bg-gradient-to-r from-[var(--song-primary)]/10 to-transparent',
        'border-[var(--song-primary)]/30',
        className
      )}>
        <div className="w-8 h-8 rounded-lg bg-[var(--song-primary)]/20 flex items-center justify-center">
          <Crown className="w-4 h-4 text-[var(--song-primary)]" />
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{t.title}</p>
        </div>
        <Button size="sm" className="bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white">
          {t.cta}
        </Button>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
<<<<<<< HEAD
      <div className={cn('relative overflow-hidden rounded-[1.9rem] border border-white/8 bg-[linear-gradient(135deg,rgba(30,215,96,0.14),rgba(255,255,255,0.03),rgba(18,18,18,0.96))] p-6', className)}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--song-primary)]/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)]">
              <Sparkles className="h-6 w-6 text-[var(--brand-accent)]" />
=======
      <div className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-gradient-to-br from-[var(--song-primary)]/20 via-[var(--song-secondary)]/10 to-transparent',
        'border border-[var(--song-primary)]/30',
        className
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--song-primary)]/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--song-primary)]" />
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{t.title}</h4>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
          </div>
          <Button className="bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white hidden sm:flex">
            {t.cta}
          </Button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn(
      'relative overflow-hidden rounded-3xl p-8',
      'bg-gradient-to-br from-[var(--song-primary)]/20 via-[var(--song-secondary)]/10 to-card',
      'border border-[var(--song-primary)]/30',
      className
    )}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--song-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--song-secondary)]/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)] flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--song-primary)]/20 text-[var(--song-primary)]">
              VIP PRO
            </span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2">{t.title}</h3>
        <p className="text-muted-foreground mb-6">{t.description}</p>
        
        <ul className="space-y-3 mb-6">
          {t.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[var(--song-primary)]/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-[var(--song-primary)]" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button size="lg" className="w-full bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white">
          {t.cta}
        </Button>
      </div>
    </div>
  );
}
