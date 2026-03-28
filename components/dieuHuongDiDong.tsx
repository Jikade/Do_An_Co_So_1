'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Radio, Brain, Sparkles, User } from 'lucide-react';

const navItems = [
  { key: 'home', href: '/bangDieuKhien', icon: Home },
  { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
  { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
  { key: 'recommendations', href: '/goiY', icon: Sparkles },
  { key: 'settings', href: '/caiDat', icon: User },
] as const;

export function MobileNav() {
  const { t } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-20 left-4 right-4 z-40 md:hidden">
      <div className="glass-strong rounded-2xl p-2">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/bangDieuKhien' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                    isActive 
                      ? 'text-[var(--song-primary)]' 
                      : 'text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-xl transition-all',
                    isActive && 'bg-[var(--song-primary)]/20'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
