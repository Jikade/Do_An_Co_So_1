'use client'

import { AIAssistantPanel } from '@/components/troLyAI'
import { RequireAuth } from '@/components/auth/baoVeXacThuc'
import { AppHeader } from '@/components/dauTrangUngDung'
import { MobileNav } from '@/components/dieuHuongDiDong'
import { AppSidebar } from '@/components/thanhBenUngDung'
import { BottomPlayer } from '@/components/trinhPhatDuoi'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { cn } from '@/lib/tienIch'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useTheme()

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background text-foreground">
        <AppSidebar />
        <div
          className={cn(
            'min-h-screen pb-28 transition-[padding] duration-300',
            isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-80',
          )}
        >
          <AppHeader />
          <main className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">{children}</main>
        </div>
        <BottomPlayer />
        <MobileNav />
        <AIAssistantPanel />
      </div>
    </RequireAuth>
  )
}
