'use client'

import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockPlaylists, mockSongs, mockUser, mockAnalytics, formatDuration } from '@/lib/duLieuGiaLap'
import { MoodBadge } from '@/components/huyHieuCamXuc'
import { FusionScoreCard } from '@/components/theDiemKetHop'
import { SongCard } from '@/components/theBaiHat'
import { PlaylistCard } from '@/components/theDanhSachPhat'
import { InsightCard } from '@/components/theThongTin'
import { UpgradeCard } from '@/components/theNangCap'
import Link from 'next/link'
import { Play, Pause, Heart, Sparkles, TrendingUp, Clock, Brain, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const { t, language, currentEmotion, nowPlaying, fusionScore, isPlaying, togglePlayPause, currentTime } = useTheme()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return language === 'vi' ? 'Chào buổi sáng' : 'Good morning'
    if (hour < 18) return language === 'vi' ? 'Chào buổi chiều' : 'Good afternoon'
    return language === 'vi' ? 'Chào buổi tối' : 'Good evening'
  }

  const recentSongs = mockSongs.slice(0, 4)
  const recommendedPlaylists = mockPlaylists.filter((playlist) => playlist.emotion === currentEmotion).slice(0, 4)
  const featuredPlaylist = mockPlaylists.find((playlist) => playlist.emotion === currentEmotion) || mockPlaylists[0]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">{greeting()},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{mockUser.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[var(--song-primary)]" />
            <span className="text-sm text-muted-foreground">{t('currentMood')}:</span>
            <MoodBadge emotion={currentEmotion} size="sm" />
          </div>
        </div>
      </div>

      {nowPlaying && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="relative p-6 md:p-8">
            <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_35%)]" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl glow-soft bg-secondary/30">
                <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{t('nowPlayingLabel')}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{nowPlaying.title}</h2>
                <p className="text-muted-foreground mb-4">{nowPlaying.artist} • {nowPlaying.album}</p>

                <div className="mb-4">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--song-primary)] rounded-full transition-all glow-soft" style={{ width: `${Math.min((currentTime / nowPlaying.duration) * 100, 100)}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground tabular-nums">
                    <span>{formatDuration(Math.floor(currentTime))}</span>
                    <span>{formatDuration(nowPlaying.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={togglePlayPause} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>
                  <button className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <Link href="/dangPhat" className="ml-auto">
                    <button className="px-4 py-2 rounded-xl bg-secondary/50 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors flex items-center gap-2">
                      {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="glass rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">{language === 'vi' ? 'Cảm xúc hiện tại' : 'Current emotion'}</p>
                  <MoodBadge emotion={currentEmotion} size="lg" animated />
                  <p className="text-2xl font-bold text-foreground mt-2">{fusionScore}%</p>
                  <p className="text-xs text-muted-foreground">{t('confidence')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InsightCard title={t('currentMood')} value={t(currentEmotion)} icon={Brain} trend={{ value: 12, isPositive: true }} />
        <InsightCard title={t('fusionScore')} value={`${fusionScore}%`} subtitle={language === 'vi' ? 'Độ chính xác cao' : 'High accuracy'} icon={TrendingUp} />
        <InsightCard title={t('recommendationCount')} value="24" subtitle={language === 'vi' ? 'Playlist mới' : 'New playlists'} icon={Sparkles} />
        <InsightCard title={language === 'vi' ? 'Thời gian nghe' : 'Listening time'} value="3h 42m" subtitle={language === 'vi' ? 'Hôm nay' : 'Today'} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{t('forYou')}</h3>
              <Link href="/goiY" className="text-sm text-[var(--song-primary)] hover:underline flex items-center gap-1">
                {language === 'vi' ? 'Xem tất cả' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <PlaylistCard playlist={featuredPlaylist} variant="hero" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{language === 'vi' ? 'Playlist theo tâm trạng' : 'Mood Playlists'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(recommendedPlaylists.length > 0 ? recommendedPlaylists : mockPlaylists.slice(0, 4)).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} variant="default" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{t('recentlyPlayed')}</h3>
              <Link href="/lichSu" className="text-sm text-[var(--song-primary)] hover:underline flex items-center gap-1">
                {language === 'vi' ? 'Xem tất cả' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="glass rounded-2xl divide-y divide-border/50">
              {recentSongs.map((song) => (
                <SongCard key={song.id} song={song} variant="list" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FusionScoreCard size="lg" />

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-foreground">AI Insight</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === 'vi'
                ? `Dựa trên phân tích, bạn đang có tâm trạng ${t(currentEmotion).toLowerCase()}. Ứng dụng ưu tiên đề xuất các bài đang có ảnh bìa và file nhạc cục bộ để bạn demo mượt hơn.`
                : `Based on our analysis, you're feeling ${t(currentEmotion).toLowerCase()}. The app prioritizes local cover images and audio files for a smoother demo.`}
            </p>
            <Link href="/nhanDienCamXuc">
              <button className="mt-4 w-full py-2 rounded-xl bg-[var(--song-primary)]/20 text-[var(--song-primary)] text-sm font-medium hover:bg-[var(--song-primary)]/30 transition-colors">
                {language === 'vi' ? 'Phân tích lại' : 'Analyze again'}
              </button>
            </Link>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">{t('moodTrend')}</span>
              <Link href="/phanTich" className="text-xs text-[var(--song-primary)]">
                {language === 'vi' ? 'Chi tiết' : 'Details'}
              </Link>
            </div>
            <div className="flex items-end justify-between h-20 gap-1">
              {mockAnalytics.moodTrend.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-[var(--song-primary)]/60 transition-all hover:bg-[var(--song-primary)]" style={{ height: `${item.score * 0.8}%` }} />
                </div>
              ))}
            </div>
          </div>

          <UpgradeCard />
        </div>
      </div>
    </div>
  )
}
