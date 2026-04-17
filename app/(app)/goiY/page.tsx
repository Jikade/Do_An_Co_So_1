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
          </p>
        </div>

        <Button
          variant="outline"
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

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-[var(--song-primary)] text-white'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label[language]}
          </button>
        ))}
      </div>

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
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedMood(emotion)}
                    className={cn('rounded-full transition-all', selectedMood === emotion && 'ring-2 ring-[var(--song-primary)]')}
                  >
                    <MoodBadge emotion={emotion} size="sm" />
                  </button>
                ))}
              </div>
            </div>

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
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-all',
                      selectedGenre === genre ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

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
                {tempos.map((tempo) => (
                  <button
                    key={tempo.id}
                    onClick={() => setSelectedTempo(tempo.id)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-all',
                      selectedTempo === tempo.id ? 'bg-[var(--song-primary)] text-white' : 'bg-secondary/50 text-muted-foreground hover:text-foreground',
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
          {filteredPlaylists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
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
                </span>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
}
