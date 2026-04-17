'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockSongs, formatDuration } from '@/lib/duLieuGiaLap'
import { cn } from '@/lib/tienIch'
import { MoodBadge } from '@/components/huyHieuCamXuc'
import { SongCard } from '@/components/theBaiHat'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, Volume2, VolumeX, ListMusic, Maximize2, Share2, Speaker, ChevronDown, MoreHorizontal } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

export default function NowPlayingPage() {
  const {
    language,
    t,
    nowPlaying,
    currentEmotion,
    isPlaying,
    togglePlayPause,
    playPrevious,
    playNext,
    currentTime,
    totalDuration,
    progress,
    setProgress,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
  } = useTheme()

  const [isFavorite, setIsFavorite] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [isShuffled, setIsShuffled] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [showDevices, setShowDevices] = useState(false)

  const currentSong = nowPlaying || mockSongs[0]

  const relatedSongs = useMemo(() => {
    const ids = currentSong.relatedSongIds || []
    const fromIds = mockSongs.filter((song) => ids.includes(song.id))
    const duPhong = mockSongs.filter((song) => song.id !== currentSong.id && !ids.includes(song.id)).slice(0, Math.max(0, 4 - fromIds.length))
    return [...fromIds, ...duPhong].slice(0, 4)
  }, [currentSong])

  const queueSongs = mockSongs.filter((song) => song.id !== currentSong.id).slice(0, 5)
  const loiBaiHat = language === 'vi' ? currentSong.lyricsVi : currentSong.lyricsEn
  const thoiLuongHienThi = totalDuration || currentSong.duration
  const chiSoLoiDangHat = Math.min(loiBaiHat.length - 1, Math.floor((currentTime / Math.max(thoiLuongHienThi, 1)) * loiBaiHat.length))

  const devices = [
    { id: 'phone', name: language === 'vi' ? 'Máy này' : 'This device', active: true },
    { id: 'speaker', name: 'Bluetooth Speaker', active: false },
    { id: 'headphones', name: 'Tai nghe AirPods', active: false },
  ]

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all')
    else if (repeatMode === 'all') setRepeatMode('one')
    else setRepeatMode('off')
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0">
        <img src={currentSong.coverUrl} alt={currentSong.title} className="h-full w-full object-cover opacity-25 blur-xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      </div>

<<<<<<< HEAD
      <div className="relative z-10 pb-32 pt-4">
        <div className="mx-auto max-w-6xl">
=======
      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button className="p-2"><ChevronDown className="w-6 h-6 text-foreground" /></button>
            <span className="text-sm font-medium text-foreground">{t('nowPlaying')}</span>
            <button className="p-2"><MoreHorizontal className="w-6 h-6 text-foreground" /></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-square mb-8">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-secondary/20">
                  <img src={currentSong.coverUrl} alt={currentSong.title} className={cn('h-full w-full object-cover transition-transform duration-700', isPlaying && 'scale-[1.03]')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                </div>
                <div className="absolute -inset-4 rounded-3xl opacity-40 blur-xl -z-10" style={{ backgroundColor: currentSong.palette.primary }} />
              </div>

              <div className="text-center mb-6 w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MoodBadge emotion={currentEmotion} size="sm" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{currentSong.title}</h1>
                <p className="text-muted-foreground">{currentSong.artist}</p>
                <p className="text-sm text-muted-foreground/70">{currentSong.album}</p>
              </div>

              <div className="w-full max-w-md mb-6">
                <Slider value={[progress]} onValueChange={(value) => setProgress(value[0])} max={100} step={0.1} className="cursor-pointer" />
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground tabular-nums">
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{formatDuration(Math.floor(thoiLuongHienThi))}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
                <button onClick={() => setIsShuffled(!isShuffled)} className={cn('p-2 rounded-full transition-colors', isShuffled ? 'text-[var(--song-primary)]' : 'text-muted-foreground hover:text-foreground')}>
                  <Shuffle className="w-5 h-5" />
                </button>
                <button onClick={playPrevious} className="p-3 rounded-full text-foreground hover:bg-secondary/50 transition-colors">
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>
<<<<<<< HEAD
                <button onClick={togglePlayPause} className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_20px_40px_rgba(30,215,96,0.24)] transition-transform hover:scale-105 md:h-20 md:w-20">
=======
                <button onClick={togglePlayPause} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                  {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />}
                </button>
                <button onClick={playNext} className="p-3 rounded-full text-foreground hover:bg-secondary/50 transition-colors">
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>
                <button onClick={cycleRepeat} className={cn('p-2 rounded-full transition-colors', repeatMode !== 'off' ? 'text-[var(--song-primary)]' : 'text-muted-foreground hover:text-foreground')}>
                  {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between w-full max-w-md">
                <button onClick={() => setIsFavorite(!isFavorite)} className={cn('p-2 rounded-full transition-colors', isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground')}>
                  <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-muted-foreground hover:text-foreground">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <Slider value={[isMuted ? 0 : volume]} onValueChange={(value) => setVolume(value[0])} max={100} className="w-24 cursor-pointer" />
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => setShowQueue(!showQueue)} className={cn('p-2 rounded-full transition-colors', showQueue ? 'text-[var(--song-primary)]' : 'text-muted-foreground hover:text-foreground')}>
                    <ListMusic className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowDevices(!showDevices)} className={cn('p-2 rounded-full transition-colors', showDevices ? 'text-[var(--song-primary)]' : 'text-muted-foreground hover:text-foreground')}>
                    <Speaker className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-foreground">{t('lyrics')}</span>
                  <button className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"><Maximize2 className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {loiBaiHat.map((dong, index) => (
                    <p key={index} className={cn('text-sm transition-all', index === chiSoLoiDangHat ? 'text-[var(--song-primary)] font-medium scale-105 origin-left' : 'text-muted-foreground')}>
                      {dong}
                    </p>
                  ))}
                </div>
              </div>

              {showDevices && (
                <div className="glass rounded-2xl p-4">
                  <span className="font-medium text-foreground block mb-4">{t('outputDevice')}</span>
                  <div className="space-y-2">
                    {devices.map((device) => (
                      <button key={device.id} className={cn('w-full flex items-center gap-3 p-3 rounded-xl transition-all', device.active ? 'bg-[var(--song-primary)]/20 text-[var(--song-primary)]' : 'hover:bg-secondary/50 text-foreground')}>
                        <Speaker className="w-5 h-5" />
                        <span className="text-sm font-medium">{device.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showQueue && (
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-foreground">{t('queue')}</span>
                    <span className="text-xs text-muted-foreground">{queueSongs.length} {language === 'vi' ? 'bài' : 'songs'}</span>
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {queueSongs.map((song) => (
                      <SongCard key={song.id} song={song} variant="list" showDuration={false} />
                    ))}
                  </div>
                </div>
              )}

              <div className="glass rounded-2xl p-4">
                <span className="font-medium text-foreground block mb-4">{t('relatedTracks')}</span>
                <div className="space-y-1">
                  {relatedSongs.map((song) => (
                    <SongCard key={song.id} song={song} variant="list" />
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-[var(--song-primary)]/10 to-transparent">
                <span className="text-sm font-medium text-foreground block mb-2">{language === 'vi' ? 'Hiệu ứng cảm xúc' : 'Emotion Effect'}</span>
                <p className="text-xs text-muted-foreground mb-3">
                  {language === 'vi'
<<<<<<< HEAD
                    ? `File nhạc hiện đang lấy từ ${currentSong.audioUrl}. Chỉ cần đặt audio vào public/audio và ảnh bìa vào public/img là ứng dụng sẽ tự nhận.`
                    : `The current audio is loaded from ${currentSong.audioUrl}. Keep audio in public/audio and cover art in public/img and the app will pick them up.`}
=======
                    ? `File nhạc hiện đang lấy từ ${currentSong.audioUrl}. Bạn chỉ cần bỏ đúng mp3 vào thư mục public/nhac là chạy.`
                    : `The current audio is loaded from ${currentSong.audioUrl}. Put the correct mp3 inside public/nhac and it will play.`}
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                </p>
                <MoodBadge emotion={currentEmotion} size="md" animated />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
