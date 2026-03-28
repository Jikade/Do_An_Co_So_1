"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { mockPlaylists, mockSongs, type Emotion } from "@/lib/duLieuGiaLap";
import { cn } from "@/lib/tienIch";
import { PlaylistCard } from "@/components/theDanhSachPhat";
import { SongCard } from "@/components/theBaiHat";
import { MoodBadge } from "@/components/huyHieuCamXuc";
import {
  Sparkles,
  Heart,
  TrendingUp,
  Brain,
  Moon,
  Dumbbell,
  Leaf,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Music4,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab =
  | "forYou"
  | "mood"
  | "trending"
  | "focus"
  | "sleep"
  | "workout"
  | "healing";

export default function RecommendationsPage() {
  const { language, t, currentEmotion } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("forYou");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Emotion | "all">("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedTempo, setSelectedTempo] = useState<string>("all");

  const tabs: {
    id: Tab;
    label: Record<"vi" | "en", string>;
    icon: typeof Sparkles;
  }[] = [
    { id: "forYou", label: { vi: "Dành cho bạn", en: "For You" }, icon: Heart },
    {
      id: "mood",
      label: { vi: "Theo tâm trạng", en: "Based on Mood" },
      icon: Brain,
    },
    {
      id: "trending",
      label: { vi: "Xu hướng", en: "Trending" },
      icon: TrendingUp,
    },
    { id: "focus", label: { vi: "Tập trung", en: "Focus" }, icon: Brain },
    { id: "sleep", label: { vi: "Ngủ ngon", en: "Sleep" }, icon: Moon },
    {
      id: "workout",
      label: { vi: "Tập luyện", en: "Workout" },
      icon: Dumbbell,
    },
    { id: "healing", label: { vi: "Hồi phục", en: "Healing" }, icon: Leaf },
  ];

  const emotions: Emotion[] = [
    "happy",
    "sad",
    "calm",
    "angry",
    "romantic",
    "nostalgic",
    "energetic",
    "stressed",
  ];
  const genres = [
    "K-Pop",
    "Lo-Fi",
    "R&B",
    "Indie",
    "Electronic",
    "Pop",
    "Jazz",
    "Classical",
  ];
  const tempos = [
    { id: "slow", label: { vi: "Chậm", en: "Slow" } },
    { id: "medium", label: { vi: "Vừa", en: "Medium" } },
    { id: "fast", label: { vi: "Nhanh", en: "Fast" } },
  ];

  const reasonTags = {
    vi: [
      "Phù hợp với tâm trạng hiện tại",
      "Đề xuất sau khi phát hiện buồn",
      "Tăng năng lượng",
      "Giảm căng thẳng",
      "Yêu thích gần đây",
      "Xu hướng hôm nay",
    ],
    en: [
      "Matches your current mood",
      "Suggested after detecting sadness",
      "Boost energy",
      "Reduce stress",
      "Recent favorite",
      "Trending today",
    ],
  };

  const spotifyPlaylistTheoCamXuc = useMemo<Record<Emotion, string>>(
    () => ({
      happy: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      sad: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      calm: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      angry: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      romantic: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      nostalgic: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      energetic: "1Yu2GxZJGm4Vm4Q4uUPH7N",
      stressed: "1Yu2GxZJGm4Vm4Q4uUPH7N",
    }),
    [],
  );

  const spotifyPlaylistId =
    spotifyPlaylistTheoCamXuc[currentEmotion] || "1Yu2GxZJGm4Vm4Q4uUPH7N";
  const spotifyEmbedUrl = `https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`;
  const spotifyMoTrangMoi = `https://open.spotify.com/playlist/${spotifyPlaylistId}`;

  const getFilteredPlaylists = () => {
    let filtered = [...mockPlaylists];

    if (selectedMood !== "all") {
      filtered = filtered.filter((p) => p.emotion === selectedMood);
    }

    if (activeTab === "mood") {
      filtered = filtered.filter((p) => p.emotion === currentEmotion);
    } else if (
      activeTab === "focus" ||
      activeTab === "sleep" ||
      activeTab === "healing"
    ) {
      filtered = filtered.filter((p) => p.emotion === "calm");
    } else if (activeTab === "workout") {
      filtered = filtered.filter((p) => p.emotion === "energetic");
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter(
        (playlist) =>
          playlist.name[language]
            .toLowerCase()
            .includes(selectedGenre.toLowerCase()) ||
          playlist.description[language]
            .toLowerCase()
            .includes(selectedGenre.toLowerCase()),
      );
    }

    if (selectedTempo !== "all") {
      if (selectedTempo === "slow") {
        filtered = filtered.filter((p) =>
          ["calm", "sad", "nostalgic", "romantic"].includes(p.emotion),
        );
      } else if (selectedTempo === "medium") {
        filtered = filtered.filter((p) =>
          ["happy", "romantic", "nostalgic"].includes(p.emotion),
        );
      } else if (selectedTempo === "fast") {
        filtered = filtered.filter((p) =>
          ["energetic", "angry", "happy"].includes(p.emotion),
        );
      }
    }

    return filtered.length > 0 ? filtered : mockPlaylists.slice(0, 4);
  };

  const getFilteredSongs = () => {
    let filtered = [...mockSongs];

    if (selectedMood !== "all") {
      filtered = filtered.filter((s) => s.emotion === selectedMood);
    }

    if (activeTab === "mood") {
      filtered = filtered.filter((s) => s.emotion === currentEmotion);
    } else if (
      activeTab === "focus" ||
      activeTab === "sleep" ||
      activeTab === "healing"
    ) {
      filtered = filtered.filter((s) => s.emotion === "calm");
    } else if (activeTab === "workout") {
      filtered = filtered.filter((s) => s.emotion === "energetic");
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(selectedGenre.toLowerCase()) ||
          song.artist.toLowerCase().includes(selectedGenre.toLowerCase()) ||
          song.album.toLowerCase().includes(selectedGenre.toLowerCase()),
      );
    }

    if (selectedTempo !== "all") {
      if (selectedTempo === "slow") {
        filtered = filtered.filter((s) =>
          ["calm", "sad", "nostalgic", "romantic"].includes(s.emotion),
        );
      } else if (selectedTempo === "medium") {
        filtered = filtered.filter((s) =>
          ["happy", "romantic", "nostalgic"].includes(s.emotion),
        );
      } else if (selectedTempo === "fast") {
        filtered = filtered.filter((s) =>
          ["energetic", "angry", "happy"].includes(s.emotion),
        );
      }
    }

    return filtered.length > 0 ? filtered : mockSongs;
  };

  const filteredPlaylists = getFilteredPlaylists();
  const filteredSongs = getFilteredSongs();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("recommendations")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "vi"
              ? "Âm nhạc được đề xuất dựa trên phân tích cảm xúc của bạn"
              : "Music recommended based on your emotion analysis"}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2",
            showFilters && "bg-secondary",
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {language === "vi" ? "Bộ lọc" : "Filters"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-[var(--song-primary)] text-white"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label[language]}
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mood Filter */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {language === "vi" ? "Tâm trạng" : "Mood"}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMood("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    selectedMood === "all"
                      ? "bg-[var(--song-primary)] text-white"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {language === "vi" ? "Tất cả" : "All"}
                </button>

                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedMood(emotion)}
                    className={cn(
                      "transition-all rounded-full",
                      selectedMood === emotion &&
                        "ring-2 ring-[var(--song-primary)]",
                    )}
                  >
                    <MoodBadge emotion={emotion} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {language === "vi" ? "Thể loại" : "Genre"}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    selectedGenre === "all"
                      ? "bg-[var(--song-primary)] text-white"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {language === "vi" ? "Tất cả" : "All"}
                </button>

                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      selectedGenre === genre
                        ? "bg-[var(--song-primary)] text-white"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo Filter */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {language === "vi" ? "Nhịp độ" : "Tempo"}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTempo("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    selectedTempo === "all"
                      ? "bg-[var(--song-primary)] text-white"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {language === "vi" ? "Tất cả" : "All"}
                </button>

                {tempos.map((tempo) => (
                  <button
                    key={tempo.id}
                    onClick={() => setSelectedTempo(tempo.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      selectedTempo === tempo.id
                        ? "bg-[var(--song-primary)] text-white"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tempo.label[language]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insight Card */}
      <div className="glass rounded-2xl p-4 bg-gradient-to-r from-[var(--song-primary)]/10 to-transparent">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[var(--song-primary)]" />
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">
              {language === "vi" ? "Đề xuất AI" : "AI Recommendation"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "vi"
                ? `Dựa trên tâm trạng ${t(currentEmotion).toLowerCase()} của bạn, chúng tôi đề xuất các bài hát có giai điệu phù hợp để ${
                    currentEmotion === "sad"
                      ? "nâng cao tinh thần"
                      : currentEmotion === "energetic"
                        ? "duy trì năng lượng"
                        : "thư giãn"
                  }.`
                : `Based on your ${t(currentEmotion).toLowerCase()} mood, we recommend songs with melodies that will ${
                    currentEmotion === "sad"
                      ? "lift your spirits"
                      : currentEmotion === "energetic"
                        ? "maintain your energy"
                        : "help you relax"
                  }.`}
            </p>
          </div>

          <MoodBadge emotion={currentEmotion} size="sm" />
        </div>
      </div>

      {/* Spotify Embed */}
      <div className="glass rounded-2xl p-4 md:p-5 bg-gradient-to-br from-[var(--song-primary)]/10 via-transparent to-transparent">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center flex-shrink-0">
              <Music4 className="w-5 h-5 text-[var(--song-primary)]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {language === "vi" ? "Spotify dành cho bạn" : "Spotify For You"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "vi"
                  ? "Playlist Spotify nhúng trực tiếp để nghe nhanh ngay trong ứng dụng"
                  : "Embedded Spotify playlist so you can listen instantly inside the app"}
              </p>
            </div>
          </div>

          <a
            href={spotifyMoTrangMoi}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-colors"
          >
            {language === "vi" ? "Mở Spotify" : "Open Spotify"}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border/50 bg-black/20">
          <iframe
            title={
              language === "vi"
                ? "Spotify Embed: Playlist đề xuất"
                : "Spotify Embed: Recommendation Playlist"
            }
            src={spotifyEmbedUrl}
            width="100%"
            height="420"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--song-primary)]/20 text-[var(--song-primary)]">
            {language === "vi"
              ? "Nghe trực tiếp bằng Spotify Embed"
              : "Play directly with Spotify Embed"}
          </span>
          <span className="text-xs text-muted-foreground">
            {language === "vi"
              ? "Bạn có thể đổi playlistId theo từng tâm trạng ở đầu file."
              : "You can change the playlistId by mood at the top of this file."}
          </span>
        </div>
      </div>

      {/* Featured Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "vi" ? "Playlist đề xuất" : "Recommended Playlists"}
          </h2>
          <button className="text-sm text-[var(--song-primary)] hover:underline flex items-center gap-1">
            {language === "vi" ? "Xem tất cả" : "View all"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPlaylists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>

      {/* Song Recommendations with Reasons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "vi" ? "Bài hát đề xuất" : "Recommended Songs"}
          </h2>
        </div>

        <div className="glass rounded-2xl">
          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              className={cn(
                "border-b border-border/50 last:border-0",
                index % 2 === 0 && "bg-secondary/10",
              )}
            >
              <SongCard song={song} variant="list" />
              <div className="px-4 pb-3 -mt-1 flex items-center gap-2 flex-wrap">
                <Info className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {reasonTags[language][index % reasonTags[language].length]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--song-primary)]/20 text-[var(--song-primary)]">
                  {Math.floor(Math.random() * 15) + 85}%{" "}
                  {language === "vi" ? "phù hợp" : "match"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Playlists by Category */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "vi" ? "Khám phá thêm" : "Explore More"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockPlaylists.slice(4, 8).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>

      {/* Emotion to Music Explanation */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">
          {language === "vi"
            ? "Cách AI đề xuất âm nhạc"
            : "How AI Recommends Music"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="font-medium text-foreground mb-1">
              {language === "vi" ? "Phân tích cảm xúc" : "Emotion Analysis"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === "vi"
                ? "AI phát hiện cảm xúc từ khuôn mặt, giọng nói và văn bản của bạn"
                : "AI detects emotions from your face, voice, and text"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="font-medium text-foreground mb-1">
              {language === "vi" ? "Lọc thông minh" : "Smart Filtering"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === "vi"
                ? "Kết hợp với lịch sử nghe và sở thích cá nhân"
                : "Combined with listening history and personal preferences"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="font-medium text-foreground mb-1">
              {language === "vi"
                ? "Đề xuất cá nhân"
                : "Personal Recommendations"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === "vi"
                ? "Tạo playlist và đề xuất phù hợp nhất với bạn"
                : "Creates playlists and suggestions tailored to you"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
