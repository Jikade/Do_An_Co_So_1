<<<<<<< HEAD
'use client';

import { useMemo, useState } from 'react';
import { Brain, ChevronRight, Clock3, Filter, Heart, Info, Leaf, Moon, SlidersHorizontal, Sparkles, TrendingUp, WandSparkles, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { mockPlaylists, type Emotion } from '@/lib/duLieuGiaLap';
import { localizedLabel, tasteProfile } from '@/lib/music-intelligence';
import { MoodBadge } from '@/components/huyHieuCamXuc';
import { PlaylistCard } from '@/components/theDanhSachPhat';
import { SongCard } from '@/components/theBaiHat';
import { getSessionRecommendations, getSongsByIds } from '@/lib/product-upgrade-data';

type Tab = 'forYou' | 'mood' | 'trending' | 'focus' | 'sleep' | 'workout' | 'healing';

const genreMap: Record<string, string[]> = {
  pop: ['1', '6', '8', '11'],
  'k-pop': ['1', '2', '3', '8'],
  'lo-fi': ['10', '7', '2', '6'],
  indie: ['4', '7', '10', '11'],
  electronic: ['3', '9', '11', '6'],
  acoustic: ['4', '5', '8', '12'],
  'r&b': ['2', '8', '12', '10'],
  jazz: ['10', '4', '7'],
  classical: ['10', '2', '7'],
};

export default function RecommendationsPage() {
  const { language, t, currentEmotion } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('forYou');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Emotion | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedTempo, setSelectedTempo] = useState<string>('all');

  const tabs = [
    { id: 'forYou' as const, label: { vi: 'Danh cho ban', en: 'For You' }, icon: Heart },
    { id: 'mood' as const, label: { vi: 'Theo tam trang', en: 'By Mood' }, icon: Brain },
    { id: 'trending' as const, label: { vi: 'Dang hop luc', en: 'Right Now' }, icon: TrendingUp },
    { id: 'focus' as const, label: { vi: 'Tap trung', en: 'Focus' }, icon: Brain },
    { id: 'sleep' as const, label: { vi: 'Ngu ngon', en: 'Sleep' }, icon: Moon },
    { id: 'workout' as const, label: { vi: 'Tap luyen', en: 'Workout' }, icon: Dumbbell },
    { id: 'healing' as const, label: { vi: 'Chua lanh', en: 'Healing' }, icon: Leaf },
  ];

  const emotions: Emotion[] = ['happy', 'sad', 'calm', 'angry', 'romantic', 'nostalgic', 'energetic', 'stressed'];
  const genres = ['K-pop', 'Pop', 'Lo-fi', 'Indie', 'Acoustic', 'R&B', 'Electronic', 'Jazz', 'Classical'];
  const tempos = [
    { id: 'slow', label: { vi: 'Cham', en: 'Slow' } },
    { id: 'medium', label: { vi: 'Vua', en: 'Medium' } },
    { id: 'fast', label: { vi: 'Nhanh', en: 'Fast' } },
  ];

  const filteredPlaylists = useMemo(() => {
    let items = [...mockPlaylists];
    const derivedEmotion =
      activeTab === 'focus' || activeTab === 'sleep' || activeTab === 'healing'
        ? 'calm'
        : activeTab === 'workout'
          ? 'energetic'
          : activeTab === 'mood'
            ? currentEmotion
            : null;

    if (selectedMood !== 'all') items = items.filter((playlist) => playlist.emotion === selectedMood);
    if (derivedEmotion) items = items.filter((playlist) => playlist.emotion === derivedEmotion);

    if (selectedGenre !== 'all') {
      const lowered = selectedGenre.toLowerCase();
      items = items.filter(
        (playlist) =>
          playlist.name[language].toLowerCase().includes(lowered) ||
          playlist.description[language].toLowerCase().includes(lowered),
      );
    }

    if (selectedTempo !== 'all') {
      const moodBuckets =
        selectedTempo === 'slow'
          ? ['calm', 'sad', 'nostalgic', 'romantic']
          : selectedTempo === 'medium'
            ? ['happy', 'romantic', 'nostalgic']
            : ['energetic', 'angry', 'happy'];
      items = items.filter((playlist) => moodBuckets.includes(playlist.emotion));
    }

    return items.length ? items : mockPlaylists.slice(0, 4);
  }, [activeTab, currentEmotion, language, selectedGenre, selectedMood, selectedTempo]);

  const filteredRecommendations = useMemo(() => {
    let items = getSessionRecommendations();

    if (activeTab === 'mood') items = items.filter((item) => item.song.emotion === currentEmotion || item.source === 'mood');
    if (activeTab === 'focus' || activeTab === 'sleep' || activeTab === 'healing') items = items.filter((item) => item.song.emotion === 'calm');
    if (activeTab === 'workout') items = items.filter((item) => item.song.emotion === 'energetic');
    if (activeTab === 'trending') items = items.filter((item) => item.confidence >= 89);
    if (selectedMood !== 'all') items = items.filter((item) => item.song.emotion === selectedMood);

    if (selectedGenre !== 'all') {
      const genreSongIds = genreMap[selectedGenre.toLowerCase()] ?? [];
      items = items.filter((item) => genreSongIds.includes(item.song.id));
    }

    if (selectedTempo !== 'all') {
      const moodBuckets =
        selectedTempo === 'slow'
          ? ['calm', 'sad', 'nostalgic', 'romantic']
          : selectedTempo === 'medium'
            ? ['happy', 'romantic', 'nostalgic']
            : ['energetic', 'angry', 'happy'];
      items = items.filter((item) => moodBuckets.includes(item.song.emotion));
    }

    if (activeTab === 'forYou') {
      items = items.sort((a, b) => {
        const left = (a.song.emotion === currentEmotion ? 8 : 0) + a.confidence;
        const right = (b.song.emotion === currentEmotion ? 8 : 0) + b.confidence;
        return right - left;
      });
    }

    return items.length ? items : getSessionRecommendations();
  }, [activeTab, currentEmotion, selectedGenre, selectedMood, selectedTempo]);

  const assistantLead = filteredRecommendations[0];
  const companionSongs = getSongsByIds(
    filteredRecommendations.slice(0, 4).map((item) => item.song.id),
  );

  return (
    <div className="space-y-8">
      <div className="surface-elevated flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/35">Recommendations</p>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{t('recommendations')}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 md:text-base">
            {language === 'vi'
              ? 'Recommendation gio thuoc ve MoodSync AI: dua tren mood, gu nghe, replay history va nhung picks do tro ly day len.'
              : 'Recommendations now belong to MoodSync AI: driven by mood, taste profile, replay history, and assistant-led picks.'}
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
          </p>
        </div>

        <Button
          variant="outline"
<<<<<<< HEAD
          onClick={() => setShowFilters((prev) => !prev)}
          className={cn(
            'flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] text-white/72',
            showFilters && 'bg-white/[0.06]',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'vi' ? 'Bo loc' : 'Filters'}
        </Button>
      </div>

=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
<<<<<<< HEAD
              'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-[var(--song-primary)] text-white'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <tab.icon className="h-4 w-4" />
=======
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-[var(--song-primary)] text-white"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <tab.icon className="w-4 h-4" />
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
            {tab.label[language]}
          </button>
        ))}
      </div>

