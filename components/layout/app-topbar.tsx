"use client";

import { Bell, FilterX, Heart, Search } from "lucide-react";

import { dashboardData, getTimeGreeting } from "@/lib/khoaLisa-data";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { cn } from "@/lib/tienIch";

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
];

export function AppTopbar() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-white/50">
            {getTimeGreeting()}, {dashboardData.greetingName}
          </p>

          <h1 className="text-2xl font-black text-white">
            {dashboardData.welcomeTitle}
          </h1>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex min-w-[240px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60">
            <Search className="h-4 w-4 shrink-0" />

            <input
              value={songSearchQuery}
              onChange={(event) => setSongSearchQuery(event.target.value)}
              placeholder="Tìm bài hát, ca sĩ, mood..."
              className="w-full bg-transparent text-white outline-none placeholder:text-white/35"
            />
          </label>

          <select
            value={moodFilter}
            onChange={(event) => setMoodFilter(event.target.value as any)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white outline-none"
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
              "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
              likedOnly
                ? "border-red-400/40 bg-red-500/15 text-red-100"
                : "border-white/10 bg-white/[0.04] text-white/60 hover:text-white",
            )}
          >
            <Heart className={cn("h-4 w-4", likedOnly && "fill-current")} />
            Đã like
          </button>

          <button
            type="button"
            onClick={clearSongFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            <FilterX className="h-4 w-4" />
            Xóa lọc
          </button>

          <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60 2xl:flex">
            <span>Mood hiện tại: {currentEmotion}</span>
          </div>

          <button className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-white/60 transition hover:text-white xl:inline-flex">
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 font-black text-white xl:flex">
            {dashboardData.greetingName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
