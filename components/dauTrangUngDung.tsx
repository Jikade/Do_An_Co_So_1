'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Search, Bell, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './chuyenNgonNgu';
import { MoodBadge } from './huyHieuCamXuc';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  Radio, 
  Sparkles, 
  History, 
  BarChart3, 
  Settings,
  Brain
} from 'lucide-react';

const mobileNavItems = [
  { key: 'home', href: '/', icon: Home },
  { key: 'dashboard', href: '/bangDieuKhien', icon: LayoutDashboard },
  { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
  { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
  { key: 'recommendations', href: '/goiY', icon: Sparkles },
  { key: 'history', href: '/lichSu', icon: History },
  { key: 'analytics', href: '/phanTich', icon: BarChart3 },
  { key: 'settings', href: '/caiDat', icon: Settings },
] as const;

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const { t, currentEmotion, language } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className={cn(
        'sticky top-0 z-30 border-b border-border/50',
        'bg-background/80 backdrop-blur-xl',
        className
      )}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className={cn(
            'flex items-center transition-all',
            isSearchOpen ? 'flex-1 max-w-md' : 'hidden md:flex md:w-72'
          )}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('search') + '...'}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--song-primary)]/50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile search toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground md:hidden"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Current mood badge - hidden on small screens */}
            <div className="hidden sm:block">
              <MoodBadge emotion={currentEmotion} size="sm" />
            </div>

            {/* Language switcher */}
            <LanguageSwitcher variant="compact" />

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--song-primary)]" />
            </button>

            {/* Profile */}
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--song-primary)] to-[var(--song-secondary)] flex items-center justify-center text-white font-medium">
              M
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border/50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground">MoodSync AI</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Mood */}
            <div className="p-4">
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-2">{t('currentMood')}</p>
                <MoodBadge emotion={currentEmotion} animated />
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-2">
              <ul className="space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                          'hover:bg-sidebar-accent',
                          isActive && 'bg-[var(--song-primary)]/20 text-[var(--song-primary)]',
                          !isActive && 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-sm">
                          {t(item.key as keyof typeof import('@/lib/duLieuGiaLap').translations.vi)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
