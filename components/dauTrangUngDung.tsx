"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  Crown,
  FilterX,
  Heart,
  Home,
  LayoutDashboard,
  Library,
  Menu,
  Radio,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

import { VipProPayment } from "@/components/vip-pro-payment";
import { LogoutButton } from "@/components/auth/nutDangXuat";
import { cn } from "@/lib/tienIch";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { useAuth } from "@/lib/nguCanhXacThuc";
import { appShellCopy } from "@/lib/vietnamese-home-copy";
import { MoodBadge } from "./huyHieuCamXuc";

const mobileNavItems = [
  { key: "home", href: "/", icon: Home },
  { key: "dashboard", href: "/bangDieuKhien", icon: LayoutDashboard },
  { key: "emotionDetection", href: "/nhanDienCamXuc", icon: Brain },
  { key: "recommendations", href: "/goiY", icon: Sparkles },
  { key: "library", href: "/thuVien", icon: Library },
  { key: "nowPlaying", href: "/dangPhat", icon: Radio },
  { key: "analytics", href: "/phanTich", icon: BarChart3 },
  { key: "settings", href: "/caiDat", icon: Settings },
] as const;

const MOOD_OPTIONS = [
  { value: "all", label: "Tất cả mood" },
  { value: "happy", label: "Vui vẻ" },
  { value: "sad", label: "Buồn" },
  { value: "calm", label: "Bình yên" },
  { value: "angry", label: "Tức giận" },
  { value: "energetic", label: "Năng động" },
  { value: "stressed", label: "Căng thẳng" },
  { value: "romantic", label: "Lãng mạn" },
  { value: "nostalgic", label: "Hoài niệm" },
] as const;

interface AppHeaderProps {
  className?: string;
}

function getUserInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";

  return source.charAt(0).toUpperCase();
}

