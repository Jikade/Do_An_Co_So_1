'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  Radio, 
  Compass, 
  Sparkles, 
  History, 
  BarChart3, 
  Settings,
  Brain,
  ChevronLeft,
  Crown
} from 'lucide-react';
import { MoodBadge } from './huyHieuCamXuc';
import { useState } from 'react';

const navItems = [
  { key: 'home', href: '/', icon: Home },
  { key: 'dashboard', href: '/bangDieuKhien', icon: LayoutDashboard },
  { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
  { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
  { key: 'recommendations', href: '/goiY', icon: Sparkles },
  { key: 'history', href: '/lichSu', icon: History },
  { key: 'analytics', href: '/phanTich', icon: BarChart3 },
  { key: 'settings', href: '/caiDat', icon: Settings },
] as const;

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { t, currentEmotion, language } = useTheme();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen flex-col border-r border-border/50',
      'bg-sidebar/80 backdrop-blur-xl hidden md:flex',
      'transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <Link href="/" className={cn(
          'flex items-center gap-3 transition-opacity',
          isCollapsed && 'opacity-0 pointer-events-none'
        )}>
          <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)] flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">MoodSync AI</span>
        </Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ChevronLeft className={cn(
            'w-5 h-5 transition-transform',
            isCollapsed && 'rotate-180'
          )} />
        </button>
      </div>

      {/* Current Mood Card */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-2">{t('currentMood')}</p>
            <MoodBadge emotion={currentEmotion} animated />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                    'hover:bg-sidebar-accent',
                    isActive && 'bg-[var(--song-primary)]/20 text-[var(--song-primary)]',
                    !isActive && 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">
                      {t(item.key as keyof typeof import('@/lib/duLieuGiaLap').translations.vi)}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--song-primary)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade Card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-[var(--song-primary)]/10 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-xs font-medium text-[var(--song-primary)]">VIP Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {language === 'vi' ? 'Mở khóa tất cả tính năng' : 'Unlock all features'}
            </p>
            <button className="w-full py-2 rounded-lg bg-[var(--song-primary)] text-white text-xs font-medium hover:bg-[var(--song-primary)]/90 transition-colors">
              {language === 'vi' ? 'Nâng cấp' : 'Upgrade'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
