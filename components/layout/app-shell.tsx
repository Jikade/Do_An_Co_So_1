import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { MobileDock } from '@/components/layout/mobile-dock'
import { MiniPlayer } from '@/components/player/mini-player'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(104,93,255,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(47,214,255,0.12),transparent_24%),linear-gradient(180deg,#05070b,#080b11_40%,#06080d)]" />
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 px-4 pb-40 pt-6 md:px-6 lg:pb-32">{children}</main>
        </div>
      </div>
      <MobileDock />
      <MiniPlayer />
    </div>
  )
}
