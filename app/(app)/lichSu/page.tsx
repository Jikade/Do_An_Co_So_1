"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  History,
  Clock,
  Calendar,
  Filter,
  Play,
  Heart,
  MoreHorizontal,
  Search,
  Music2,
  Smile,
  ArrowUpRight,
  ListMusic,
  Disc3,
  Waves,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import {
  mockSongs,
  mockHistoryRecords,
  mockEmotions,
  type Language,
} from "@/lib/duLieuGiaLap";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { MoodBadge } from "@/components/huyHieuCamXuc";
import { cn } from "@/lib/tienIch";

// Helper to group by "human relative time"
const groupRecords = (
  records: typeof mockHistoryRecords,
  language: Language,
) => {
  const groups: Record<string, typeof mockHistoryRecords> = {
    [language === "vi" ? "Hôm nay" : "Today"]: [],
    [language === "vi" ? "Tuần này" : "This Week"]: [],
    [language === "vi" ? "Cũ hơn" : "Older"]: [],
  };

  records.forEach((record, i) => {
    // In a real app we'd uses dayjs/date-fns, here we mock logic by index
    if (i < 3) groups[language === "vi" ? "Hôm nay" : "Today"].push(record);
    else if (i < 8)
      groups[language === "vi" ? "Tuần này" : "This Week"].push(record);
    else groups[language === "vi" ? "Cũ hơn" : "Older"].push(record);
  });

  return Object.entries(groups).filter(([_, items]) => items.length > 0);
};

