'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Orbit, Cpu, Compass, Settings2, Sliders, AudioLines, WandSparkles } from 'lucide-react';
import { cn } from '@/lib/tienIch';
import { MoodBadge } from '@/components/huyHieuCamXuc';

// ------------------------------------
// SPACE DEFINITIONS
// ------------------------------------
type SpaceTheme = 'chill' | 'aurora' | 'neonDream' | 'deepNight' | 'galaxyCalm' | 'romantic' | 'zen';

interface SpacePreset {
  id: SpaceTheme;
  title: string;
  subtitle: string;
  gradient: string;
  activeColor: string;
  mappedEmotions: string[];
}

const presets: SpacePreset[] = [
  { id: 'chill', title: 'Lofi Chill', subtitle: 'Hòa âm tĩnh lặng', gradient: 'from-[#e0c3fc]/10 via-[#8ec5fc]/10 to-transparent', activeColor: '#8ec5fc', mappedEmotions: ['calm', 'nostalgic'] },
  { id: 'aurora', title: 'Bắc Cực Quang', subtitle: 'Xanh lục và tím sậm', gradient: 'from-[#43e97b]/10 via-[#38f9d7]/10 to-transparent', activeColor: '#43e97b', mappedEmotions: ['energetic', 'happy'] },
  { id: 'neonDream', title: 'Neon Dream', subtitle: 'Cyberpunk Bass', gradient: 'from-[#f43b47]/10 via-[#453a94]/20 to-transparent', activeColor: '#f43b47', mappedEmotions: ['angry', 'stressed'] },
  { id: 'deepNight', title: 'Đêm Thẳm', subtitle: 'Tần số Sleep', gradient: 'from-[#141e30]/40 via-[#243b55]/20 to-transparent', activeColor: '#4facfe', mappedEmotions: ['sad'] },
  { id: 'galaxyCalm', title: 'Thiên Hà', subtitle: 'Vũ trụ mở rộng', gradient: 'from-[#30cfd0]/10 via-[#330867]/20 to-transparent', activeColor: '#30cfd0', mappedEmotions: [] },
  { id: 'romantic', title: 'Mật Ngọt', subtitle: 'Giai điệu lãng mạn', gradient: 'from-[#ff9a9e]/20 via-[#fecfef]/10 to-transparent', activeColor: '#ff9a9e', mappedEmotions: ['romantic'] },
];

