'use client';

import { AppSidebar } from '@/components/thanhBenUngDung';
import { AppHeader } from '@/components/dauTrangUngDung';
import { MiniPlayer } from '@/components/trinhPhatNho';
import { MobileNav } from '@/components/dieuHuongDiDong';
<<<<<<< HEAD
import { AIAssistantPanel } from '@/components/troLyAI';
import { useTheme } from '@/lib/nguCanhGiaoDien';
=======
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const { isSidebarCollapsed } = useTheme();

  return (
    <div className="app-cinematic-shell text-foreground">
      <div className="app-shell-veils" />
      <AppSidebar />
      <div
        className="relative transition-[padding] duration-300 md:pl-[var(--app-sidebar-width)]"
        style={
          {
            '--app-sidebar-width': isSidebarCollapsed ? '5.25rem' : '16.5rem',
          } as React.CSSProperties
        }
      >
        <AppHeader />
        <main className="pb-40 pt-4 md:pb-34 md:pt-5">
          <div
            className="mx-auto w-full max-w-[var(--app-content-max)] px-4 transition-[max-width] duration-300 md:px-5 xl:px-7"
            style={
              {
                '--app-content-max': isSidebarCollapsed ? '1660px' : '1540px',
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <AIAssistantPanel />
=======
  return (
    <div className="min-h-screen bg-background ambient-gradient">
      <AppSidebar />
      <div className="md:pl-64">
        <AppHeader />
        <main className="pb-40 md:pb-24">
          {children}
        </main>
      </div>
      <MobileNav />
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
      <MiniPlayer />
    </div>
  );
}
