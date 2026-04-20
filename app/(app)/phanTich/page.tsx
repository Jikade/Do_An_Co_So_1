'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Clock3,
  Headphones,
  Music2,
  Sparkles,
  Waves,
} from 'lucide-react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockAnalytics, mockEmotions } from '@/lib/duLieuGiaLap'
import { localizedLabel, tasteProfile } from '@/lib/music-intelligence'
import { MoodBadge } from '@/components/huyHieuCamXuc'

export default function AnalyticsPage() {
  const { language, currentEmotion, fusionScore } = useTheme()

  const totalHours = mockAnalytics.weeklyListening.reduce((sum, item) => sum + item.hours, 0)
  const strongestMood = tasteProfile.topMoods[0]
  const strongestGenre = tasteProfile.topGenres[0]
  const strongestArtist = tasteProfile.topArtists[0]

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-elevated overflow-hidden p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="pill-label text-[0.66rem] text-white/35">Taste intelligence</p>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              {language === 'vi' ? 'Gu nhạc, mood pattern và nhịp nghe của bạn nằm ở đây.' : 'Your taste profile, mood pattern, and listening rhythm live here.'}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 md:text-base">
              {language === 'vi'
                ? 'Trang phân tích giờ không chỉ là thống kê khô. Nó gom cả genre, artist, mood, khung giờ nghe và logic đề xuất thành một bức chân dung nghe nhạc rõ ràng hơn.'
                : 'Analytics is no longer dry statistics. It now combines genre, artist, mood, listening windows, and recommendation logic into a clearer taste portrait.'}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="pill-label text-[0.62rem] text-white/30">Current sync</p>
            <div className="mt-4 flex items-center gap-4">
              <MoodBadge emotion={currentEmotion} size="lg" animated />
              <div>
                <p className="text-3xl font-bold text-white">{fusionScore}%</p>
                <p className="text-xs text-white/42">{language === 'vi' ? 'Mood confidence' : 'Mood confidence'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--brand-accent)]">
            <Music2 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Top genre' : 'Top genre'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestGenre.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestGenre.value}% {language === 'vi' ? 'trọng số trong profile' : 'weight in your profile'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--song-primary)]">
            <Headphones className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Top artist' : 'Top artist'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestArtist.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestArtist.value}% {language === 'vi' ? 'xuất hiện trong replay' : 'presence in replay loops'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[#f59e0b]">
            <Brain className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Dominant mood' : 'Dominant mood'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestMood.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestMood.value}% {language === 'vi' ? 'dấu vết mood' : 'mood share'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-white">
            <Clock3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Weekly hours' : 'Weekly hours'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{totalHours.toFixed(1)}h</h3>
          <p className="mt-2 text-sm text-white/42">{language === 'vi' ? 'được giữ khá đều cả tuần' : 'kept fairly consistent across the week'}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_24rem]">
        <div className="space-y-6">
          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Profile clusters</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Hai lớp profile mạnh nhất của bạn' : 'Your strongest profile layers'}</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-[var(--brand-accent)]" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {tasteProfile.clusters.map((cluster) => (
                <div key={cluster.id} className="glass rounded-[1.5rem] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{localizedLabel(cluster.title, language)}</h3>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cluster.accent }} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/56">{localizedLabel(cluster.description, language)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Mood distribution</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Cảm xúc nào đang dẫn profile' : 'What mood leads your profile'}</h2>
              </div>
              <Link href="/nhanDienCamXuc" className="text-sm font-medium text-[var(--brand-accent)] hover:underline">
                {language === 'vi' ? 'Quét lại mood' : 'Scan mood again'}
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {tasteProfile.topMoods.map((mood) => {
                const matched = mockEmotions.find((item) => item.id === mood.id)
                return (
                  <div key={mood.id} className="rounded-[1.3rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{matched?.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{localizedLabel(mood.label, language)}</p>
                          <p className="text-xs text-white/42">{tasteProfile.recommendationReasons[mood.id as keyof typeof tasteProfile.recommendationReasons][language]}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white">{mood.value}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full" style={{ width: `${mood.value}%`, backgroundColor: mood.accent }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Listening rhythm</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Khung giờ và nhịp nghe trong tuần' : 'Listening windows and weekly rhythm'}</h2>
              </div>
              <Waves className="h-5 w-5 text-[var(--song-primary)]" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {tasteProfile.listeningWindows.map((window) => (
                <div key={window.id} className="glass rounded-[1.5rem] p-5">
                  <p className="pill-label text-[0.6rem] text-white/28">Peak window</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{localizedLabel(window.label, language)}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/56">{localizedLabel(window.summary, language)}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] via-[var(--song-primary)] to-[var(--song-secondary)]" style={{ width: `${window.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {mockAnalytics.weeklyListening.map((day) => (
                <div key={day.day} className="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
                  <p className="text-xs text-white/34">{day.day}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{day.hours}</p>
                  <p className="text-[0.68rem] text-white/38">h</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Taste profile</p>
            <div className="mt-4 space-y-3">
              {tasteProfile.topGenres.map((genre) => (
                <div key={genre.id} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{localizedLabel(genre.label, language)}</p>
                    <span className="text-sm text-white/48">{genre.value}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full" style={{ width: `${genre.value}%`, backgroundColor: genre.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Top artists</p>
            <div className="mt-4 space-y-3">
              {tasteProfile.topArtists.map((artist) => (
                <div key={artist.id} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-medium text-white">{localizedLabel(artist.label, language)}</p>
                  <span className="text-sm text-white/48">{artist.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Recommendation engine</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{language === 'vi' ? 'Lý do đề xuất' : 'Why recommendations fit'}</h3>
            <p className="mt-3 text-sm leading-7 text-white/56">{tasteProfile.recommendationReasons[currentEmotion][language]}</p>
            <Link href="/goiY" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-accent)] hover:underline">
              {language === 'vi' ? 'Mở gợi ý theo profile' : 'Open profile-based picks'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Next upgrade</p>
            <div className="mt-4 rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(124,141,255,0.16),rgba(255,255,255,0.03))] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Sparkles className="h-4 w-4 text-[var(--song-primary)]" />
                {language === 'vi' ? 'Mood + taste + assistant' : 'Mood + taste + assistant'}
              </div>
              <p className="mt-3 text-sm leading-7 text-white/56">
                {language === 'vi'
                  ? 'Chatbox có thể đọc yêu cầu, map sang hành động trong app và tận dụng cả mood lẫn taste profile để giải thích vì sao bài hát đó nên phát tiếp.'
                  : 'The chatbox can read intent, map it to safe in-app actions, and use both mood and taste profile to explain why a track should play next.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
