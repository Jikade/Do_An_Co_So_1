'use client';

import { cn } from '@/lib/tienIch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, Library, Radio, Sparkles } from 'lucide-react';

const navItems = [
  { key: 'home', href: '/bangDieuKhien', icon: Home },
  { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
  { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
  { key: 'recommendations', href: '/goiY', icon: Sparkles },
  { key: 'library', href: '/thuVien', icon: Library },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-24 left-4 right-4 z-40 md:hidden">
      <div className="glass-strong overflow-hidden rounded-[1.6rem] p-2 shadow-[0_28px_60px_rgba(0,0,0,0.42)]">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/bangDieuKhien' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex min-w-[3.8rem] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all',
                    isActive ? 'text-white' : 'text-white/42'
                  )}
                >
                  <div className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                    isActive
                      ? 'bg-[linear-gradient(180deg,rgba(30,215,96,0.18),rgba(255,255,255,0.04))] text-[var(--brand-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                      : 'bg-white/[0.03]'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
