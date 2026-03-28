'use client';

import { AppSidebar } from '@/components/thanhBenUngDung';
import { AppHeader } from '@/components/dauTrangUngDung';
import { MiniPlayer } from '@/components/trinhPhatNho';
import { MobileNav } from '@/components/dieuHuongDiDong';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <MiniPlayer />
    </div>
  );
}
