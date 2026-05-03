'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Bell,
  Brain,
  Crown,
  Home,
  LayoutDashboard,
  Library,
  Menu,
  Radio,
  Search,
  Settings,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import { cn } from '@/lib/tienIch'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockUser } from '@/lib/duLieuGiaLap'
import { localizedCopy, premiumFeatures } from '@/lib/product-upgrade-data'
import { appShellCopy } from '@/lib/vietnamese-home-copy'
import { LanguageSwitcher } from './chuyenNgonNgu'
import { MoodBadge } from './huyHieuCamXuc'

const mobileNavItems = [
  { key: 'home', href: '/', icon: Home },
  { key: 'dashboard', href: '/bangDieuKhien', icon: LayoutDashboard },
  { key: 'emotionDetection', href: '/nhanDienCamXuc', icon: Brain },
  { key: 'recommendations', href: '/goiY', icon: Sparkles },
  { key: 'library', href: '/thuVien', icon: Library },
  { key: 'nowPlaying', href: '/dangPhat', icon: Radio },
  { key: 'analytics', href: '/phanTich', icon: BarChart3 },
  { key: 'settings', href: '/caiDat', icon: Settings },
] as const

interface AppHeaderProps {
  className?: string
}

export function AppHeader({ className }: AppHeaderProps) {
  const { currentEmotion } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const pathname = usePathname()
  const premiumRef = useRef<HTMLDivElement | null>(null)
  const copy = appShellCopy

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!premiumRef.current?.contains(event.target as Node)) {
        setIsPremiumOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const currentPage = copy.pageMeta[pathname as keyof typeof copy.pageMeta] ?? copy.fallbackPage

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30',
          'bg-[linear-gradient(180deg,rgba(11,13,15,0.96),rgba(11,13,15,0.84))] backdrop-blur-xl',
          className,
        )}
      >
        <div className="mx-auto flex min-h-[5.1rem] max-w-[1540px] items-center justify-between gap-3 border-b border-white/6 px-4 py-3 md:px-5 xl:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="search-pill rounded-full p-2.5 text-white/70 transition-colors hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="pill-label text-[0.62rem] text-white/32">{currentPage.eyebrow}</p>
              <p className="truncate pt-1 text-sm font-medium text-white/82 md:text-base">{currentPage.title}</p>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                className="search-pill h-11 w-full pl-11 pr-24 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <span className="search-pill pill-label absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[0.62rem] text-white/38">
                Ctrl K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="search-pill rounded-full p-2.5 text-white/65 transition-colors hover:text-white lg:hidden"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <div className="hidden md:block">
              <MoodBadge emotion={currentEmotion} size="sm" />
            </div>

            <div ref={premiumRef} className="relative">
              <button
                onClick={() => setIsPremiumOpen((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-all',
                  isPremiumOpen
                    ? 'scale-[1.02] border-[#f6d365]/24 bg-[linear-gradient(135deg,rgba(246,211,101,0.14),rgba(255,255,255,0.04))] text-[#ffe59a]'
                    : 'border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.06] hover:text-white',
                )}
              >
                <Crown className="h-3.5 w-3.5" />
                VIP PRO
              </button>

              {isPremiumOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[20rem] rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(37,37,37,0.97),rgba(21,21,21,0.96))] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="pill-label text-[0.62rem] text-[#ffe59a]/72">{copy.premium.eyebrow}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{copy.premium.title}</h3>
                    </div>
                    <span className="rounded-full border border-[#f6d365]/25 bg-[#f6d365]/12 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#ffe59a]">
                      {mockUser.tier === 'vip' ? 'VIP PRO' : copy.premium.eyebrow}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/58">{copy.premium.description}</p>

                  <div className="mt-4 space-y-2">
                    {premiumFeatures.map((feature) => (
                      <div key={feature.title.en} className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                        <p className="text-sm font-medium text-white">{localizedCopy(feature.title, 'vi')}</p>
                        <p className="mt-1 text-xs leading-5 text-white/46">{localizedCopy(feature.detail, 'vi')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/caiDat"
                      onClick={() => setIsPremiumOpen(false)}
                      className="pill-button pill-button-primary inline-flex flex-1 items-center justify-center px-4 py-3 text-[0.68rem]"
                    >
                      {copy.premium.cta}
                    </Link>
                    <Link
                      href="/nhanDienCamXuc"
                      onClick={() => setIsPremiumOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/78 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      {copy.premium.moodAi}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <LanguageSwitcher variant="compact" className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-2" />

            <button className="search-pill relative rounded-full p-2.5 text-white/65 transition-colors hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(30,215,96,0.9),rgba(116,244,160,0.62))] text-sm font-semibold text-[#06120a] shadow-[0_10px_22px_rgba(30,215,96,0.16)]">
              M
            </button>
          </div>
        </div>

        {isSearchOpen ? (
          <div className="border-b border-white/6 px-4 pb-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                className="search-pill h-12 w-full pl-11 pr-4 text-sm text-white placeholder:text-white/32 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
        ) : null}
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="shell-panel absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-white/6">
            <div className="flex items-center justify-between border-b border-white/6 p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#090b10] shadow-[0_0_36px_var(--song-glow)] p-1">
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src="/img/logo/logo.jpg"
                      alt="Logo"
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">{copy.sidebar.brandEyebrow}</p>
                  <span className="text-base font-semibold text-white">MoodSync AI</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl p-2 text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">{copy.sidebar.moodTitle}</p>
                    <MoodBadge emotion={currentEmotion} animated className="mt-4" />
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsPremiumOpen(true)
                    }}
                    className="rounded-full border border-[#f6d365]/22 bg-[#f6d365]/10 px-3 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#ffe59a]"
                  >
                    VIP PRO
                  </button>
                </div>
              </div>
            </div>

            <nav className="px-3 py-2">
              <ul className="space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  const Icon = item.icon

                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all',
                          'hover:bg-sidebar-accent',
                          isActive && 'bg-[rgba(30,215,96,0.14)] text-[var(--brand-accent)]',
                          !isActive && 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {copy.sidebar.navLabels[item.key]}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  )
}
