"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Activity,
  Play,
  Sparkles,
  Disc3,
  Waves,
  ListMusic,
  AudioLines,
  Flame,
  Compass,
  ShieldCheck,
  Heart,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/tienIch";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { mockPlaylists, mockSongs, type Emotion } from "@/lib/duLieuGiaLap";
import { localizedLabel, tasteProfile } from "@/lib/music-intelligence";
import {
  getSessionRecommendations,
  getSongsByIds,
} from "@/lib/product-upgrade-data";
import { SongCard } from "@/components/theBaiHat";
import { PlaylistCard } from "@/components/theDanhSachPhat";

type Tab = "all" | "chill" | "deep" | "energy" | "discovery";
const tabs: Array<{
  id: Tab;
  label: {
    vi: string;
    en: string;
  };
}> = [
  {
    id: "all",
    label: {
      vi: "Tất cả",
      en: "All",
    },
  },
  {
    id: "chill",
    label: {
      vi: "Thư giãn",
      en: "Chill",
    },
  },
  {
    id: "deep",
    label: {
      vi: "Sâu lắng",
      en: "Deep",
    },
  },
  {
    id: "energy",
    label: {
      vi: "Năng lượng",
      en: "Energy",
    },
  },
  {
    id: "discovery",
    label: {
      vi: "Khám phá",
      en: "Discovery",
    },
  },
];

