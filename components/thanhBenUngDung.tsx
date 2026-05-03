'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Brain,
  ChevronLeft,
  History,
  LayoutDashboard,
  Library,
  Radio,
  Settings,
  Sparkles,
  Orbit,
} from 'lucide-react'
import { cn } from '@/lib/tienIch'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { MoodBadge } from './huyHieuCamXuc'
import { appShellCopy } from '@/lib/vietnamese-home-copy'

const navGroups = [
  {
    id: 'listen',
    items: [
      { key: 'dashboard', href: '/bangDieuKhien', icon: LayoutDashboard },
      { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
      { key: 'recommendations', href: '/goiY', icon: Sparkles },
      { key: 'library', href: '/thuVien', icon: Library },
    ],
  },
  {
    id: 'insight',
    items: [
      { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
      { key: 'history', href: '/lichSu', icon: History },
      { key: 'space', href: '/khongGian', icon: Orbit },
    ],
  },
  {
    id: 'system',
    items: [{ key: 'settings', href: '/caiDat', icon: Settings }],
  },
] as const

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { currentEmotion, isSidebarCollapsed, setIsSidebarCollapsed } = useTheme()
  const pathname = usePathname()
  const copy = appShellCopy.sidebar

  return (
    <aside
      className={cn(
        'group/sidebar fixed left-0 top-0 z-40 hidden h-screen flex-col bg-[#010103]/60 backdrop-blur-3xl text-white md:flex transition-all duration-500 ease-out border-r border-white/[0.04] shadow-[10px_0_40px_rgba(0,0,0,0.5)]',
        isSidebarCollapsed ? 'w-[5.25rem]' : 'w-[16.5rem]',
        className,
      )}
    >
      {/* Ambient Inner Glow */}
      <div className="pointer-events-none absolute inset-0 w-full h-full opacity-30 shadow-[inset_1px_0_20px_rgba(255,255,255,0.01)] mix-blend-screen" />

      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute top-6 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#0a0b0e] text-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl',
          'transition-all duration-500 hover:scale-110 hover:border-white/20 hover:text-white',
          isSidebarCollapsed ? '-right-4 opacity-0 group-hover/sidebar:opacity-100' : '-right-4',
        )}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform duration-500', isSidebarCollapsed && 'rotate-180')} />
      </button>

      {/* HEADER */}
      <div className={cn('relative z-10 px-4 py-8 pb-4 transition-all', isSidebarCollapsed ? 'flex justify-center' : 'flex items-center')}>
        <Link
          href="/bangDieuKhien"
          className={cn(
            'flex items-center gap-4 transition-all duration-300 w-full group/logo',
            isSidebarCollapsed && 'justify-center',
          )}
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] bg-black shadow-[0_0_25px_rgba(255,255,255,0.08)] ring-1 ring-white/10 group-hover/logo:ring-white/20 transition-all">
            <Image
              src="/img/logo/logo.jpg"
              alt="Logo"
              fill
              className="object-cover opacity-90 group-hover/logo:opacity-100 transition-opacity"
              sizes="40px"
            />
          </div>
          <div className={cn('transition-all duration-300 whitespace-nowrap', isSidebarCollapsed && 'pointer-events-none w-0 opacity-0 translate-x-[-10px]')}>
            <span className="text-[1.05rem] font-black tracking-tight text-white/95">MoodSync<span className="text-[var(--brand-accent)] ml-0.5 opacity-90">AI</span></span>
          </div>
        </Link>
      </div>

      {/* MINI MOOD SYNC HUD */}
      {!isSidebarCollapsed ? (
        <div className="relative z-10 px-5 pt-2 pb-6">
          <div className="relative overflow-hidden rounded-[1.4rem] p-4 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">{copy.moodTitle}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--brand-accent)]/10 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-[var(--brand-accent)] border border-[var(--brand-accent)]/20 shadow-[0_0_15px_rgba(30,215,96,0.15)]">
                <div className="h-1 w-1 rounded-full bg-[var(--brand-accent)] animate-pulse" />
                SYNC
              </span>
            </div>
            <MoodBadge emotion={currentEmotion} animated size="sm" />
          </div>
        </div>
      ) : null}

      {/* NAVIGATION */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 pb-8 scrollbar-hide">
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.id} className="relative">
              {!isSidebarCollapsed ? (
                <p className="px-4 pb-2 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/20">
                  {copy.groups[group.id]}
                </p>
              ) : null}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon
                  
                  // Special logic for the "Khu Vực Không Gian"
                  const isSpaceLink = item.key === 'space'

                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group relative flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-all duration-300',
                          isSidebarCollapsed && 'justify-center px-2',
                          isActive
                            ? isSpaceLink 
                               ? 'bg-white/[0.06] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' 
                               : 'bg-white/[0.04]'
                            : 'hover:bg-white/[0.03]',
                        )}
                      >
                        {/* Interactive Hover Glow Background (Only visible on hover if not active) */}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
                        )}

                        {/* Active Indicator Line */}
                        {isActive && !isSidebarCollapsed ? (
                           <div className={cn(
                             "absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-r-full shadow-[0_0_12px_var(--brand-accent)]",
                             isSpaceLink ? "bg-[#a88beb] shadow-[0_0_12px_#a88beb]" : "bg-[var(--brand-accent)]"
                           )} />
                        ) : null}

                        {/* Icon Container */}
                        <div
                          className={cn(
                            'relative flex h-9 w-9 items-center justify-center rounded-[1rem] transition-all duration-500',
                            isActive
                              ? isSpaceLink
                                 ? 'bg-[#a88beb]/10 text-[#a88beb] ring-1 ring-[#a88beb]/20 shadow-[0_0_20px_rgba(168,139,235,0.2)]'
                                 : 'bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/20 shadow-[0_0_20px_rgba(30,215,96,0.15)]'
                              : 'text-white/40 group-hover:text-white/90 group-hover:bg-white/[0.05]',
                          )}
                        >
                          <Icon className={cn('h-4 w-4 transition-transform duration-500', isActive && isSpaceLink && 'animate-spin-slow')} />
                        </div>

                        {/* Label */}
                        {!isSidebarCollapsed ? (
                          <span className={cn(
                             'text-[0.8rem] font-medium transition-all duration-300', 
                             isActive ? 'text-white tracking-wide' : 'text-white/50 group-hover:text-white/90'
                          )}>
                            {copy.navLabels[item.key]}
                          </span>
                        ) : null}

                        {/* Space Special Aura */}
                        {isActive && isSpaceLink && !isSidebarCollapsed && (
                           <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#a88beb] animate-pulse shadow-[0_0_8px_#a88beb]" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </aside>
  )
}
