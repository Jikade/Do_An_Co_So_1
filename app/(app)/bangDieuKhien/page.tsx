'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Library, Play, Plus, ScanFace, Sparkles, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formatDuration, type Emotion, type Song } from '@/lib/duLieuGiaLap'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { localizedLabel, tasteProfile } from '@/lib/music-intelligence'
import {
  getContinueListeningSongs,
  getForYouSongs,
  getLatestMoodSource,
  getLikedSongs,
  getMoodCollection,
  getSavedRecommendationSongs,
  getSongsByIds,
  getUserPlaylists,
  genreCollections,
  localizedCopy,
  moodCollections,
} from '@/lib/product-upgrade-data'
import { getCurrentVideoTimeBucket, getHomepageVideoCollections, type CuratedVideoItem, type HomepageVideoCollectionId } from '@/lib/local-video-library'
import { dashboardHomeCopy, landingPageCopy } from '@/lib/vietnamese-home-copy'
import { cn } from '@/lib/tienIch'
import { MoodBadge } from '@/components/huyHieuCamXuc'
import MoodCinemaSection from '@/components/home/MoodCinemaSection'
import { SlidingPillTabs } from '@/components/common/sliding-pill-tabs'

const genreLabelBySongId: Record<string, string> = {
  '1': 'K-pop',
  '2': 'Ballad',
  '3': 'EDM',
  '4': 'V-pop',
  '5': 'Ballad',
  '6': 'Pop',
  '7': 'Indie',
  '8': 'Pop',
  '9': 'EDM',
  '10': 'Lofi',
  '11': 'Pop',
  '12': 'Acoustic',
}

const sourceLabel: Record<'face' | 'voice' | 'text' | 'fusion', string> = {
  face: 'Khuôn mặt',
  voice: 'Giọng nói',
  text: 'Văn bản',
  fusion: 'Tổng hợp AI',
}

const songEmotionLabels: Record<Emotion, string> = {
  happy: 'Vui vẻ',
  sad: 'Buồn',
  calm: 'Bình yên',
  angry: 'Tức giận',
  romantic: 'Lãng mạn',
  nostalgic: 'Hoài niệm',
  energetic: 'Năng lượng',
  stressed: 'Căng thẳng',
}

const featuredCollectionByEmotion: Record<Emotion, string> = {
  happy: 'soft-happy',
  sad: 'cry',
  calm: 'calm-down',
  angry: 'alert',
  romantic: 'night-walk',
  nostalgic: 'night-walk',
  energetic: 'alert',
  stressed: 'calm-down',
}


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function shouldReduceMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function moodKeyForEmotion(emotion: ReturnType<typeof useTheme>['currentEmotion']) {
  if (emotion === 'calm') return 'relax'
  if (emotion === 'nostalgic') return 'lonely'
  if (emotion === 'angry') return 'energetic'
  if (emotion === 'stressed') return 'healing'
  return emotion
}

function uniqueSongs(songs: Song[]) {
  return songs.filter((song, index, list) => list.findIndex((candidate) => candidate.id === song.id) === index)
}

function getVideoContextTag({
  item,
  filter,
  topGenre,
  currentTimeBucket,
}: {
  item: CuratedVideoItem
  filter: HomepageVideoCollectionId
  topGenre: string
  currentTimeBucket: ReturnType<typeof getCurrentVideoTimeBucket>
}) {
  if (filter === 'emotion') return item.moodLabel
  if (filter === 'genre') return item.genreLabel
  if (filter === 'taste') {
    if (item.genreLabel.toLowerCase().includes('k-pop')) return 'Nghiêng K-pop'
    if (item.artist.toLowerCase().includes('lisa') || item.artist.toLowerCase().includes('blackpink')) return 'Replay vocal nữ'
    if (item.genreLabel.toLowerCase().includes('ballad') || item.genreLabel.toLowerCase().includes('indie')) return 'Tuần này nghe dịu'
    return `Hợp gu ${topGenre}`
  }
  if (filter === 'tonight') {
    if (currentTimeBucket === 'dem') return 'Đi đêm'
    if (item.genreLabel.toLowerCase().includes('ballad') || item.genreLabel.toLowerCase().includes('indie')) return 'Muốn bình tĩnh lại'
    return 'Đêm nay'
  }

  if (item.genreLabel.toLowerCase().includes('indie') || item.genreLabel.toLowerCase().includes('ballad')) return 'Muốn bình tĩnh lại'
  if (item.genreLabel.toLowerCase().includes('k-pop')) return 'Lên mood nhanh'
  if (item.moodLabel.toLowerCase().includes('buồn') || item.moodLabel.toLowerCase().includes('hoài')) return 'Muốn khóc'
  return currentTimeBucket === 'dem' ? 'Đêm nay' : 'Theo gu cậu'
}

function getVideoReasonLine({
  item,
  filter,
  currentMoodLabel,
  topGenre,
  currentTimeBucket,
}: {
  item: CuratedVideoItem
  filter: HomepageVideoCollectionId
  currentMoodLabel: string
  topGenre: string
  currentTimeBucket: ReturnType<typeof getCurrentVideoTimeBucket>
}) {
  if (filter === 'emotion') return `Giữ đúng mạch ${currentMoodLabel.toLowerCase()}.`
  if (filter === 'genre') return `Giữ trục ${item.genreLabel.toLowerCase()} cho phiên này.`
  if (filter === 'taste') {
    if (item.artist.toLowerCase().includes('lisa') || item.artist.toLowerCase().includes('blackpink')) return 'Hợp gu vocal nữ gần đây.'
    if (item.genreLabel.toLowerCase().includes(topGenre.toLowerCase())) return `Đúng trục ${topGenre.toLowerCase()} cậu hay mở.`
    return 'Khớp gu nghe tuần này.'
  }
  if (filter === 'tonight') {
    if (currentTimeBucket === 'dem') return 'Nhịp xem hợp khung nghe khuya.'
    return 'Mở lên rất vừa cho tối nay.'
  }

  return item.reason
}

function compactVideoCopy(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized

  const slice = normalized.slice(0, maxLength + 1)
  const cutIndex = slice.lastIndexOf(' ')
  const safeIndex = cutIndex > maxLength * 0.6 ? cutIndex : maxLength

  return `${slice.slice(0, safeIndex).trimEnd()}…`
}