export default function HistoryPage() {
  const { language, setNowPlaying, setIsPlaying } = useTheme();

  const [activeTab, setActiveTab] = useState<"all" | "moods" | "sessions">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = useMemo(() => {
    return mockHistoryRecords.filter((record) => {
      const song = mockSongs.find((s) => s.id === record.songId);
      if (!song) return false;
      return (
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const groupedData = useMemo(
    () => groupRecords(filteredHistory, language),
    [filteredHistory, language],
  );

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  return (
    <div className="relative min-h-screen pb-40 text-white antialiased overflow-hidden">
      {/* 1. CINEMATIC HEADER (Journal Style) */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050608] min-h-[320px] flex items-center mb-12 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-[50%] -right-[10%] w-[80%] h-[150%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full p-8 md:p-14 grid gap-10 xl:grid-cols-[1fr_1.2fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <History className="h-3.5 w-3.5 text-[#a88beb]" />
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60">
                Listening Archive
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
              {language === "vi" ? "Ký Ức" : "Your Music"}
              <br />
              <span className="text-white/40">
                {language === "vi" ? "Gia Giai Điệu" : "Session Journal"}.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[0.95rem] font-medium leading-relaxed text-white/40 italic">
              "
              {language === "vi"
                ? "Âm nhạc không chỉ là những bài hát, mà là những khoảnh khắc chúng ta đã đi qua."
                : "Music is not just songs, it is the moments we have lived through."}
              "
            </p>
          </div>

          {/* Quick Stats Summary (Refined Cards) */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: language === "vi" ? "Số Bài Nghe" : "Songs Played",
                val: "1,280",
                icon: Music2,
                color: "text-[#4facfe]",
              },
              {
                label: language === "vi" ? "Tâm Trạng Chính" : "Main Mood",
                val: "Vui vẻ",
                icon: Smile,
                color: "text-[var(--brand-accent)]",
              },
              {
                label: language === "vi" ? "Giờ Nghe" : "Hours Sync",
                val: "46.2h",
                icon: Clock,
                color: "text-[#a88beb]",
              },
              {
                label: language === "vi" ? "Chu Kỳ AI" : "AI Accuracy",
                val: "92%",
                icon: Sparkles,
                color: "text-[#ffb199]",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-6 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon
                    className={cn(
                      "h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity",
                      stat.color,
                    )}
                  />
                  <ArrowUpRight className="h-4 w-4 text-white/10 group-hover:text-white/40" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">
                  {stat.val}
                </p>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/30 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 2. HISTORY NAVIGATION & SEARCH */}
      <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex p-1 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md">
          {["all", "moods", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[0.7rem] font-bold uppercase tracking-widest transition-all",
                activeTab === tab
                  ? "bg-white text-black shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              {tab === "all"
                ? language === "vi"
                  ? "Tất cả"
                  : "All"
                : tab === "moods"
                  ? language === "vi"
                    ? "Tâm trạng"
                    : "Moods"
                  : language === "vi"
                    ? "Phiên nghe"
                    : "Sessions"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[320px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[var(--brand-accent)] transition-colors" />
          <input
            type="text"
            placeholder={
              language === "vi" ? "Tìm trong ký ức..." : "Search memory..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-medium"
          />
        </div>
      </section>

      {/* 3. GROUPED LIST (THE PREMIUM JOURNAL) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {groupedData.map(([groupTitle, items], groupIndex) => (
          <section key={groupTitle} className="space-y-6">
            {/* Elegant Separator Title */}
            <div className="flex items-center gap-6 px-2">
              <h3 className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">
                {groupTitle}
              </h3>
              <div className="h-[1px] w-full bg-gradient-to-r from-white/[0.08] to-transparent" />
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-1.5 md:gap-2">
              {items.map((record, i) => {
                const song = mockSongs.find((s) => s.id === record.songId)!;
                return (
                  <motion.div
                    key={record.id}
                    variants={itemVariants}
                    className="group relative flex items-center gap-6 p-4 rounded-[1.8rem] border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer overflow-hidden"
                    onClick={() => {
                      setNowPlaying(song);
                      setIsPlaying(true);
                    }}
                  >
                    {/* Time Pin */}
                    <div className="hidden md:flex flex-col items-center justify-center w-16 shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className="text-[0.6rem] font-black tracking-widest">
                        {record.timestamp.split(" ")[0]}
                      </span>
                      <div className="w-[1px] h-4 bg-white/20 my-1" />
                    </div>

                    {/* Large Refined Cover */}
                    <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden shadow-xl border border-white/10 group-hover:scale-105 transition-transform duration-500 shrink-0">
                      <img
                        src={song.coverUrl}
                        className="w-full h-full object-cover"
                        alt="Art"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-current ml-1" />
                      </div>
                    </div>

                    {/* Metadata Hierarchy */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-white group-hover:text-[var(--brand-accent)] transition-colors line-clamp-1">
                        {song.title}
                      </h4>
                      <p className="text-[0.85rem] font-medium text-white/40 mt-0.5">
                        {song.artist}
                      </p>
                    </div>

                    {/* Mood Badge (Refined) */}
                    <div className="hidden sm:flex shrink-0">
                      <MoodBadge
                        mood={record.emotion as any}
                        size="sm"
                        className="bg-white/5 border-white/5 text-white/60"
                      />
                    </div>

                    {/* More Info */}
                    <div className="flex items-center gap-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 rounded-full hover:bg-white/10 text-white/40 hover:text-rose-500 transition-all">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="p-2.5 rounded-full hover:bg-white/10 text-white/40 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Interaction Glow Bottom Line */}
                    <div className="absolute bottom-0 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center space-y-4"
          >
            <div className="h-20 w-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white/30 font-medium">
              {language === "vi"
                ? "Không tìm thấy ký ức nào phù hợp."
                : "No memories found."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 4. BOTTOM ARCHIVE CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-10 rounded-[3rem] border border-white/[0.04] bg-[#050608]/50 flex flex-col items-center text-center space-y-6"
      >
        <Disc3 className="h-10 w-10 text-white/10 animate-spin-slow" />
        <div>
          <h5 className="text-xl font-bold text-white mb-2">
            {language === "vi" ? "Hành trình trọn vẹn" : "Complete Journey"}
          </h5>
          <p className="text-[0.9rem] text-white/40 max-w-md">
            {language === "vi"
              ? "Mọi nốt nhạc bạn từng nghe đều được AI lưu trữ và tối ưu cho những lần gợi ý tiếp theo."
              : "Every note you've ever heard is archived and optimized for future recommendations."}
          </p>
        </div>
        <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
          Export Archive
        </button>
      </motion.div>
    </div>
  );
}
