'use client'

import { Bell, Search } from 'lucide-react'
import { dashboardData, getTimeGreeting } from '@/lib/khoaLisa-data'
import { useTheme } from '@/lib/nguCanhGiaoDien'

export function AppTopbar() {
  const { currentEmotion } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07090d]/75 px-4 py-4 backdrop-blur-2xl md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/45">{getTimeGreeting()}, {dashboardData.greetingName}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{dashboardData.welcomeTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-white/45 md:flex">
            <Search className="h-4 w-4" />
            <span>Search songs, artists, moods</span>
          </div>
          <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100">
            {currentEmotion}
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08] hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6ee7ff,#7c5cff)] text-sm font-semibold text-slate-950">
            {dashboardData.greetingName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