function getCompactVideoTags(...tags: Array<string | undefined>) {
  return tags
    .map((tag) => tag?.trim())
    .filter((tag): tag is string => Boolean(tag))
    .filter((tag, index, list) => list.findIndex((candidate) => candidate.toLowerCase() === tag.toLowerCase()) === index)
    .slice(0, 2)
}

function getMoodLaneMeta({
  index,
  currentMoodLabel,
  topGenre,
}: {
  index: number
  currentMoodLabel: string
  topGenre: string
}) {
  if (index === 0) {
    return {
      label: 'Giữ mood hiện tại',
      hint: `Ở đúng mạch ${currentMoodLabel.toLowerCase()}.`,
    }
  }

  if (index === 1) {
    return {
      label: 'Đổi mood nhẹ',
      hint: `Lệch nhẹ khỏi ${topGenre.toLowerCase()} để dễ đổi nhịp.`,
    }
  }

  return {
    label: 'Đẩy cảm xúc mạnh hơn',
    hint: 'Tăng lực hình và cảm giác xem ngay.',
  }
}

function SessionRow({
  item,
  isSaved,
  isQueued,
  onPlay,
  onToggleSave,
  onToggleQueue,
}: {
  item: { song: Song; reason: string; genre: string }
  isSaved: boolean
  isQueued: boolean
  onPlay: () => void
  onToggleSave: () => void
  onToggleQueue: () => void
}) {
  return (
    <article className="group flex flex-col gap-4 rounded-[1.6rem] border border-white/6 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05] md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[1rem] bg-white/[0.05]">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">{item.song.title}</p>
            <MoodBadge emotion={item.song.emotion} size="sm" />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.64rem] text-white/55">{item.genre}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-white/46">{item.song.artist}</p>
          <p className="mt-1 line-clamp-1 text-[0.72rem] leading-5 text-white/48">{item.reason}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:ml-auto md:w-[14rem]">
        <p className="text-sm font-medium text-white/60">{formatDuration(item.song.duration)}</p>
        <div className="flex items-center gap-1.5">
          <button onClick={onToggleSave} className={cn('flex h-9 w-9 items-center justify-center rounded-full border transition', isSaved ? 'border-pink-400/30 bg-pink-400/12 text-pink-300' : 'border-white/10 bg-white/[0.04] text-white/50 hover:text-white')}>
            <Heart className={cn('h-3.5 w-3.5', isSaved && 'fill-current')} />
          </button>
          <button onClick={onToggleQueue} className={cn('flex h-9 w-9 items-center justify-center rounded-full border transition', isQueued ? 'border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/12 text-[var(--brand-accent)]' : 'border-white/10 bg-white/[0.04] text-white/50 hover:text-white')}>
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button onClick={onPlay} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_12px_24px_rgba(30,215,96,0.22)] transition hover:scale-[1.03]">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </article>
  )
}

function SessionColumnCard({ item, onPlay }: { item: { song: Song; genre: string }; onPlay: () => void }) {
  return (
    <article className="group rounded-[1.25rem] border border-white/6 bg-white/[0.025] p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="relative h-[3.75rem] w-[3.75rem] flex-shrink-0 overflow-hidden rounded-[0.95rem] bg-white/[0.05]">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{item.song.title}</p>
              <p className="mt-0.5 truncate text-[0.72rem] text-white/42">{item.song.artist}</p>
            </div>
            <button onClick={onPlay} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--brand-accent)]/18 bg-[var(--brand-accent)] text-[#06120a] shadow-[0_8px_18px_rgba(30,215,96,0.16)] transition hover:scale-[1.03]">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] text-white/52">{item.genre}</span>
            <span className="text-[0.62rem] text-white/34">{songEmotionLabels[item.song.emotion]}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

type SessionShowcaseItem = {
  song: Song
  reason: string
  genre: string
}

function TopMoodMixHeroCard({
  item,
  isSaved,
  isQueued,
  onPlay,
  onToggleSave,
  onToggleQueue,
}: {
  item: SessionShowcaseItem
  isSaved: boolean
  isQueued: boolean
  onPlay: () => void
  onToggleSave: () => void
  onToggleQueue: () => void
}) {
  return (
    <article className="group relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-[#171717] transition-transform duration-300 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: `radial-gradient(circle at top left, ${item.song.palette.primary}2f, transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),transparent_42%)]" />
      <div className="relative grid min-h-[17rem] h-full overflow-hidden md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative h-64 overflow-hidden md:h-full">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/24" />
        </div>

        <div className="flex min-w-0 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <MoodBadge emotion={item.song.emotion} size="sm" />
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.64rem] text-white/58">
                {item.genre}
              </span>
            </div>
            <h3 className="mt-4 max-w-xl text-[1.55rem] font-semibold tracking-tight text-white md:text-[1.9rem]">
              {item.song.title}
            </h3>
            <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-6 text-white/58">
              {compactVideoCopy(item.reason, 110)}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.72rem] text-white/44">
              <span>{item.song.artist}</span>
              <span className="h-1 w-1 rounded-full bg-white/18" />
              <span>{item.song.album}</span>
              <span className="h-1 w-1 rounded-full bg-white/18" />
              <span>{formatDuration(item.song.duration)}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button onClick={onPlay} className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--brand-accent)] px-5 text-sm font-medium text-[#06120a] shadow-[0_14px_30px_rgba(30,215,96,0.18)] transition-transform duration-200 hover:translate-y-[-1px]">
              <Play className="h-4 w-4 fill-current" />
              Phát ngay
            </button>
            <button
              onClick={onToggleQueue}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
                isQueued
                  ? 'border-[var(--brand-accent)]/28 bg-[var(--brand-accent)]/12 text-[var(--brand-accent)]'
                  : 'border-white/10 bg-white/[0.04] text-white/68 hover:border-white/14 hover:text-white',
              )}
            >
              <Plus className="h-4 w-4" />
              {isQueued ? 'Đã thêm hàng chờ' : 'Thêm hàng chờ'}
            </button>
            <button
              onClick={onToggleSave}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors',
                isSaved
                  ? 'border-pink-400/28 bg-pink-400/12 text-pink-300'
                  : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/14 hover:text-white',
              )}
              aria-label={isSaved ? 'Bỏ lưu bài hát' : 'Lưu bài hát'}
            >
              <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function TopMoodMixQuickCard({
  item,
  onPlay,
}: {
  item: SessionShowcaseItem
  onPlay: () => void
}) {
  return (
    <article className="group relative h-[8.75rem] overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#171717] transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: `radial-gradient(circle at top left, ${item.song.palette.secondary}26, transparent 34%)` }}
      />
      <div className="relative grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-3 p-3">
        <div className="relative overflow-hidden rounded-[1rem]">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-transparent" />
        </div>
        <div className="flex min-w-0 flex-col justify-between">
          <div className="min-w-0">
            <p className="line-clamp-1 text-[0.92rem] font-semibold text-white">{item.song.title}</p>
            <p className="mt-1 line-clamp-1 text-[0.72rem] text-white/46">{item.song.artist}</p>
            <p className="mt-1 line-clamp-1 text-[0.68rem] text-white/38">{compactVideoCopy(item.reason, 42)}</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] text-white/54">
              {item.genre}
            </span>
            <button onClick={onPlay} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72 transition-colors hover:border-[var(--brand-accent)]/24 hover:bg-[var(--brand-accent)]/12 hover:text-[var(--brand-accent)]">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function TopMoodMixGridCard({
  item,
  onPlay,
}: {
  item: SessionShowcaseItem
  onPlay: () => void
}) {
  return (
    <article className="group relative h-[15.75rem] overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#171717] transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{ background: `radial-gradient(circle at top left, ${item.song.palette.primary}24, transparent 38%)` }}
      />
      <div className="relative grid h-full grid-rows-[9.5rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
        </div>
        <div className="flex min-w-0 items-end justify-between gap-3 px-4 py-3.5">
          <div className="min-w-0">
            <p className="line-clamp-1 text-[0.94rem] font-semibold text-white">{item.song.title}</p>
            <p className="mt-1 line-clamp-1 text-[0.72rem] text-white/46">{item.song.artist}</p>
            <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] text-white/54">
              {songEmotionLabels[item.song.emotion]}
            </span>
          </div>
          <button onClick={onPlay} className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_12px_24px_rgba(30,215,96,0.16)] transition-transform duration-200 group-hover:translate-y-[-1px]">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </button>
        </div>
      </div>
    </article>
  )
}