export function AppHeader({ className }: AppHeaderProps) {
  const {
    currentEmotion,
    songSearchQuery,
    setSongSearchQuery,
    moodFilter,
    setMoodFilter,
    likedOnly,
    setLikedOnly,
    clearSongFilters,
  } = useTheme();

  const { user } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const pathname = usePathname();
  const premiumRef = useRef<HTMLDivElement | null>(null);
  const copy = appShellCopy;

  const isDashboardPage = pathname === "/bangDieuKhien";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!premiumRef.current?.contains(event.target as Node)) {
        setIsPremiumOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isDashboardPage) {
      setIsSearchOpen(false);
      clearSongFilters();
    }
  }, [isDashboardPage, clearSongFilters]);

  const currentPage =
    copy.pageMeta[pathname as keyof typeof copy.pageMeta] ?? copy.fallbackPage;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30",
          "bg-[linear-gradient(180deg,rgba(11,13,15,0.96),rgba(11,13,15,0.84))] backdrop-blur-xl",
          className,
        )}
      >
        <div className="mx-auto flex min-h-[5.1rem] max-w-[1540px] items-center justify-between gap-3 border-b border-white/6 px-4 py-3 md:px-5 xl:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="search-pill rounded-full p-2.5 text-white/70 transition-colors hover:text-white md:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="pill-label text-[0.62rem] text-white/32">
                {currentPage.eyebrow}
              </p>

              <p className="truncate pt-1 text-sm font-medium text-white/82 md:text-base">
                {currentPage.title}
              </p>
            </div>
          </div>

          {/* Desktop filter - chỉ hiện ở trang /bangDieuKhien */}
          {isDashboardPage ? (
            <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
              <div className="flex w-full max-w-5xl items-center gap-2">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

                  <input
                    type="text"
                    value={songSearchQuery}
                    onChange={(event) => setSongSearchQuery(event.target.value)}
                    placeholder="Tìm bài hát, ca sĩ, mood..."
                    className="search-pill h-11 w-full pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                </div>

                <select
                  value={moodFilter}
                  onChange={(event) =>
                    setMoodFilter(event.target.value as typeof moodFilter)
                  }
                  className="search-pill h-11 min-w-[145px] rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  {MOOD_OPTIONS.map((mood) => (
                    <option
                      key={mood.value}
                      value={mood.value}
                      className="bg-zinc-950 text-white"
                    >
                      {mood.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setLikedOnly(!likedOnly)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                    likedOnly
                      ? "border-red-400/40 bg-red-500/15 text-red-100"
                      : "border-white/10 bg-white/[0.04] text-white/65 hover:text-white",
                  )}
                >
                  <Heart
                    className={cn("h-4 w-4", likedOnly && "fill-current")}
                  />
                  Đã like
                </button>

                <button
                  type="button"
                  onClick={clearSongFilters}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/65 transition hover:text-white"
                >
                  <FilterX className="h-4 w-4" />
                  Xóa lọc
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden flex-1 lg:block" />
          )}

          <div className="flex items-center gap-2 md:gap-3">
            {isDashboardPage ? (
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="search-pill rounded-full p-2.5 text-white/65 transition-colors hover:text-white lg:hidden"
                aria-label={isSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            ) : null}

            <div className="hidden md:block">
              <MoodBadge emotion={currentEmotion} size="sm" />
            </div>

            <div ref={premiumRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPremiumOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-all",
                  isPremiumOpen
                    ? "scale-[1.02] border-[#f6d365]/24 bg-[linear-gradient(135deg,rgba(246,211,101,0.14),rgba(255,255,255,0.04))] text-[#ffe59a]"
                    : "border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Crown className="h-3.5 w-3.5" />
                VIP PRO
              </button>

              {isPremiumOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(37,37,37,0.98),rgba(15,15,18,0.98))] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                  <VipProPayment onClose={() => setIsPremiumOpen(false)} />
                </div>
              ) : null}
            </div>

            <Link
              href="/caiDat"
              aria-label="Mở hồ sơ người dùng"
              title="Hồ sơ người dùng"
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-sm font-black text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:scale-105 hover:border-amber-300/40 hover:bg-white/15"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.email || "Avatar người dùng"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getUserInitial(user?.name, user?.email)}</span>
              )}

              {user?.is_vip ? (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-amber-400" />
              ) : null}
            </Link>

            <LogoutButton className="hidden xl:inline-flex" />
          </div>
        </div>

        {/* Mobile filter - chỉ hiện ở trang /bangDieuKhien */}
        {isDashboardPage && isSearchOpen ? (
          <div className="space-y-3 border-b border-white/6 px-4 pb-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

              <input
                type="text"
                value={songSearchQuery}
                onChange={(event) => setSongSearchQuery(event.target.value)}
                placeholder="Tìm bài hát, ca sĩ, mood..."
                className="search-pill h-12 w-full pl-11 pr-4 text-sm text-white placeholder:text-white/32 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={moodFilter}
                onChange={(event) =>
                  setMoodFilter(event.target.value as typeof moodFilter)
                }
                className="search-pill h-11 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none"
              >
                {MOOD_OPTIONS.map((mood) => (
                  <option
                    key={mood.value}
                    value={mood.value}
                    className="bg-zinc-950 text-white"
                  >
                    {mood.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setLikedOnly(!likedOnly)}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition",
                  likedOnly
                    ? "border-red-400/40 bg-red-500/15 text-red-100"
                    : "border-white/10 bg-white/[0.04] text-white/65",
                )}
              >
                <Heart className={cn("h-4 w-4", likedOnly && "fill-current")} />
                Đã like
              </button>
            </div>

            <button
              type="button"
              onClick={clearSongFilters}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/65 transition hover:text-white"
            >
              <FilterX className="h-4 w-4" />
              Xóa lọc
            </button>
          </div>
        ) : null}
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="shell-panel absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto border-r border-white/6">
            <div className="flex items-center justify-between border-b border-white/6 p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#090b10] p-1 shadow-[0_0_36px_var(--song-glow)]">
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
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
                    {copy.sidebar.brandEyebrow}
                  </p>

                  <span className="text-base font-semibold text-white">
                    MoodSync AI
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl p-2 text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
                      {copy.sidebar.moodTitle}
                    </p>

                    <MoodBadge
                      emotion={currentEmotion}
                      animated
                      className="mt-4"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsPremiumOpen(true);
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
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  const Icon = item.icon;

                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                          "hover:bg-sidebar-accent",
                          isActive &&
                            "bg-[rgba(30,215,96,0.14)] text-[var(--brand-accent)]",
                          !isActive &&
                            "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />

                        <span className="text-sm font-medium">
                          {item.key === "analytics"
                            ? "Phân tích"
                            : copy.sidebar.navLabels[
                                item.key as keyof typeof copy.sidebar.navLabels
                              ]}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto border-t border-white/6 p-4">
              <LogoutButton className="w-full" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
