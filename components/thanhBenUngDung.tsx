'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Brain,
  ChevronLeft,
  History,
  LayoutDashboard,
  Library,
  Radio,
  Settings,
  Sparkles,
  Waves,
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
      { key: 'analytics', href: '/phanTich', icon: BarChart3 },
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
        'shell-panel fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/6 text-white md:flex',
        'transition-all duration-300',
        isSidebarCollapsed ? 'w-[5.25rem]' : 'w-[16.5rem]',
        className,
      )}
    >
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10',
          'bg-[linear-gradient(180deg,rgba(15,18,22,0.98),rgba(7,10,12,0.98))] text-white/72 shadow-[0_16px_32px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]',
          'transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-accent)]/24 hover:text-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.4),0_0_24px_rgba(30,215,96,0.1)]',
          isSidebarCollapsed ? '-right-5' : '-right-5',
        )}
      >
        <ChevronLeft className={cn('h-4.5 w-4.5 transition-transform duration-300', isSidebarCollapsed && 'rotate-180')} />
      </button>

      <div className={cn('border-b border-white/6 px-4 py-4', isSidebarCollapsed ? 'flex justify-center' : 'flex items-center')}>
        <Link
          href="/bangDieuKhien"
          className={cn(
            'flex items-center gap-3 transition-all duration-300',
            isSidebarCollapsed && 'justify-center',
          )}
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#090b10] shadow-[0_0_30px_rgba(70,213,255,0.12)] backdrop-blur p-1">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src="/img/logo/logo.jpg"
                alt="Logo"
                fill
                className="object-contain"
                sizes="44px"
              />
            </div>
          </div>
          <div className={cn('transition-all duration-200', isSidebarCollapsed && 'pointer-events-none w-0 overflow-hidden opacity-0')}>
            <p className="pill-label text-[0.62rem] text-white/35">{copy.brandEyebrow}</p>
            <span className="text-base font-semibold text-white">MoodSync AI</span>
          </div>
        </Link>
      </div>

      {!isSidebarCollapsed ? (
        <div className="px-4 pt-4">
          <div className="surface-panel overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="pill-label text-[0.62rem] text-white/35">{copy.moodTitle}</p>
                <p className="mt-2 text-sm text-white/78">Tâm trạng hiện tại</p>
              </div>
              <span className="accent-pill pill-label rounded-full px-2.5 py-1 text-[0.66rem] font-medium">{copy.syncLabel}</span>
            </div>
            <MoodBadge emotion={currentEmotion} animated className="mt-4" />
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,var(--brand-accent),rgba(30,215,96,0.55))]" />
            </div>
          </div>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.id}>
              {!isSidebarCollapsed ? (
                <p className="pill-label px-3 pb-2 text-[0.62rem] text-white/28">
                  {copy.groups[group.id]}
                </p>
              ) : null}
              <ul className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon

                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200',
                          isSidebarCollapsed && 'justify-center px-2',
                          isActive
                            ? 'translate-x-1 bg-[linear-gradient(90deg,rgba(30,215,96,0.12),rgba(255,255,255,0.02))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_22px_rgba(0,0,0,0.22)]'
                            : 'text-white/50 hover:bg-white/[0.035] hover:text-white',
                        )}
                      >
                        {isActive && !isSidebarCollapsed ? <span className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-[var(--brand-accent)]" /> : null}
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-2xl transition-all',
                            isActive
                              ? 'scale-[1.06] bg-[rgba(30,215,96,0.12)] text-[var(--brand-accent)]'
                              : 'bg-white/[0.025] text-white/60 group-hover:bg-white/[0.05] group-hover:text-white',
                          )}
                        >
                          <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        </div>
                        {!isSidebarCollapsed ? (
                          <>
                            <span className={cn('text-sm font-semibold transition-all', isActive ? 'tracking-[0.01em]' : '')}>
                              {copy.navLabels[item.key]}
                            </span>
                            {isActive ? <span className="ml-auto h-2 w-2 rounded-full bg-[var(--brand-accent)]" /> : null}
                          </>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}
