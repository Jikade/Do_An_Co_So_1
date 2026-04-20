'use client'

import { cn } from '@/lib/tienIch'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { formatDuration } from '@/lib/duLieuGiaLap'
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface MiniPlayerProps {
  className?: string
}

const emotionNames: Record<string, string> = {
  happy: 'Vui vẻ', 
  sad: 'Sâu lắng', 
  calm: 'Bình yên', 
  angry: 'Bùng nổ', 
  romantic: 'Lãng mạn', 
  nostalgic: 'Hoài niệm', 
  energetic: 'Năng động', 
  stressed: 'Trầm ngâm',
};

export function MiniPlayer({ className }: MiniPlayerProps) {
  const {
    nowPlaying,
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
    currentEmotion
  } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)

  if (!nowPlaying) return null

  // Ensure robust localized text
  const currentMoodText = emotionNames[currentEmotion] || currentEmotion;

  return (
    <>
      {/* Injecting highly-performant micro-animations exactly tied to this player */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes audio-bounce {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        .audio-bar { animation: audio-bounce 0.9s cubic-bezier(0.1, 0.7, 0.1, 1) infinite; transform-origin: bottom; }
        .audio-bar:nth-child(1) { animation-delay: 0.0s; }
        .audio-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-bar:nth-child(3) { animation-delay: 0.3s; }
        .audio-bar:nth-child(4) { animation-delay: 0.45s; }
        .audio-bar:nth-child(5) { animation-delay: 0.1s; }
        
        @keyframes magic-ripple {
          0% { box-shadow: 0 0 0 0 var(--brand-accent-light, rgba(30,215,96,0.3)); }
          100% { box-shadow: 0 0 0 12px rgba(30,215,96,0); }
        }
        .play-pulse { animation: magic-ripple 2s infinite cubic-bezier(0.1, 0.7, 0.1, 1); }
        
        /* Sleek custom range sliders */
        .smart-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .smart-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255,255,255,0.7);
          transition: transform 0.2s;
        }
        .smart-slider::-webkit-slider-thumb:hover {
          transform: scale(1.4);
        }
        .volume-slider::-webkit-slider-thumb {
          height: 8px; width: 8px;
        }
      `}} />

      <div
        className={cn(
          'theme-transition fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.04] bg-[#030406]/90 backdrop-blur-2xl antialiased shadow-[0_-20px_50px_rgba(0,0,0,0.5)]',
          className,
        )}
      >
        {/* Ambient Top Glow Layer tied to the song's energy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[30px] opacity-[0.05] bg-gradient-to-t from-transparent to-[var(--brand-accent)] blur-xl" />

        <div className="relative mx-auto max-w-[1540px] px-4 py-3 md:px-5 xl:px-7">
          <div className="flex h-[4.5rem] items-center justify-between gap-6">
            
            {/* ==================================================== */}
            {/* LEFT: DO NOT TOUCH - EXACTLY PRESERVED AS REQUESTED  */}
            {/* ==================================================== */}
            <div className="flex shrink-0 basis-1/4 min-w-[240px]">
              <Link href="/dangPhat" className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[1.1rem] border border-white/8 bg-white/[0.04] shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
                  <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="absolute inset-0 h-full w-full object-cover" />
                  {isPlaying && <div className="absolute inset-0 bg-black/20" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{nowPlaying.title}</p>
                  <p className="truncate text-xs text-white/46">{nowPlaying.artist}</p>
                  <p className="pill-label mt-1 hidden text-[0.66rem] text-white/24 md:block tracking-wide">Đang phát</p>
                </div>
              </Link>
            </div>

            {/* ==================================================== */}
            {/* CENTER: SMART PLAYBACK CONSOLE                       */}
            {/* ==================================================== */}
            <div className="flex flex-1 max-w-[600px] flex-col items-center gap-1.5">
              <div className="flex items-center gap-6">
                
                {/* Audio Spectrum - Only active when playing */}
                <div className="hidden md:flex items-end gap-[3px] h-4 w-6 opacity-60">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={cn("w-1 rounded-t-sm bg-white", isPlaying ? "audio-bar" : "h-[3px]")} />
                   ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={playPrevious} className="hidden h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all hover:bg-white/5 hover:text-white sm:flex">
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={togglePlayPause} 
                    className={cn(
                      "group relative flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95",
                      isPlaying ? "bg-white text-black play-pulse" : "bg-[var(--brand-accent)] text-black shadow-[0_0_20px_rgba(30,215,96,0.2)]"
                    )}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                  </button>
                  <button onClick={playNext} className="hidden h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all hover:bg-white/5 hover:text-white sm:flex">
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

              </div>
              
              {/* Ultra-slim Progress Bar */}
              <div className="hidden w-full items-center gap-3 md:flex mt-0.5 group">
                <span className="text-[0.65rem] font-medium tracking-wide text-white/40 w-10 text-right">{formatDuration(Math.floor(currentTime))}</span>
                <div className="relative flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden flex items-center shadow-inner group-hover:h-1.5 transition-all">
                   <div className="absolute left-0 top-0 bottom-0 bg-[var(--brand-accent)] rounded-full pointer-events-none" style={{ width: `${progress}%` }} />
                   <input
                     type="range"
                     min={0}
                     max={100}
                     value={progress}
                     onChange={(event) => setProgress(Number(event.target.value))}
                     className="smart-slider absolute inset-0 w-full h-full opacity-0"
                   />
                </div>
                <span className="text-[0.65rem] font-medium tracking-wide text-white/40 w-10 text-left">{formatDuration(Math.floor(totalDuration || nowPlaying.duration))}</span>
              </div>
            </div>

            {/* ==================================================== */}
            {/* RIGHT: PREMIUM VISUAL ACTIONS                        */}
            {/* ==================================================== */}
            <div className="flex shrink-0 basis-1/4 justify-end items-center gap-4">
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn('hidden rounded-full p-2 transition-all duration-300 sm:flex active:scale-90', isFavorite ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-white/40 hover:text-white')}
              >
                <Heart className={cn('h-4.5 w-4.5', isFavorite && 'fill-current')} />
              </button>
              
              <div className="group hidden items-center gap-2 md:flex mr-2">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 transition-colors hover:text-white p-1">
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <div className="relative h-1 w-[70px] bg-white/[0.08] rounded-full flex items-center group-hover:h-1.5 transition-all shadow-inner">
                   <div className="absolute left-0 top-0 bottom-0 bg-white/70 rounded-full pointer-events-none group-hover:bg-[var(--brand-accent)] transition-colors" style={{ width: isMuted ? '0%' : `${volume}%` }} />
                   <input
                     type="range"
                     min={0}
                     max={100}
                     value={isMuted ? 0 : volume}
                     onChange={(event) => setVolume(Number(event.target.value))}
                     className="smart-slider volume-slider absolute inset-0 w-full h-full opacity-0"
                   />
                </div>
              </div>

              {/* SMART MOOD BADGE (Replaced bulky text button) */}
              <div className="hidden items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-md transition-all hover:bg-white/[0.06] md:flex cursor-pointer group">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-accent)] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 m-[1px] bg-[var(--brand-accent)]"></span>
                  </span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#ccd5df] group-hover:text-white transition-colors">
                    {currentMoodText}
                  </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  )
}
