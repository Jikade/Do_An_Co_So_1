"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, History, Loader2, Play, Search, Trash2 } from "lucide-react";

import {
  clearListeningHistory,
  getListeningHistory,
  type HistoryTrack,
  type ListeningHistoryItem,
} from "@/lib/api/history";
import { toImageUrl, toMediaUrl } from "@/lib/api-client";
import {
  formatDuration,
  themePalette,
  type Emotion,
  type Language,
  type Song,
  type SongTheme,
} from "@/lib/duLieuGiaLap";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { cn } from "@/lib/tienIch";

const emotionToTheme: Record<Emotion, SongTheme> = {
  happy: "pink",
  sad: "blue",
  calm: "violet",
  angry: "red",
  romantic: "pink",
  nostalgic: "sepia",
  energetic: "red",
  stressed: "cyan",
};

const emotionLabelsVi: Record<Emotion, string> = {
  happy: "Vui vẻ",
  sad: "Buồn",
  calm: "Bình yên",
  angry: "Tức giận",
  romantic: "Lãng mạn",
  nostalgic: "Hoài niệm",
  energetic: "Năng lượng",
  stressed: "Căng thẳng",
};

const validEmotions = new Set<Emotion>([
  "happy",
  "sad",
  "calm",
  "angry",
  "romantic",
  "nostalgic",
  "energetic",
  "stressed",
]);

function normalizeEmotion(value?: string | null): Emotion {
  if (value && validEmotions.has(value as Emotion)) {
    return value as Emotion;
  }

  return "calm";
}

function getEmotionLabel(emotion: Emotion, language: Language) {
  return language === "vi" ? emotionLabelsVi[emotion] : emotion;
}

function historyTrackToSong(track: HistoryTrack): Song {
  const emotion = normalizeEmotion(track.mood || track.emotion);
  const theme = emotionToTheme[emotion];

  return {
    id: String(track.id),
    title: track.title,
    artist: track.artist,
    album: "MoodSync",
    duration: Math.round(track.duration || 0),
    theme,
    coverUrl: toImageUrl(track.cover_image),
    audioUrl: toMediaUrl(track.audio_url),
    emotion,
    mood: emotion,
    palette: themePalette[theme],
    lyrics: track.lyrics ?? null,
    lyricsVi: [],
    lyricsEn: [],
    relatedSongIds: [],
  };
}