export default function RecommendationsPage() {
  const { language, currentEmotion, setNowPlaying, setIsPlaying } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("all");

  // Logic lọc dữ liệu
  const recommendations = useMemo(() => {
    let items = getSessionRecommendations();
    if (activeTab === "chill")
      items = items.filter(
        (i) => i.song.emotion === "calm" || i.song.emotion === "sad",
      );
    if (activeTab === "energy")
      items = items.filter(
        (i) => i.song.emotion === "energetic" || i.song.emotion === "happy",
      );
    if (activeTab === "deep")
      items = items.filter(
        (i) => i.song.emotion === "nostalgic" || i.song.emotion === "romantic",
      );
    if (activeTab === "discovery")
      items = items.filter((i) => i.confidence < 90);

    return items.sort((a, b) => b.confidence - a.confidence);
  }, [activeTab]);

  const heroItem = recommendations[0];
  const priorityGrid = recommendations.slice(1, 7);
  const vibeClusters = recommendations.slice(7, 15);

  const curatedPlaylists = useMemo(() => {
    return [...mockPlaylists].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [currentEmotion]);

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 24,
      },
    },
  };

  return (
    <div className="relative min-h-screen pb-40 text-white antialiased overflow-x-hidden">
      {/* ----------------------------------------------------------------- */}
      {/* BACKGROUND AMBIENCE (DYNAMIC)                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#020304]">
        <AnimatePresence mode="wait">
          {heroItem && (
            <motion.div
              key={heroItem.song.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0 overflow-hidden"
            >
              <div
                className="absolute -top-[10%] -right-[10%] w-[100vw] h-[100vh] rounded-full blur-[150px] opacity-40 mix-blend-screen"
                style={{ backgroundColor: heroItem.song.palette.primary }}
              />
              <div
                className="absolute bottom-0 -left-[10%] w-[120vw] h-[60vh] rounded-full blur-[120px] opacity-20 mix-blend-screen"
                style={{ backgroundColor: heroItem.song.palette.secondary }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020304]/60 to-[#020304] z-1" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN CONTENT SPACE                                                */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-12 pt-4 px-4 lg:px-8"
      >
        {/* 1. MICRO-INSIGHT RIBBON (CLEAN & VIP) */}
        <motion.header
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <Activity className="h-4 w-4 text-[var(--brand-accent)]" />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50">
                {language === "vi" ? "Trạng thái:" : "Status:"}
              </span>
              <span className="text-[0.7rem] font-black uppercase text-white tracking-widest">
                {currentEmotion}
              </span>
              <span className="h-4 w-[1px] bg-white/10 mx-1" />
              <ShieldCheck className="h-4 w-4 text-[var(--brand-accent)]" />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--brand-accent)]">
                Match 98.4%
              </span>
            </div>
          </div>

          {/* Elegant Selection Tabs */}
          <div className="flex p-1 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[0.68rem] font-black uppercase tracking-widest transition-all duration-400",
                  activeTab === tab.id
                    ? "bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.1)]"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                {tab.label[language] || tab.id}
              </button>
            ))}
          </div>
        </motion.header>

        {/* 2. MASSIVE HERO RECOMMENDATION (TRUE FLAGSHIP) */}
        {heroItem && (
          <motion.section
            variants={itemVariants}
            className="group relative w-full h-[480px] md:h-[580px] lg:h-[640px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] cursor-pointer"
            onClick={() => {
              setNowPlaying(heroItem.song);
              setIsPlaying(true);
            }}
          >
            {/* Huge Focal Image */}
            <div className="absolute inset-0 z-0 bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroItem.song.id}
                  src={heroItem.song.coverUrl}
                  alt="Hero"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out"
                />
              </AnimatePresence>
              {/* Advanced Light Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020304] via-[#020304]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-[#020202]/30 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.4)_0%,transparent_50%)]" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-14">
              <div className="max-w-4xl space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--brand-accent)] text-black text-[0.7rem] font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(30,215,96,0.4)]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {language === "vi"
                    ? "Tiêu Điểm Dành Riêng Cho Bạn"
                    : "Top Curated Selection"}
                </motion.div>

                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                  {heroItem.song.title}
                </h2>

                <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full border border-white/20 overflow-hidden bg-white/5">
                      <img
                        src={heroItem.song.coverUrl}
                        className="w-full h-full object-cover opacity-60"
                        alt="Artist"
                      />
                    </div>
                    <p className="text-xl md:text-2xl font-semibold text-white/80">
                      {heroItem.song.artist}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="px-5 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest">
                      Mood Mix
                    </div>
                    <div className="px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/5 text-[var(--brand-accent)] text-xs font-black uppercase tracking-widest">
                      {heroItem.confidence}% Accuracy
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Floating Action */}
              <div className="absolute bottom-10 right-10 md:bottom-14 md:right-14">
                <button className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all duration-300">
                  <Play className="h-10 w-10 ml-2 fill-current" />
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* 3. SYNCED PLAYLISTS (THE NEW HUB ADDITION) */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                {language === "vi" ? "Hòa Âm Không Gian" : "Harmony Space"}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {language === "vi"
                  ? "Playlist Hợp Mood Nhất"
                  : "Mood-Perfect Playlists"}
              </h3>
            </div>
            <button className="group flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
              VIEW ALL{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedPlaylists.map((playlist, i) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                variant="compact"
              />
            ))}
          </div>
        </motion.section>

        {/* 4. SIMILAR VIBES & DISCOVERY (CARD GRID REDESIGN) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
          {/* Left: Discovery Cluster */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-white">
                {language === "vi" ? "Giai Điệu Tương Đồng" : "Similar Vibes"}
              </h3>
              <div className="h-[1px] flex-1 bg-white/[0.05]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {priorityGrid.map((item, i) => (
                <motion.div
                  key={item.song.id}
                  whileHover={{ y: -5 }}
                  className="group relative h-[320px] rounded-[2.5rem] border border-white/5 bg-[#080a0c] overflow-hidden cursor-pointer shadow-2xl"
                  onClick={() => {
                    setNowPlaying(item.song);
                    setIsPlaying(true);
                  }}
                >
                  {/* Rich Visual Mask */}
                  <div className="absolute inset-0">
                    <img
                      src={item.song.coverUrl}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt="Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
                  </div>

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)] shadow-[0_0_8px_var(--brand-accent)]" />
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a88beb]">
                          {item.song.emotion}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white line-clamp-1">
                        {item.song.title}
                      </h4>
                      <p className="text-[0.8rem] text-white/50 font-medium">
                        {item.song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Hover Interaction Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-[var(--brand-accent)] flex items-center justify-center shadow-[0_0_30px_rgba(30,215,96,0.4)]">
                      <Play className="h-6 w-6 ml-1 text-black fill-current" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Right: "Next Up" Side Panel (Classy Column) */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                {language === "vi" ? "Nghe Tiếp Theo" : "Next Up"}
              </h3>
              <Clock className="h-5 w-5 text-white/20" />
            </div>

            <div className="flex flex-col gap-4 p-6 rounded-[2.5rem] bg-white/[0.015] border border-white/[0.04] backdrop-blur-3xl">
              {vibeClusters.map((cluster, i) => (
                <div
                  key={cluster.id}
                  onClick={() => {
                    setNowPlaying(cluster.song);
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                    <img
                      src={cluster.song.coverUrl}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      alt="Mini"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-[0.95rem] font-bold text-white truncate">
                      {cluster.song.title}
                    </h5>
                    <p className="text-[0.7rem] text-white/40 font-medium truncate">
                      {cluster.song.artist}
                    </p>
                  </div>
                  <div className="flex flex-col items-end opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="text-[0.6rem] font-black tabular-nums">
                      {cluster.confidence}%
                    </span>
                    <div className="h-1 w-10 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[var(--brand-accent)]"
                        style={{ width: `${cluster.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Insight */}
            <div className="p-6 rounded-[2rem] border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] border border-[var(--brand-accent)]/20">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.8rem] font-bold text-white">
                    {language === "vi"
                      ? "Bạn muốn dịu hơn?"
                      : "Want a softer vibe?"}
                  </p>
                  <p className="text-[0.7rem] text-white/40 mt-1">
                    {language === "vi"
                      ? 'Thử chọn filter "Chill Flow" để hệ thống làm mới dải tần số.'
                      : "Try the Chill Flow filter to refresh the frequency range."}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