export default function SpaceControllerPage() {
  const { currentEmotion, nowPlaying, language } = useTheme();
  
  const [autoSync, setAutoSync] = useState(true);
  const [activeSpace, setActiveSpace] = useState<SpaceTheme>('chill');
  const [intensity, setIntensity] = useState(70);
  const [energy, setEnergy] = useState(40);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto Sync Logic
  useEffect(() => {
    if (autoSync) {
      const matched = presets.find(p => p.mappedEmotions.includes(currentEmotion));
      if (matched) setActiveSpace(matched.id);
    }
  }, [currentEmotion, autoSync]);

  // Handle Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-el', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Handle Environment Shift Animation
  useEffect(() => {
    if (previewRef.current) {
       gsap.fromTo(previewRef.current,
         { opacity: 0.5 },
         { opacity: 1, duration: 2, ease: 'sine.inOut' }
       );
    }
  }, [activeSpace, intensity]);

  const currentPreset = presets.find(p => p.id === activeSpace) || presets[0];

  return (
    <div ref={containerRef} className="pb-32 lg:pb-12 min-h-screen text-white antialiased">
      
      {/* CSS For Smooth Elegant Melody Waves */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gentle-wave {
          0%, 100% { transform: scaleY(0.2); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .melody-bar {
          animation: gentle-wave 2s infinite ease-in-out;
          transform-origin: bottom center;
        }
        input[type=range]::-webkit-slider-thumb {
           -webkit-appearance: none;
           height: 14px;
           width: 14px;
           border-radius: 50%;
           background: white;
           box-shadow: 0 0 10px ${currentPreset.activeColor};
           margin-top: 0px;
        }
      `}} />

      {/* HEADER */}
      <header className="reveal-el mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                 <Orbit className="h-5 w-5 text-[#a88beb]" />
               </div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{language === 'vi' ? 'Không Gian Cảm Xúc' : 'Emotion Space'}</h1>
            </div>
            <p className="mt-3 max-w-2xl text-[0.95rem] text-white/50 font-light leading-relaxed">
              {language === 'vi' 
                ? 'Đồng bộ thính giác và thị giác. Tuỳ biến dải tần số âm thanh và màu sắc không gian ảo theo cảm xúc hiện tại.' 
                : 'The environment visual engine. Adapts the app visual core to your current emotional state or manual overrides.'}
            </p>
         </div>

         {/* MASTER TOGGLE */}
         <div className="flex bg-[#050608] border border-white/10 rounded-full p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <button 
               onClick={() => setAutoSync(true)}
               className={cn(
                 "flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.7rem] font-bold uppercase tracking-widest transition-all duration-300",
                 autoSync ? "bg-[var(--brand-accent)] text-black shadow-[0_0_20px_rgba(30,215,96,0.3)]" : "text-white/40 hover:text-white"
               )}
            >
               <WandSparkles className="h-3.5 w-3.5" /> AUTO SYNC
            </button>
            <button 
               onClick={() => setAutoSync(false)}
               className={cn(
                 "flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.7rem] font-bold uppercase tracking-widest transition-all duration-300",
                 !autoSync ? "bg-[#a88beb] text-black shadow-[0_0_20px_rgba(168,139,235,0.3)]" : "text-white/40 hover:text-white"
               )}
            >
               <Settings2 className="h-3.5 w-3.5" /> MANUAL
            </button>
         </div>
      </header>

      {/* MAIN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">

         {/* ========================================================= */}
         {/* LEFT PANE: LIVE PREVIEW ENVIRONMENT (MELODY BASED)        */}
         {/* ========================================================= */}
         <div className="reveal-el relative flex flex-col justify-end overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#020304] min-h-[500px] shadow-[inset_0_0_100px_rgba(0,0,0,0.9),0_20px_50px_rgba(0,0,0,0.4)]">
            
            {/* Soft Deep Glow Backdrop */}
            <div 
               ref={previewRef}
               className={cn("absolute inset-0 bg-gradient-to-t transition-colors duration-1000", currentPreset.gradient)}
               style={{ opacity: intensity / 100 }}
            />
            
            {/* Elegant Melody Visualizer */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 flex items-end justify-center gap-1.5 md:gap-2 px-10 pb-8 opacity-60 mix-blend-screen pointer-events-none">
               {[...Array(24)].map((_, i) => {
                  // Math based offset for symmetric smooth wave
                  const middle = 12;
                  const distance = Math.abs(i - middle);
                  const baseHeight = Math.max(15, 100 - (distance * distance * 1.5));
                  const speed = 1.2 + (energy / 50); // Speed scales with "energy" slider
                  const delay = i * 0.1;
                  
                  return (
                     <div 
                       key={i} 
                       className="melody-bar w-1.5 md:w-3 rounded-full" 
                       style={{
                          height: `${baseHeight}%`,
                          background: `linear-gradient(to top, ${currentPreset.activeColor}, transparent)`,
                          animationDuration: `${speed}s`,
                          animationDelay: `${delay}s`,
                          boxShadow: `0 0 20px ${currentPreset.activeColor}40`
                       }} 
                     />
                  );
               })}
            </div>

            {/* Minimal Record Info (Replaced the boxy CD player) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 pointer-events-none z-10">
               {nowPlaying ? (
                  <div className="flex flex-col items-center group">
                     {/* Glowing Minimal Art */}
                     <div className="relative h-44 w-44 rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 mx-auto">
                        <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-10" />
                        <img src={nowPlaying.coverUrl} className="w-full h-full object-cover opacity-80" alt="Melody Disc" />
                        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-black/80 backdrop-blur-md rounded-full border border-white/20 z-20" />
                     </div>
                     {/* Clean Typography */}
                     <div className="mt-8 text-center bg-black/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/5">
                        <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{nowPlaying.title}</h3>
                        <p className="text-[0.8rem] font-medium text-white/50 uppercase tracking-widest mt-1.5">{nowPlaying.artist}</p>
                     </div>
                  </div>
               ) : (
                  <div className="flex flex-col items-center opacity-40">
                     <AudioLines className="h-16 w-16 mb-4" />
                     <p className="text-sm uppercase tracking-widest">Awaiting Audio Stream</p>
                  </div>
               )}
            </div>

            {/* Sub-label */}
            <div className="absolute top-6 left-6 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-lg">
               <div className="flex gap-1 h-3 items-end">
                  <div className="w-0.5 h-[30%] bg-white rounded animate-pulse" />
                  <div className="w-0.5 h-[60%] bg-white rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-0.5 h-[100%] bg-white rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="w-0.5 h-[40%] bg-white rounded animate-pulse" style={{ animationDelay: '0.6s' }} />
               </div>
               <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/40">Melody Engine Active</span>
            </div>
         </div>


         {/* ========================================================= */}
         {/* RIGHT PANE: CONTROL CONSOLE                               */}
         {/* ========================================================= */}
         <div className="reveal-el flex flex-col gap-6">
            
            {/* SPACES GRID */}
            <div className="rounded-[2.5rem] border border-white/10 bg-[#050608]/80 p-6 md:p-8 backdrop-blur-xl">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                     <Compass className="h-4 w-4" /> Âm Phổ
                  </h2>
                  <MoodBadge emotion={currentEmotion} size="sm" />
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {presets.map((preset) => (
                     <button
                        key={preset.id}
                        onClick={() => { setAutoSync(false); setActiveSpace(preset.id); }}
                        className={cn(
                           "relative overflow-hidden rounded-[1.2rem] border p-4 text-left transition-all duration-300",
                           activeSpace === preset.id
                              ? "border-white/30 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                              : "border-white/[0.03] bg-white/[0.02] hover:bg-white/[0.04] opacity-60 hover:opacity-100"
                        )}
                     >
                        <div className={cn("absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-gradient-to-bl opacity-20", preset.gradient)} />
                        
                        <h4 className="text-[0.9rem] font-bold text-white relative z-10">{preset.title}</h4>
                        <p className="text-[0.65rem] text-white/40 mt-1 relative z-10 font-medium">{preset.subtitle}</p>

                        {/* Active Indicator */}
                        {activeSpace === preset.id && (
                           <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: preset.activeColor, color: preset.activeColor }} />
                        )}
                     </button>
                  ))}
               </div>
            </div>

            {/* AMBIENT SLIDERS */}
            <div className="rounded-[2.5rem] border border-white/10 bg-[#050608]/80 p-6 md:p-8 backdrop-blur-xl flex-1">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                     <Sliders className="h-4 w-4" /> Dải Tần Số
                  </h2>
               </div>

               <div className="space-y-8">
                  
                  {/* Slider 1: Intensity */}
                  <div>
                     <div className="flex justify-between mb-3">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/70">Độ Phủ Gradient</span>
                        <span className="text-[0.7rem] font-bold text-white/40 tabular-nums">{intensity}%</span>
                     </div>
                     <input 
                        type="range" min="0" max="100" 
                        value={intensity} 
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer focus:outline-none"
                        style={{
                           background: `linear-gradient(to right, ${currentPreset.activeColor} ${intensity}%, rgba(255,255,255,0.1) ${intensity}%)`
                        }}
                     />
                  </div>

                  {/* Slider 2: Energy -> Wave Speed */}
                  <div>
                     <div className="flex justify-between mb-3">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/70">Nhịp Độ Sóng (Wave Speed)</span>
                        <span className="text-[0.7rem] font-bold text-white/40 tabular-nums">{energy}%</span>
                     </div>
                     <input 
                        type="range" min="10" max="100" 
                        value={energy} 
                        onChange={(e) => setEnergy(Number(e.target.value))}
                        className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer focus:outline-none"
                        style={{
                           background: `linear-gradient(to right, ${currentPreset.activeColor} ${energy}%, rgba(255,255,255,0.1) ${energy}%)`
                        }}
                     />
                  </div>

               </div>
               
               <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                  <div className="flex bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] border border-[var(--brand-accent)]/20 rounded-xl p-3 items-center gap-3 w-full">
                     <Cpu className="h-5 w-5" />
                     <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-widest opacity-60">Engine</p>
                        <p className="text-[0.8rem] font-semibold tracking-wide">Melody Smooth Sync</p>
                     </div>
                  </div>
               </div>

            </div>

         </div>

      </div>
    </div>
  );
}
