"use client";

import { useMemo, useState, useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import {
  Heart,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import { useTheme } from "@/lib/nguCanhGiaoDien";
import { mockSongs, formatDuration } from "@/lib/duLieuGiaLap";
import { cn } from "@/lib/tienIch";
import { MoodBadge } from "@/components/huyHieuCamXuc";
import { Slider } from "@/components/ui/slider";

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
  } = useTheme();

  const [isFavorite, setIsFavorite] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isShuffled, setIsShuffled] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);

  const currentSong = nowPlaying || mockSongs[0];
  const lyrics = language === "vi" ? currentSong.lyricsVi : currentSong.lyricsEn;
  const displayedDuration = totalDuration || currentSong.duration;

  // Cân chỉnh index tránh lỗi range
  const activeLyricIndex = Math.min(
    lyrics.length - 1,
    Math.max(
      0,
      Math.floor((currentTime / Math.max(displayedDuration, 1)) * lyrics.length)
    )
  );

  const queueSongs = useMemo(() => {
    return mockSongs.filter((song) => song.id !== currentSong.id).slice(0, 6);
  }, [currentSong]);

  const moodLine =
    lyrics[activeLyricIndex] ||
    (language === "vi"
      ? "Khoảnh khắc này như được tạo ra chỉ để dành cho ta."
      : "This moment feels like it was made just for us.");

  const cycleRepeat = () => {
    if (repeatMode === "off") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("off");
  };

  // --- Refs cho GSAP ---
  const containerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const heroInfoRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const playlistItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1) GSAP: Reveal Timeline
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Khởi tạo trạng thái (ẩn & hạ xuống) để reveal mượt mà
      gsap.set([coverRef.current, heroInfoRef.current, controlsRef.current], { 
        opacity: 0, 
        y: 30 
      });
      // Playlist item lệch sang trái/phải chút để trượt vào
      gsap.set(playlistItemsRef.current, { 
        opacity: 0, 
        x: 20 
      });

      // Bắt đầu chuỗi animation
      tl.to(coverRef.current, { opacity: 1, y: 0, duration: 1.2 })
        .to(heroInfoRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
        .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(playlistItemsRef.current, { 
          opacity: 1, 
          x: 0, 
          stagger: 0.08, 
          duration: 0.6 
        }, "-=0.4");
    });

    return () => ctx.revert(); // Cleanup GSAP mỗi khi đổi cycle
  }, [currentSong.id]);

  // 2) GSAP: Aura Pulse
  useEffect(() => {
    if (!auraRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isPlaying) {
        // Pulse nhẹ theo điệu nhạc
        gsap.to(auraRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      } else {
        // Thu về trạng thái tĩnh
        gsap.to(auraRef.current, {
          scale: 1,
          opacity: 0.4,
          duration: 1,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[calc(100vh-6rem)] w-full flex-col overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#030407] shadow-2xl"
      style={
        {
          "--song-primary": currentSong.palette.primary,
          "--song-secondary": currentSong.palette.secondary,
        } as CSSProperties
      }
    >
      {/* ======================================================= */}
      {/* BACKGROUND & ATMOSPHERE (Cinematic VIP Room)            */}
      {/* ======================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2rem]">
        {/* Glow chính phía trên */}
        <div 
          className="absolute left-[-15%] top-[-10%] h-[70%] w-[70%] rounded-full opacity-[0.14] blur-[140px] transition-colors duration-1000"
          style={{ background: currentSong.palette.primary }}
        />
        {/* Glow phụ phía dưới */}
        <div 
          className="absolute bottom-[-15%] right-[-10%] h-[60%] w-[60%] rounded-full opacity-[0.10] blur-[140px] transition-colors duration-1000"
          style={{ background: currentSong.palette.secondary }}
        />
        {/* Vignette (Tạo chiều sâu tập trung vào giữa) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)]" />
        {/* Lớp noise xốp nhẹ (grain layer) */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')"}}>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-1 flex-col px-4 pb-8 pt-6 sm:px-6 md:px-8 xl:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 xl:flex-row xl:items-stretch xl:justify-between">
          
          {/* ======================================================= */}
          {/* MIDDLE: HERO STAGE (The "VIP" Hub)                        */}
          {/* ======================================================= */}
          <section className="flex flex-1 flex-col rounded-[2.5rem] border border-white/[0.04] bg-white/[0.015] p-6 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_30px_60px_rgba(0,0,0,0.5)] md:p-8 xl:max-w-[760px]">
            {/* Stage Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--song-primary)] drop-shadow-[0_0_12px_var(--song-primary)] opacity-80">
                  Premium Experience
                </span>
                <h1 className="text-xl font-semibold tracking-tight text-white/90">
                  Immersion Stage
                </h1>
              </div>
              <MoodBadge emotion={currentEmotion} size="md" className="border-white/10 bg-white/5 backdrop-blur-md" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-10 md:gap-14">
              
              {/* Cover Art Stage */}
              <div ref={coverRef} className="relative group w-full max-w-[280px] md:max-w-[340px]">
                {/* Aura Bloom phía sau bao quanh Cover */}
                <div
                  ref={auraRef}
                  className="absolute -inset-10 z-0 rounded-full blur-[80px] mix-blend-screen transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, ${currentSong.palette.primary}77 0%, ${currentSong.palette.secondary}22 50%, transparent 80%)`,
                  }}
                />
                
                {/* Chứa Cover ảnh thật */}
                <div className="relative z-10 aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_45px_100px_rgba(0,0,0,0.8)] group-hover:-translate-y-2">
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Light sweep overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-black/30 pointer-events-none" />
                </div>
              </div>

              {/* Info & Micro-interactions */}
              <div className="flex w-full flex-col items-center max-w-[500px]">
                <div ref={heroInfoRef} className="text-center mb-8 w-full">
                  <h2 className="line-clamp-1 text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white md:text-[3.2rem] drop-shadow-xl transition-colors">
                    {currentSong.title}
                  </h2>
                  <p className="mt-2 text-lg font-medium tracking-wide text-white/50">
                    {currentSong.artist}
                  </p>
                  
                  {/* Lyric / Mood Insight */}
                  <div className="mt-6 flex justify-center">
                    <p className="max-w-[85%] rounded-[1.2rem] bg-gradient-to-b from-white/[0.04] to-white/[0.01] px-6 py-3 text-center text-[0.85rem] italic leading-relaxed text-white/40 border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md">
                      "{moodLine}"
                    </p>
                  </div>
                </div>

                {/* Progress & Control Hub */}
                <div ref={controlsRef} className="w-full">
                  <div className="mb-6 px-4">
                    <Slider
                      value={[progress]}
                      onValueChange={(value) => setProgress(value[0])}
                      max={100}
                      step={0.1}
                      className="cursor-pointer py-1"
                    />
                    <div className="mt-3 flex items-center justify-between text-[0.7rem] font-semibold tracking-widest text-white/30 uppercase">
                      <span>{formatDuration(Math.floor(currentTime))}</span>
                      <span>{formatDuration(Math.floor(displayedDuration))}</span>
                    </div>
                  </div>

                  {/* Primary Playback buttons */}
                  <div className="flex items-center justify-center gap-4 md:gap-7">
                    <button
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={cn(
                        "rounded-full p-3 transition hover:bg-white/5 active:scale-95",
                        isShuffled ? "text-[var(--song-primary)] drop-shadow-[0_0_8px_var(--song-primary)]" : "text-white/40 hover:text-white/80"
                      )}
                    >
                      <Shuffle className="h-5 w-5" />
                    </button>

                    <button
                      onClick={playPrevious}
                      className="rounded-full p-3 text-white/60 transition hover:bg-white/5 hover:text-white active:scale-90"
                    >
                      <SkipBack className="h-7 w-7" fill="currentColor" />
                    </button>

                    {/* Gradient VIP Play Button */}
                    <button
                      onClick={togglePlayPause}
                      className="group relative flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      <div className="absolute inset-0 rounded-full bg-white opacity-95 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                      <div className="absolute -inset-1 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" style={{background: 'white'}} />
                        
                      {isPlaying ? (
                        <Pause className="relative z-10 h-8 w-8 fill-black text-black" />
                      ) : (
                        <Play className="relative z-10 ml-2 h-9 w-9 fill-black text-black" />
                      )}
                    </button>

                    <button
                      onClick={playNext}
                      className="rounded-full p-3 text-white/60 transition hover:bg-white/5 hover:text-white active:scale-90"
                    >
                      <SkipForward className="h-7 w-7" fill="currentColor" />
                    </button>

                    <button
                      onClick={cycleRepeat}
                      className={cn(
                        "rounded-full p-3 transition hover:bg-white/5 active:scale-95",
                        repeatMode !== "off" ? "text-[var(--song-primary)] drop-shadow-[0_0_8px_var(--song-primary)]" : "text-white/40 hover:text-white/80"
                      )}
                    >
                      {repeatMode === "one" ? (
                        <Repeat1 className="h-5 w-5" />
                      ) : (
                        <Repeat className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Secondary Controls (Vol, Heart, Shared layout) */}
                  <div className="mt-8 flex items-center justify-between px-3">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={cn(
                        "rounded-full p-3 transition hover:bg-white/5 active:scale-90",
                        isFavorite ? "text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" : "text-white/40 hover:text-white"
                      )}
                    >
                      <Heart className={cn("h-6 w-6", isFavorite && "fill-current")} />
                    </button>

                    <div className="flex w-36 items-center gap-3">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white/40 transition hover:text-white"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================= */}
          {/* RIGHT: SECONDARY EXPERIENCE PANEL                       */}
          {/* ======================================================= */}
          <aside className="flex w-full flex-col gap-5 xl:w-[360px]">
            
            {/* Active Now Playing Status */}
            <div className="group flex items-center gap-4 rounded-[2rem] border border-white/[0.04] bg-white/[0.015] p-3 pl-4 backdrop-blur-xl shadow-lg transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10 hover:shadow-2xl">
               <div className="relative">
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="h-14 w-14 rounded-2xl object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                  {isPlaying && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--song-primary)] shadow-[0_0_12px_var(--song-primary)]">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--song-primary)] opacity-75"></span>
                      <div className="h-2 w-2 rounded-full bg-white shadow-sm"></div>
                    </span>
                  )}
               </div>
               <div className="min-w-0 flex-1">
                 <p className="truncate text-[0.95rem] font-bold text-white/90">
                   {currentSong.title}
                 </p>
                 <p className="truncate text-[0.75rem] text-white/50">
                   {currentSong.artist}
                 </p>
                 <div className="pt-1">
                   <p className="text-[0.55rem] uppercase tracking-[0.25em] text-[var(--song-primary)] font-semibold">{t ? t('nowPlaying') : 'Hiện đang phát'}</p>
                 </div>
               </div>
               {/* Visualizer micro-anim */}
               <div className="pr-4">
                 <div className="flex h-5 items-end justify-center gap-[2px]">
                   {Array.from({ length: 4 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-[3px] rounded-t-sm"
                        style={{
                          background: `var(--song-primary)`,
                          height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                          transition: 'height 0.2s ease',
                          opacity: 0.8
                        }}
                      />
                   ))}
                 </div>
               </div>
            </div>

            {/* Main Panel (Queue & Lyrics) */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-[20px] shadow-2xl">
              
              {/* Header Toggles */}
              <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white/50">
                   {t ? t('queue') : 'Tiếp tục phát'}
                </h3>
                <button 
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="rounded-full bg-white/[0.04] px-4 py-1.5 text-[0.7rem] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {showLyrics ? (language === 'vi' ? "Ẩn Lời Nhạc" : "Hide Lyrics") : (language === 'vi' ? "Xem Lời Nhạc" : "Show Lyrics")}
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto hidden-scrollbar pb-6">
                
                {/* Lời bài hát Section (Cinematic Fade) */}
                {showLyrics && (
                  <div className="px-6 py-6 border-b border-white/[0.03]">
                     <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30">
                        {t ? t('lyrics') : 'Lời bài hát'}
                     </p>
                     
                     <div 
                        className="relative max-h-[200px] overflow-y-auto hidden-scrollbar pr-2"
                        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)' , WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                     >
                        <div className="space-y-4 py-6">
                          {lyrics.map((line, index) => {
                            const isActive = index === activeLyricIndex;
                            return (
                              <p
                                key={`${line}-${index}`}
                                className={cn(
                                  "text-[0.95rem] leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  isActive
                                    ? "origin-left scale-[1.03] font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                                    : "text-white/20 hover:text-white/40"
                                )}
                              >
                                {line}
                              </p>
                            );
                          })}
                        </div>
                     </div>
                  </div>
                )}

                {/* Queue / Up Next Section */}
                <div className="p-4">
                  <div className="space-y-2">
                    {queueSongs.map((song, index) => (
                      <div
                        key={song.id}
                        ref={(el) => { playlistItemsRef.current[index] = el; }}
                        className="group relative flex cursor-pointer items-center gap-4 rounded-2xl p-2.5 transition-all duration-500 hover:bg-white/[0.05] hover:shadow-lg"
                      >
                         <div className="relative aspect-square w-[3.25rem] overflow-hidden rounded-xl bg-black/40 shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
                           <img 
                             src={song.coverUrl} 
                             alt={song.title}
                             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.15]"
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                             <Play className="h-5 w-5 fill-white text-white drop-shadow-md" />
                           </div>
                         </div>
                         <div className="min-w-0 flex-1">
                           <p className="truncate text-[0.85rem] font-semibold text-white/70 transition-colors group-hover:text-white">
                             {song.title}
                           </p>
                           <p className="truncate text-[0.7rem] text-white/40 group-hover:text-white/60 transition-colors">
                             {song.artist}
                           </p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </aside>
          
        </div>
      </div>

      {/* CSS Utility Ẩn Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