<<<<<<< HEAD
      {showFilters && (
        <div className="glass rounded-2xl p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{language === 'vi' ? 'Tam trang' : 'Mood'}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMood('all')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm transition-all',
                    selectedMood === 'all' ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {language === 'vi' ? 'Tat ca' : 'All'}
                </button>
=======
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

>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedMood(emotion)}
<<<<<<< HEAD
                    className={cn('rounded-full transition-all', selectedMood === emotion && 'ring-2 ring-[var(--song-primary)]')}
=======
                    className={cn(
                      "transition-all rounded-full",
                      selectedMood === emotion &&
                        "ring-2 ring-[var(--song-primary)]",
                    )}
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                  >
                    <MoodBadge emotion={emotion} size="sm" />
                  </button>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{language === 'vi' ? 'The loai' : 'Genre'}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre('all')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm transition-all',
                    selectedGenre === 'all' ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {language === 'vi' ? 'Tat ca' : 'All'}
                </button>
=======
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

>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={cn(
<<<<<<< HEAD
                      'rounded-lg px-3 py-1.5 text-sm transition-all',
                      selectedGenre === genre ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
=======
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      selectedGenre === genre
                        ? "bg-[var(--song-primary)] text-white"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground",
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{language === 'vi' ? 'Nhip do' : 'Tempo'}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTempo('all')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm transition-all',
                    selectedTempo === 'all' ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {language === 'vi' ? 'Tat ca' : 'All'}
                </button>
=======
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

>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                {tempos.map((tempo) => (
                  <button
                    key={tempo.id}
                    onClick={() => setSelectedTempo(tempo.id)}
                    className={cn(
<<<<<<< HEAD
                      'rounded-lg px-3 py-1.5 text-sm transition-all',
                      selectedTempo === tempo.id ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
=======
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      selectedTempo === tempo.id
                        ? "bg-[var(--song-primary)] text-white"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground",
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
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

<<<<<<< HEAD
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem]">
        <div className="surface-elevated overflow-hidden p-6">
          <p className="pill-label text-[0.62rem] text-white/30">{language === 'vi' ? 'App-owned recommendation flow' : 'App-owned recommendation flow'}</p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            {language === 'vi' ? 'Khong con player nhung hay wrapper ben ngoai' : 'No external player, no wrapper assumptions'}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">
            {language === 'vi'
              ? 'Trang nay gio duoc xay tu du lieu noi bo: mood hien tai, top genre, top artist, lich su nghe, khung gio replay va AI picks.'
              : 'This page is now built from internal product data: current mood, top genres, top artists, listening history, replay windows, and AI picks.'}
          </p>

          {assistantLead ? (
            <div className="mt-6 rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_top_right,var(--song-gradient-start),transparent_36%),linear-gradient(180deg,rgba(37,37,37,0.96),rgba(22,22,22,0.94))] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--brand-accent)]">
                      AI lead
                    </span>
                    <MoodBadge emotion={assistantLead.song.emotion} size="sm" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{assistantLead.song.title}</h3>
                  <p className="mt-1 text-sm text-white/46">{assistantLead.song.artist} • {assistantLead.song.album}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">{assistantLead.explanation[language]}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="pill-label text-[0.58rem] text-white/28">{language === 'vi' ? 'Fit score' : 'Fit score'}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{assistantLead.confidence}%</p>
                  <p className="text-xs text-white/42">{assistantLead.genre[language]}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {companionSongs.map((song) => (
                  <SongCard key={song.id} song={song} variant="compact" />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="surface-panel p-5">
          <p className="pill-label text-[0.62rem] text-white/30">{language === 'vi' ? 'Why these picks' : 'Why these picks'}</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{language === 'vi' ? 'Current mood' : 'Current mood'}</p>
              <div className="mt-3"><MoodBadge emotion={currentEmotion} size="sm" /></div>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{language === 'vi' ? 'Favorite genres' : 'Favorite genres'}</p>
              <p className="mt-2 text-sm text-white/58">
                {localizedLabel(tasteProfile.topGenres[0].label, language)} • {localizedLabel(tasteProfile.topGenres[1].label, language)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{language === 'vi' ? 'Top artist' : 'Top artist'}</p>
              <p className="mt-2 text-sm text-white/58">{localizedLabel(tasteProfile.topArtists[0].label, language)}</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{language === 'vi' ? 'Late-night pattern' : 'Late-night pattern'}</p>
              <p className="mt-2 text-sm text-white/58">{localizedLabel(tasteProfile.listeningWindows[0].label, language)}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{language === 'vi' ? 'Playlist de xuat' : 'Recommended Playlists'}</h2>
          <button className="flex items-center gap-1 text-sm text-[var(--song-primary)] hover:underline">
            {language === 'vi' ? 'Xem tat ca' : 'View all'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
          {filteredPlaylists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
<<<<<<< HEAD
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{language === 'vi' ? 'Bai hat de xuat cho ban' : 'Recommended Songs for You'}</h2>
          <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/48">
            {filteredRecommendations.length} {language === 'vi' ? 'goi y dang hien' : 'live recommendations'}
          </div>
        </div>

        <div className="glass rounded-2xl">
          {filteredRecommendations.map((item, index) => (
            <div key={item.id} className={cn('border-b border-border/50 px-3 py-2 last:border-0', index % 2 === 0 && 'bg-secondary/10')}>
              <SongCard song={item.song} variant="list" />
              <div className="flex flex-wrap items-center gap-2 px-4 pb-3 -mt-1">
                <Info className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.explanation[language]}</span>
                <span className="rounded-full bg-[var(--song-primary)]/20 px-2 py-0.5 text-xs text-[var(--song-primary)]">
                  {item.confidence}% {language === 'vi' ? 'phu hop' : 'match'}
                </span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/50">
                  {item.genre[language]}
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                </span>
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD
      </section>

      <section className="glass rounded-2xl p-6">
        <h3 className="mb-4 font-semibold text-foreground">{language === 'vi' ? 'Cach recommendation duoc tao ra' : 'How recommendations are generated'}</h3>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--song-primary)]/20">
              <Brain className="h-6 w-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="mb-1 font-medium text-foreground">{language === 'vi' ? 'Mood detection' : 'Mood detection'}</h4>
            <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Doc text, voice va face de hieu trang thai hien tai.' : 'Reads text, voice, and face to understand your current state.'}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--song-primary)]/20">
              <Filter className="h-6 w-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="mb-1 font-medium text-foreground">{language === 'vi' ? 'Taste profile' : 'Taste profile'}</h4>
            <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Top genre, top artist va replay loop duoc dua vao tinh diem.' : 'Top genres, top artists, and replay loops are part of the scoring.'}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--song-primary)]/20">
              <Clock3 className="h-6 w-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="mb-1 font-medium text-foreground">{language === 'vi' ? 'Time habit' : 'Time habit'}</h4>
            <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Khung gio nghe manh nhat giup sap lai thu tu goi y.' : 'Peak listening windows help reorder the recommendation stack.'}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--song-primary)]/20">
              <WandSparkles className="h-6 w-6 text-[var(--song-primary)]" />
            </div>
            <h4 className="mb-1 font-medium text-foreground">{language === 'vi' ? 'Assistant picks' : 'Assistant picks'}</h4>
            <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Tro ly day len nhung bai co ly do ro rang cho tung session.' : 'The assistant pushes forward picks with explicit reasons for each session.'}</p>
          </div>
        </div>
      </section>
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
    </div>
  );
}