function TopMoodMixPosterCard({
  item,
  onPlay,
}: {
  item: SessionShowcaseItem
  onPlay: () => void
}) {
  return (
    <article className="group relative h-[13.5rem] overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#171717] transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{ background: `radial-gradient(circle at top left, ${item.song.palette.secondary}22, transparent 40%)` }}
      />
      <div className="relative grid h-full grid-cols-[7.75rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden">
          <img src={item.song.coverUrl} alt={item.song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
        </div>
        <div className="flex min-w-0 flex-col justify-between px-4 py-3.5">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] text-white/54">
              {item.genre}
            </span>
            <p className="mt-3 line-clamp-2 text-[0.96rem] font-semibold text-white">{item.song.title}</p>
            <p className="mt-1 line-clamp-1 text-[0.7rem] text-white/48">{item.song.artist}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.64rem] text-white/40">{songEmotionLabels[item.song.emotion]}</span>
            <button onClick={onPlay} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_10px_20px_rgba(30,215,96,0.16)] transition-transform duration-200 group-hover:translate-y-[-1px]">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function DashboardPage() {
  const { currentEmotion, fusionScore, setCurrentEmotion, setNowPlaying, setIsPlaying } = useTheme()
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({})
  const [queueMap, setQueueMap] = useState<Record<string, boolean>>({})
  const [activeVideo, setActiveVideo] = useState<CuratedVideoItem | null>(null)
  const [activeSessionFilter, setActiveSessionFilter] = useState<'all' | Emotion>('all')
  const [activeVideoFilter, setActiveVideoFilter] = useState<HomepageVideoCollectionId>('all')
  const [activeGenreId, setActiveGenreId] = useState('kpop')
  const [genreWindowStart, setGenreWindowStart] = useState(0)
  const [genreBrowseDirection, setGenreBrowseDirection] = useState<1 | -1>(1)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const heroSectionRef = useRef<HTMLElement | null>(null)
  const videoSectionRef = useRef<HTMLElement | null>(null)
  const featuredCardRef = useRef<HTMLButtonElement | null>(null)
  const moodLaneRefs = useRef<Array<HTMLButtonElement | null>>([])
  const browseCardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const chipRailRef = useRef<HTMLDivElement | null>(null)
  const chipHighlightRef = useRef<HTMLSpanElement | null>(null)
  const chipRefs = useRef<Partial<Record<HomepageVideoCollectionId, HTMLButtonElement | null>>>({})
  const copy = dashboardHomeCopy

  const latestMood = getLatestMoodSource()
  const moodShelf = getMoodCollection(moodKeyForEmotion(currentEmotion) as never)
  const moodSongs = getSongsByIds(moodShelf.songIds)
  const forYouSongs = getForYouSongs(currentEmotion)
  const continueListening = getContinueListeningSongs()
  const savedRecommendationSongs = getSavedRecommendationSongs()
  const likedSongs = getLikedSongs()
  const playlists = getUserPlaylists()
  const displayGenres = genreCollections.filter((genre) => ['kpop', 'pop', 'lofi', 'ballad', 'chill', 'indie'].includes(genre.id))
  const activeGenre = displayGenres.find((genre) => genre.id === activeGenreId) ?? displayGenres[0]
  const activeGenreSongs = useMemo(() => (activeGenre ? getSongsByIds(activeGenre.songIds) : []), [activeGenre])
  const activeGenreLeadSong = activeGenreSongs[0] ?? null
  const activeBrowserSong = activeGenreSongs[genreWindowStart] ?? activeGenreLeadSong
  const canRotateGenreSongs = activeGenreSongs.length > 1
  const genreVisibleCards = useMemo(() => {
    if (!activeGenreSongs.length) return []

    const seen = new Set<number>()
    const preferredOffsets = [0, -1, 1, -2, 2]

    return preferredOffsets
      .flatMap((offset) => {
        const index = (genreWindowStart + offset + activeGenreSongs.length) % activeGenreSongs.length

        if (seen.has(index)) return []

        seen.add(index)
        return [{ offset, song: activeGenreSongs[index] }]
      })
      .sort((left, right) => left.offset - right.offset)
  }, [activeGenreSongs, genreWindowStart])
  const topGenre = localizedLabel(tasteProfile.topGenres[0].label, 'vi')
  const currentHour = new Date().getHours()
  const currentTimeBucket = getCurrentVideoTimeBucket(currentHour)
  const currentMoodLabel = copy.emotions.blocks.find((block) => block.id === moodKeyForEmotion(currentEmotion))?.label ?? copy.emotions.blocks[0].label
  const activeMoodBlockId = moodKeyForEmotion(currentEmotion)


  const playSong = (song: Song) => {
    setCurrentEmotion(song.emotion)
    setNowPlaying(song)
    setIsPlaying(true)
  }

  useEffect(() => {
    setGenreBrowseDirection(1)
    setGenreWindowStart(0)
  }, [activeGenreId])

  const rotateGenreSongs = (direction: -1 | 1) => {
    if (!activeGenreSongs.length) return

    setGenreBrowseDirection(direction)
    setGenreWindowStart((previous) => (previous + direction + activeGenreSongs.length) % activeGenreSongs.length)
  }
  const sessionShowcaseItems = useMemo<SessionShowcaseItem[]>(
    () =>
      uniqueSongs([...forYouSongs, ...moodSongs, ...savedRecommendationSongs, ...continueListening, ...likedSongs]).map((song, index) => ({
        song,
        genre: genreLabelBySongId[song.id] ?? 'Phiên nghe',
        reason: copy.session.reasons[index % copy.session.reasons.length],
      })),
    [continueListening, copy.session.reasons, forYouSongs, likedSongs, moodSongs, savedRecommendationSongs],
  )

  const orderedSessionItems = useMemo(() => {
    if (!sessionShowcaseItems.length) return []

    const matched = sessionShowcaseItems.filter((item) => item.song.emotion === currentEmotion)
    const fallback = sessionShowcaseItems.filter((item) => item.song.emotion !== currentEmotion)

    return [...matched, ...fallback]
  }, [currentEmotion, sessionShowcaseItems])

  const continuationLeadItem = orderedSessionItems[0] ?? sessionShowcaseItems[0] ?? null
  const continuationShelfItems = orderedSessionItems
    .filter((item) => item.song.id !== continuationLeadItem?.song.id)
    .slice(0, 6)

  const videoCollections = useMemo(
    () =>
      getHomepageVideoCollections({
        currentEmotion,
        topGenre,
        hour: currentHour,
        favoriteArtists: tasteProfile.topArtists.map((artist) => localizedLabel(artist.label, 'vi')),
      }),
    [currentEmotion, currentHour, topGenre],
  )

  const videoFilterOptions = useMemo(
    () => [
      { id: 'all' as const, label: 'Tất cả', hint: 'Pha đều mood, gu và ngữ cảnh', quickTitle: 'Pha đều cho phiên này', quickTag: 'Đa sắc' },
      { id: 'emotion' as const, label: 'Theo cảm xúc', hint: `Nghiêng về ${currentMoodLabel}`, quickTitle: `Hợp mood ${currentMoodLabel.toLowerCase()}`, quickTag: 'Cảm xúc' },
      { id: 'genre' as const, label: 'Theo thể loại', hint: `Giữ trục ${topGenre}`, quickTitle: `Giữ nhịp ${topGenre}`, quickTag: 'Thể loại' },
      { id: 'taste' as const, label: 'Theo gu của cậu', hint: 'Dựa trên replay và artist hay mở', quickTitle: 'Khớp gu nghe tuần này', quickTag: 'Gu nghe' },
      { id: 'tonight' as const, label: 'Đêm nay', hint: currentTimeBucket === 'dem' ? 'Nghiêng về nhịp nghe khuya' : 'Gợi ý hợp tối nay', quickTitle: 'Mở tiếp cho lúc này', quickTag: 'Khung nghe' },
    ],
    [currentMoodLabel, currentTimeBucket, topGenre],
  )

  const activeVideoMeta = videoFilterOptions.find((option) => option.id === activeVideoFilter) ?? videoFilterOptions[0]
  const activeVideoItems = useMemo(
    () => videoCollections.find((collection) => collection.id === activeVideoFilter)?.items ?? videoCollections[0]?.items ?? [],
    [activeVideoFilter, videoCollections],
  )

  const featuredVideo = useMemo(
    () =>
      activeVideoItems.find((item) => item.poster)
      ?? activeVideoItems[0]
      ?? null,
    [activeVideoItems],
  )
  const featuredVideoCard = useMemo(
    () =>
      featuredVideo
        ? {
            item: featuredVideo,
            contextTag: getVideoContextTag({ item: featuredVideo, filter: activeVideoFilter, topGenre, currentTimeBucket }),
            reasonLine: getVideoReasonLine({ item: featuredVideo, filter: activeVideoFilter, currentMoodLabel, topGenre, currentTimeBucket }),
          }
        : null,
    [activeVideoFilter, currentMoodLabel, currentTimeBucket, featuredVideo, topGenre],
  )
  const secondaryVideos = useMemo(
    () => activeVideoItems.filter((item) => item.id !== featuredVideo?.id),
    [activeVideoItems, featuredVideo?.id],
  )
  const moodLaneItems = useMemo(() => secondaryVideos.slice(0, 3), [secondaryVideos])
  const quickVideoItems = moodLaneItems
  const browseVideoItems = useMemo(() => secondaryVideos.slice(3), [secondaryVideos])
  const moodLaneCards = useMemo(
    () =>
      moodLaneItems.map((item, index) => ({
        lane: getMoodLaneMeta({ index, currentMoodLabel, topGenre }),
        item,
        contextTag: getVideoContextTag({ item, filter: activeVideoFilter, topGenre, currentTimeBucket }),
        reasonLine: getVideoReasonLine({ item, filter: activeVideoFilter, currentMoodLabel, topGenre, currentTimeBucket }),
      })),
    [activeVideoFilter, currentMoodLabel, currentTimeBucket, moodLaneItems, topGenre],
  )
  const browseVideoCards = useMemo(
    () =>
      browseVideoItems.map((item) => ({
        item,
        contextTag: getVideoContextTag({ item, filter: activeVideoFilter, topGenre, currentTimeBucket }),
        reasonLine: getVideoReasonLine({ item, filter: activeVideoFilter, currentMoodLabel, topGenre, currentTimeBucket }),
      })),
    [activeVideoFilter, browseVideoItems, currentMoodLabel, currentTimeBucket, topGenre],
  )
  const discoveryVideoCards = useMemo(() => {
    const seen = new Set<string>()
    const prioritized = [
      ...activeVideoItems,
      ...videoCollections.flatMap((collection) => collection.items),
    ].filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })

    return prioritized.slice(0, 9).map((item) => ({
      item,
      contextTag: getVideoContextTag({ item, filter: activeVideoFilter, topGenre, currentTimeBucket }),
    }))
  }, [activeVideoFilter, activeVideoItems, currentTimeBucket, topGenre, videoCollections])

  const columnItems = useMemo(
    () =>
      uniqueSongs([...moodSongs, ...forYouSongs, ...continueListening, ...savedRecommendationSongs]).slice(0, 6).map((song) => ({
        song,
        genre: genreLabelBySongId[song.id] ?? 'Phiên nghe',
      })),
    [continueListening, forYouSongs, moodSongs, savedRecommendationSongs],
  )
  const orderedEmotionBlocks = useMemo(() => {
    const activeBlocks = copy.emotions.blocks.filter((block) => block.id === activeMoodBlockId)
    const fallbackBlocks = copy.emotions.blocks.filter((block) => block.id !== activeMoodBlockId)
    return [...activeBlocks, ...fallbackBlocks]
  }, [activeMoodBlockId, copy.emotions.blocks])
  const orderedCollections = useMemo(() => {
    const featuredId = featuredCollectionByEmotion[currentEmotion]
    const featuredItems = copy.collections.items.filter((item) => item.id === featuredId)
    const fallbackItems = copy.collections.items.filter((item) => item.id !== featuredId)
    return [...featuredItems, ...fallbackItems]
  }, [copy.collections.items, currentEmotion])

  const handlePreviewStart = (id: string) => {
    const video = videoRefs.current[id]
    if (!video) return
    video.currentTime = 0
    const playPromise = video.play()
    if (playPromise) playPromise.catch(() => null)
  }

  const handlePreviewStop = (id: string) => {
    const video = videoRefs.current[id]
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  useEffect(() => {
    moodLaneRefs.current = moodLaneRefs.current.slice(0, moodLaneCards.length)
    browseCardRefs.current = browseCardRefs.current.slice(0, discoveryVideoCards.length)
  }, [discoveryVideoCards.length, moodLaneCards.length])

  useEffect(() => {
    if (shouldReduceMotion() || !heroSectionRef.current) return

    const ctx = gsap.context(() => {
      const heroTargets = heroSectionRef.current?.querySelectorAll<HTMLElement>('[data-hero-reveal]')
      if (!heroTargets?.length) return

      gsap.fromTo(
        heroTargets,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          stagger: 0.07,
          delay: 0.06,
          clearProps: 'opacity,visibility,transform',
        },
      )
    }, heroSectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (shouldReduceMotion() || !videoSectionRef.current) return

    const ctx = gsap.context(() => {
      const lanes = moodLaneRefs.current.filter((element): element is HTMLButtonElement => Boolean(element))
      const posters = browseCardRefs.current.filter((element): element is HTMLButtonElement => Boolean(element))

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: 'top 72%',
          once: true,
        },
      })

      if (featuredCardRef.current) {
        timeline.fromTo(
          featuredCardRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,visibility,transform' },
        )
      }

      if (lanes.length) {
        timeline.fromTo(
          lanes,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            ease: 'power2.out',
            stagger: 0.07,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.28',
        )
      }

      if (posters.length) {
        timeline.fromTo(
          posters,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.38,
            ease: 'power2.out',
            stagger: 0.05,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.12',
        )
      }
    }, videoSectionRef)

    return () => ctx.revert()
  }, [activeVideoFilter, discoveryVideoCards.length, moodLaneCards.length])

  useEffect(() => {
    const chipRail = chipRailRef.current
    const chipHighlight = chipHighlightRef.current
    const activeChip = chipRefs.current[activeVideoFilter]
    if (!chipRail || !chipHighlight || !activeChip) return

    const updateHighlight = () => {
      const railRect = chipRail.getBoundingClientRect()
      const activeRect = activeChip.getBoundingClientRect()
      gsap.to(chipHighlight, {
        x: activeRect.left - railRect.left,
        y: activeRect.top - railRect.top,
        width: activeRect.width,
        height: activeRect.height,
        autoAlpha: 1,
        duration: shouldReduceMotion() ? 0 : 0.32,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    updateHighlight()

    Object.entries(chipRefs.current).forEach(([id, element]) => {
      if (!element) return
      const isActive = id === activeVideoFilter
      gsap.to(element, {
        scale: isActive ? 1.02 : 1,
        duration: shouldReduceMotion() ? 0 : 0.24,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.to(element, {
        boxShadow: isActive ? '0 10px 24px rgba(30,215,96,0.12)' : '0 0 0 rgba(0,0,0,0)',
        duration: shouldReduceMotion() ? 0 : 0.24,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    window.addEventListener('resize', updateHighlight)
    return () => window.removeEventListener('resize', updateHighlight)
  }, [activeVideoFilter])

  useEffect(() => {
    if (shouldReduceMotion()) return

    const cards = [
      featuredCardRef.current,
      ...moodLaneRefs.current,
      ...browseCardRefs.current,
    ].filter((element): element is HTMLButtonElement => Boolean(element))

    const cleanups = cards.map((card) => {
      const media = card.querySelector<HTMLElement>('[data-card-media]')
      const enter = () => {
        gsap.to(card, { y: -4, scale: 1.012, duration: 0.34, ease: 'power2.out', overwrite: 'auto' })
        if (media) {
          gsap.to(media, { scale: 1.024, duration: 0.42, ease: 'power2.out', overwrite: 'auto' })
        }
      }
      const leave = () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.34, ease: 'power2.out', overwrite: 'auto' })
        if (media) {
          gsap.to(media, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
        }
      }

      card.addEventListener('mouseenter', enter)
      card.addEventListener('mouseleave', leave)
      card.addEventListener('focus', enter)
      card.addEventListener('blur', leave)

      return () => {
        card.removeEventListener('mouseenter', enter)
        card.removeEventListener('mouseleave', leave)
        card.removeEventListener('focus', enter)
        card.removeEventListener('blur', leave)
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [activeVideoFilter, discoveryVideoCards.length, moodLaneCards.length])

  return (
    <>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
        <div className="space-y-7">
          <section ref={heroSectionRef} className="section-shell p-5 md:p-6 lg:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(50,108,138,0.2),transparent_34%)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 bg-[radial-gradient(circle_at_center,rgba(30,215,96,0.12),transparent_54%)]" />
            <div data-hero-reveal className="flex flex-wrap items-center gap-3">
              <MoodBadge emotion={currentEmotion} size="lg" animated />
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.7rem] text-white/50">
                {latestMood ? sourceLabel[latestMood.source] : 'Đang chờ'}
              </span>
            </div>

            <h1 data-hero-reveal className="mt-4 max-w-3xl text-[2rem] font-bold tracking-tight text-white md:text-[2.55rem]">{copy.heroTitle}</h1>
            <p data-hero-reveal className="mt-2.5 max-w-2xl text-sm leading-6 text-white/52">{copy.heroDescription}</p>

            <div data-hero-reveal className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/nhanDienCamXuc" className="pill-button pill-button-primary inline-flex items-center gap-2 px-4.5 py-2.5 text-[0.66rem]">
                <ScanFace className="h-4 w-4" />
                {copy.detectEmotion}
              </Link>
              <button onClick={() => moodSongs[0] && playSong(moodSongs[0])} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4.5 py-2.5 text-sm text-white transition hover:bg-white/[0.07]">
                <Play className="h-4 w-4 fill-current" />
                {copy.playNow}
              </button>
            </div>

            <div data-hero-reveal className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] text-white/48">{copy.moodSync} · <span className="font-semibold text-white/78">{fusionScore}%</span></span>
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] text-white/48">{copy.topGenre} · <span className="font-semibold text-white/78">{topGenre}</span></span>
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] text-white/48">{copy.peakWindow} · <span className="font-semibold text-white/78">{localizedLabel(tasteProfile.listeningWindows[0].label, 'vi')}</span></span>
            </div>
            <div data-hero-reveal className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="card-premium rounded-[1.3rem] p-4">
                <p className="pill-label text-[0.58rem] text-white/28">Mood dang dan</p>
                <p className="mt-2 text-base font-semibold text-white">{currentMoodLabel}</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-white/42">
                  {latestMood ? `Tin hieu uu tien tu ${sourceLabel[latestMood.source].toLowerCase()}.` : 'He thong dang doi tin hieu moi.'}
                </p>
              </div>
              <div className="card-premium rounded-[1.3rem] p-4">
                <p className="pill-label text-[0.58rem] text-white/28">Category dang mo</p>
                <p className="mt-2 text-base font-semibold text-white">{activeGenre ? localizedCopy(activeGenre.title, 'vi') : topGenre}</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-white/42">
                  {activeGenre ? localizedCopy(activeGenre.subtitle, 'vi') : 'Cac bai dang nghieng theo category dang chon.'}
                </p>
              </div>
              <div className="card-premium rounded-[1.3rem] p-4">
                <p className="pill-label text-[0.58rem] text-white/28">Rap cam xuc</p>
                <p className="mt-2 text-base font-semibold text-white">Mood cinema da duoc thay moi</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-white/42">Section kham pha video theo mood moi dang nam ngay ben duoi mix chinh.</p>
              </div>
            </div>
          </section>

          <section className="section-shell-soft p-5 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="pill-label text-[0.58rem] text-white/26">Nghe tiep</p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white md:text-[1.2rem]">Nghe tiếp từ mood này</h2>
                  <p className="mt-1 text-[0.82rem] leading-6 text-white/44">
                    Một hàng mix nhẹ hơn để nối tiếp phiên nghe hiện tại, không lặp lại khu khám phá chính ở trên.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="chip-premium px-3 py-1.5 text-[0.64rem] text-white/62">
                    {currentMoodLabel}
                  </span>
                  <Link href="/goiY" className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/72 transition-colors hover:border-white/14 hover:text-white">
                    Xem tất cả
                  </Link>
                </div>
              </div>

              {continuationLeadItem ? (
                <div className="space-y-3">
                  <SessionRow
                    item={continuationLeadItem}
                    isSaved={Boolean(savedMap[continuationLeadItem.song.id])}
                    isQueued={Boolean(queueMap[continuationLeadItem.song.id])}
                    onPlay={() => playSong(continuationLeadItem.song)}
                    onToggleSave={() => setSavedMap((prev) => ({ ...prev, [continuationLeadItem.song.id]: !prev[continuationLeadItem.song.id] }))}
                    onToggleQueue={() => setQueueMap((prev) => ({ ...prev, [continuationLeadItem.song.id]: !prev[continuationLeadItem.song.id] }))}
                  />

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {continuationShelfItems.map((item) => (
                      <SessionColumnCard
                        key={item.song.id}
                        item={item}
                        onPlay={() => playSong(item.song)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          <MoodCinemaSection />

          <section className="section-shell-soft p-5">
            <div className="mb-5">
              <p className="pill-label text-[0.6rem] text-white/30">{copy.emotions.eyebrow}</p>
              <h2 className="mt-1.5 text-xl font-semibold text-white">{copy.emotions.title}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
              {orderedEmotionBlocks.map((block, index) => {
                const moodData = moodCollections.find((item) => item.id === block.id)
                const isActive = block.id === activeMoodBlockId
                return (
                  <button key={block.id} onClick={() => { if (moodData) setCurrentEmotion(moodData.emotion) }} className={cn('group relative overflow-hidden rounded-[1.45rem] border p-5 text-left transition-all duration-300 hover:-translate-y-1', isActive ? 'sm:col-span-2 xl:col-span-2 border-[var(--brand-accent)]/24 bg-[#171a18] shadow-[0_18px_40px_rgba(0,0,0,0.28)]' : 'border-white/8 bg-[#17181b] opacity-78 hover:border-white/14 hover:opacity-100')}>
                    <div className={cn('absolute inset-0 bg-gradient-to-br transition-opacity', block.accent, isActive ? 'opacity-90' : 'opacity-60 group-hover:opacity-82')} />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn('text-2xl transition-transform', isActive ? 'scale-110' : '')}>{block.emoji}</span>
                        {isActive ? <span className="rounded-full border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/10 px-2.5 py-1 text-[0.62rem] font-medium text-[var(--brand-accent)]">Đang dẫn mood</span> : null}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">{block.label}</p>
                      {moodData ? <p className={cn('mt-1 text-[0.72rem] leading-5 text-white/50', isActive ? 'line-clamp-3 max-w-sm' : 'line-clamp-2')}>{localizedCopy(moodData.subtitle, 'vi')}</p> : null}
                      {isActive ? (
                        <div className="mt-4 flex items-center gap-2">
                          {moodSongs.slice(0, 3).map((song) => (
                            <div key={`${block.id}-${song.id}`} className="h-9 w-9 overflow-hidden rounded-xl border border-white/10">
                              <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="section-shell-soft p-5">
            <div className="mb-5">
              <p className="pill-label text-[0.6rem] text-white/30">{copy.collections.eyebrow}</p>
              <h2 className="mt-1.5 text-xl font-semibold text-white">{copy.collections.title}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {orderedCollections.map((collection, index) => {
                const songs = getSongsByIds([...collection.songIds])
                return (
                  <button key={collection.id} onClick={() => songs[0] && playSong(songs[0])} className={cn('group relative overflow-hidden rounded-[1.5rem] border p-5 text-left transition-all duration-300 hover:-translate-y-1', index === 0 ? 'sm:col-span-2 lg:col-span-2 xl:col-span-2 border-[var(--brand-accent)]/18 bg-[#171917] shadow-[0_16px_34px_rgba(0,0,0,0.24)]' : 'border-white/8 bg-[#17181b] hover:border-white/14')}>
                    <div className={cn('absolute inset-0 bg-gradient-to-br transition-opacity', collection.accent, index === 0 ? 'opacity-82' : 'opacity-68 group-hover:opacity-90')} />
                    <div className="relative">
                      <span className="text-2xl">{collection.emoji}</span>
                      <h3 className="mt-3 text-sm font-semibold text-white">{collection.title}</h3>
                      <p className={cn('mt-1 text-[0.72rem] leading-5 text-white/48', index === 0 ? 'line-clamp-3 max-w-md' : 'line-clamp-2')}>{collection.subtitle}</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        {songs.slice(0, 3).map((song) => (
                          <div key={song.id} className={cn('overflow-hidden rounded-md border border-white/10', index === 0 ? 'h-8 w-8 rounded-lg' : 'h-6 w-6')}>
                            <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover" />
                          </div>
                        ))}
                        <span className="text-[0.64rem] text-white/36">{songs.length} {copy.collections.songsUnit}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="section-shell-soft p-5">
            <div className="mb-5">
              <p className="pill-label text-[0.6rem] text-white/30">{copy.genres.eyebrow}</p>
              <h2 className="mt-1.5 text-xl font-semibold text-white">{copy.genres.title}</h2>
            </div>
            <div className="mb-4">
              <SlidingPillTabs
                items={displayGenres.map((genre) => ({
                  id: genre.id,
                  label: localizedCopy(genre.title, 'vi'),
                }))}
                activeKey={activeGenreId}
                onChange={setActiveGenreId}
                size="sm"
                className="max-w-full"
              />
            </div>
            {activeBrowserSong ? (
              <div className="flex flex-col items-center gap-3 pt-2">
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-white/34">
                  {(genreWindowStart % activeGenreSongs.length) + 1}/{activeGenreSongs.length}
                </span>

                <div className="relative flex w-full items-center justify-center py-2 md:py-3">
                  <button
                    onClick={() => rotateGenreSongs(-1)}
                    disabled={!canRotateGenreSongs}
                    aria-label="Bai truoc"
                    className={cn(
                      'absolute left-0 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,12,15,0.88)] text-white/72 shadow-[0_16px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition',
                      canRotateGenreSongs ? 'hover:border-[var(--brand-accent)]/22 hover:text-white hover:shadow-[0_0_22px_rgba(30,215,96,0.08)]' : 'cursor-not-allowed opacity-45',
                    )}
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  </button>

                  <div className="relative flex h-[26.25rem] w-full max-w-[34rem] items-center justify-center overflow-visible">
                    {genreVisibleCards
                      .sort((left, right) => Math.abs(right.offset) - Math.abs(left.offset))
                      .map(({ offset, song }) => {
                        const absOffset = Math.abs(offset)
                        const isActive = offset === 0
                        const x = absOffset === 0 ? 0 : absOffset === 1 ? 206 : 302
                        const y = absOffset === 0 ? 0 : absOffset === 1 ? 9 : 16
                        const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.83 : 0.67
                        const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.4 : 0.16
                        const blur = absOffset === 0 ? '0px' : absOffset === 1 ? '0.9px' : '2.2px'
                        const brightness = absOffset === 0 ? 1.02 : absOffset === 1 ? 0.74 : 0.54
                        const saturate = absOffset === 0 ? 1.02 : absOffset === 1 ? 0.8 : 0.62

                        return (
                          <article
                            key={song.id}
                            aria-hidden={!isActive}
                            className={cn(
                              'absolute left-1/2 top-1/2 aspect-[10/16] w-full max-w-[19.6rem] overflow-hidden rounded-[1.8rem] border bg-[#0a0d0f] transform-gpu will-change-[transform,opacity,filter] transition-[transform,opacity,filter,box-shadow,border-color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                              isActive
                                ? 'z-20 border-white/10 shadow-[0_30px_64px_rgba(0,0,0,0.36)]'
                                : absOffset === 1
                                  ? 'z-10 border-white/8 shadow-[0_18px_34px_rgba(0,0,0,0.2)]'
                                  : 'z-0 border-white/6 shadow-[0_12px_24px_rgba(0,0,0,0.14)]',
                            )}
                            style={{
                              filter: `blur(${blur}) brightness(${brightness}) saturate(${saturate})`,
                              opacity,
                              transform: `translate3d(-50%, -50%, 0) translateX(${offset < 0 ? -x : x}px) translateY(${y}px) scale(${scale})`,
                            }}
                          >
                            <img
                              src={song.coverUrl}
                              alt={isActive ? song.title : ''}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            />
                            <div className={cn('absolute inset-0 opacity-[0.22] transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]', activeGenre?.accent)} />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,8,0.08)_0%,rgba(4,6,8,0.18)_34%,rgba(4,6,8,0.38)_58%,rgba(4,6,8,0.94)_100%)]" />
                            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.05] to-transparent" />

                            {isActive ? (
                              <div className="relative flex h-full flex-col justify-between p-5">
                                <div className="flex items-start justify-between gap-3">
                                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/26 px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.18em] text-white/72 backdrop-blur-sm">
                                    <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)] shadow-[0_0_14px_rgba(30,215,96,0.42)]" />
                                    {activeGenre ? localizedCopy(activeGenre.title, 'vi') : topGenre}
                                  </span>
                                  <button
                                    onClick={() => playSong(activeBrowserSong)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/30 text-white/84 backdrop-blur-sm transition hover:border-[var(--brand-accent)]/24 hover:bg-[var(--brand-accent)]/12 hover:text-[var(--brand-accent)]"
                                    aria-label={`Phat ${activeBrowserSong.title}`}
                                  >
                                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                                  </button>
                                </div>

                                <div>
                                  <h3 className="line-clamp-2 text-[1.4rem] font-semibold tracking-tight text-white">
                                    {activeBrowserSong.title}
                                  </h3>
                                  <p className="mt-1 text-[0.82rem] text-white/58">{activeBrowserSong.artist}</p>
                                  <span className="mt-3 inline-flex rounded-full border border-white/10 bg-black/24 px-2.5 py-1 text-[0.6rem] text-white/54 backdrop-blur-sm">
                                    {songEmotionLabels[activeBrowserSong.emotion]}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </article>
                        )
                      })}
                  </div>

                  <button
                    onClick={() => rotateGenreSongs(1)}
                    disabled={!canRotateGenreSongs}
                    aria-label="Bai tiep theo"
                    className={cn(
                      'absolute right-0 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,12,15,0.88)] text-white/72 shadow-[0_16px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition',
                      canRotateGenreSongs ? 'hover:border-[var(--brand-accent)]/22 hover:text-white hover:shadow-[0_0_22px_rgba(30,215,96,0.08)]' : 'cursor-not-allowed opacity-45',
                    )}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="section-shell-soft p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
              <h2 className="text-base font-semibold text-white">{copy.whyFits.title}</h2>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {copy.whyFits.items.map((reason) => (
                <div key={reason.id} className="card-premium flex items-center gap-3 rounded-[1.1rem] px-4 py-3">
                  <span className="text-lg">{reason.emoji}</span>
                  <p className="text-[0.76rem] leading-5 text-white/60">{reason.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-shell-soft p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Library className="h-4 w-4 text-white/50" />
                <h2 className="text-base font-semibold text-white">{copy.library.title}</h2>
              </div>
              <Link href="/thuVien" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-accent)] hover:underline">
                {copy.library.open}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="card-premium rounded-[1.1rem] px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{likedSongs.length}</p>
                <p className="mt-0.5 text-[0.7rem] text-white/44">{copy.library.liked}</p>
              </div>
              <div className="card-premium rounded-[1.1rem] px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{playlists.length}</p>
                <p className="mt-0.5 text-[0.7rem] text-white/44">{copy.library.playlists}</p>
              </div>
              <div className="card-premium rounded-[1.1rem] px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">12</p>
                <p className="mt-0.5 text-[0.7rem] text-white/44">{copy.library.songs}</p>
              </div>
              <div className="card-premium rounded-[1.1rem] px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">25.3h</p>
                <p className="mt-0.5 text-[0.7rem] text-white/44">{copy.library.thisWeek}</p>
              </div>
            </div>
            {playlists[0] ? (
              <div className="card-premium mt-4 flex items-center gap-3 rounded-[1.1rem] p-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg">
                  <img src={playlists[0].coverUrl} alt={landingPageCopy.playlistOverrides[playlists[0].id as keyof typeof landingPageCopy.playlistOverrides]?.name ?? playlists[0].name.vi} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{landingPageCopy.playlistOverrides[playlists[0].id as keyof typeof landingPageCopy.playlistOverrides]?.name ?? playlists[0].name.vi}</p>
                  <p className="text-xs text-white/40">{playlists[0].songCount} {copy.library.songsUnit} · {playlists[0].duration}</p>
                </div>
                <button onClick={() => playlists[0].songs[0] && playSong(playlists[0].songs[0])} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a]">
                  <Play className="ml-0.5 h-3 w-3 fill-current" />
                </button>
              </div>
            ) : null}
          </section>
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-24">
            <div className="surface-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="pill-label text-[0.6rem] text-white/28">{copy.rightColumn.eyebrow}</p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">{copy.rightColumn.title}</h2>
                </div>
                <Link href="/goiY" className="text-sm font-medium text-[var(--brand-accent)] hover:underline">{copy.rightColumn.all}</Link>
              </div>
              <div className="mt-4 space-y-2.5">
                {columnItems.map((item) => (
                  <SessionColumnCard key={item.song.id} item={item} onPlay={() => playSong(item.song)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeVideo ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
          <div className="relative mx-4 w-full max-w-5xl overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#121212]" onClick={(event) => event.stopPropagation()}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{activeVideo.title}</p>
                <p className="mt-1 text-xs text-white/46">{activeVideo.artist}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.64rem] text-white/68">{activeVideo.moodLabel}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.64rem] text-white/68">{activeVideo.genreLabel}</span>
                </div>
              </div>
              <button onClick={() => setActiveVideo(null)} className="rounded-full p-2 text-white/60 transition hover:bg-white/[0.06] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video src={activeVideo.videoSrc} controls autoPlay playsInline className="h-full w-full" poster={activeVideo.poster} />
            </div>
            <div className="border-t border-white/8 px-5 py-4">
              <p className="text-sm leading-7 text-white/62">{activeVideo.reason}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