function groupLabel(dateValue: string, language: Language) {
  const date = new Date(dateValue);
  const today = new Date();
  const target = new Date(date);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return language === "vi" ? "Hôm nay" : "Today";
  if (diffDays === 1) return language === "vi" ? "Hôm qua" : "Yesterday";
  if (diffDays < 7) return language === "vi" ? "Tuần này" : "This week";

  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatHistoryTime(dateValue: string, language: Language) {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default function HistoryPage() {
  const { language, setNowPlaying, setIsPlaying } = useTheme();

  const [records, setRecords] = useState<ListeningHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getListeningHistory(100);
      setRecords(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "vi"
            ? "Không tải được lịch sử nghe."
            : "Could not load listening history.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  const filteredRecords = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) => {
      const title = record.track.title.toLowerCase();
      const artist = record.track.artist.toLowerCase();

      return title.includes(keyword) || artist.includes(keyword);
    });
  }, [records, searchQuery]);

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, ListeningHistoryItem[]>();

    for (const record of filteredRecords) {
      const label = groupLabel(record.created_at, language);
      const current = groups.get(label) ?? [];

      current.push(record);
      groups.set(label, current);
    }

    return Array.from(groups.entries());
  }, [filteredRecords, language]);

  const stats = useMemo(() => {
    const uniqueTracks = new Set(records.map((record) => record.track_id));
    const totalMinutes = Math.round(
      records.reduce((sum, record) => sum + (record.listen_ms || 0), 0) /
        60_000,
    );

    return {
      playCount: records.length,
      uniqueTrackCount: uniqueTracks.size,
      totalMinutes,
    };
  }, [records]);

  function handlePlay(record: ListeningHistoryItem) {
    const song = historyTrackToSong(record.track);

    setNowPlaying(song);
    setIsPlaying(true);
  }

  async function handleClearHistory() {
    const confirmed = window.confirm(
      language === "vi"
        ? "Bạn có chắc muốn xoá toàn bộ lịch sử nghe của tài khoản này?"
        : "Are you sure you want to clear this account's listening history?",
    );

    if (!confirmed) return;

    try {
      setIsClearing(true);
      setError(null);

      await clearListeningHistory();
      setRecords([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "vi"
            ? "Không xoá được lịch sử."
            : "Could not clear history.",
      );
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-white md:px-8">
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              <History className="h-4 w-4" />
              Listening Archive
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {language === "vi" ? "Lịch sử nghe" : "Listening history"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
              {language === "vi"
                ? "Mỗi tài khoản có một lịch sử riêng, được lưu trong database và tự cập nhật khi bạn nghe nhạc."
                : "Each account has its own database-backed history, updated automatically as you listen."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            disabled={records.length === 0 || isClearing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {language === "vi" ? "Xoá lịch sử" : "Clear history"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              label: language === "vi" ? "Lượt nghe" : "Plays",
              value: stats.playCount,
            },
            {
              label: language === "vi" ? "Bài khác nhau" : "Unique tracks",
              value: stats.uniqueTrackCount,
            },
            {
              label: language === "vi" ? "Phút đã lưu" : "Saved minutes",
              value: stats.totalMinutes,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-black/20 p-5"
            >
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/35">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              language === "vi"
                ? "Tìm theo tên bài hát hoặc ca sĩ..."
                : "Search by title or artist..."
            }
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-white/30"
          />
        </div>

        <button
          type="button"
          onClick={loadHistory}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          {language === "vi" ? "Tải lại" : "Refresh"}
        </button>
      </section>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-center">
          <History className="mb-4 h-10 w-10 text-white/25" />
          <h2 className="text-xl font-black">
            {language === "vi"
              ? "Chưa có lịch sử nghe"
              : "No listening history yet"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/45">
            {language === "vi"
              ? "Hãy phát một bài hát ít nhất 5 giây, hệ thống sẽ tự lưu vào database cho tài khoản hiện tại."
              : "Play a song for at least 5 seconds and it will be saved to this account's database history."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedRecords.map(([groupName, items]) => (
            <section key={groupName}>
              <h2 className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-white/35">
                <Clock3 className="h-4 w-4" />
                {groupName}
              </h2>

              <div className="space-y-3">
                {items.map((record) => {
                  const emotion = normalizeEmotion(
                    record.track.mood || record.track.emotion,
                  );

                  return (
                    <article
                      key={record.id}
                      className={cn(
                        "group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3 transition",
                        "hover:border-white/20 hover:bg-white/[0.07]",
                      )}
                    >
                      <img
                        src={toImageUrl(record.track.cover_image)}
                        alt={record.track.title}
                        className="h-16 w-16 rounded-2xl object-cover"
                        onError={(event) => {
                          event.currentTarget.src = "/placeholder.svg";
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-black">
                          {record.track.title}
                        </h3>

                        <p className="truncate text-sm text-white/45">
                          {record.track.artist}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/35">
                          <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white/55">
                            {getEmotionLabel(emotion, language)}
                          </span>

                          <span>
                            {formatHistoryTime(record.created_at, language)}
                          </span>

                          <span>
                            {formatDuration(
                              Math.round(record.track.duration || 0),
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlay(record)}
                        className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black opacity-90 transition hover:scale-105 hover:opacity-100"
                        aria-label={
                          language === "vi" ? "Phát lại" : "Play again"
                        }
                      >
                        <Play className="h-5 w-5 fill-current" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
