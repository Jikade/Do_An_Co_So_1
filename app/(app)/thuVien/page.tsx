'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { 
  Heart, Music2, Sparkles, Waves, Compass, 
  ListMusic, History, PlayCircle, Library,
  ArrowUpRight, ShieldCheck, Zap, Activity,
  Globe, Radio
} from 'lucide-react';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { mockSongs } from '@/lib/duLieuGiaLap';
import {
  getAllSongsLibrary,
  getLikedSongs,
  getRecentlyPlayedLibrary,
  getSavedPlaylists,
  getSavedRecommendationSongs,
  getUserLibraryStats,
  getUserPlaylists,
  libraryClusters,
  localizedCopy,
  getSongsByIds,
} from '@/lib/product-upgrade-data';
import { SongCard } from '@/components/theBaiHat';
import { PlaylistCard } from '@/components/theDanhSachPhat';
import { cn } from '@/lib/tienIch';

// =================================================================
// 1. REUSABLE CINEMATIC COMPONENTS
// =================================================================

function MoodAura() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(168,139,235,0.2)_0%,transparent_70%)] blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-[10%] -left-[5%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(79,172,254,0.15)_0%,transparent_70%)] blur-[80px]"
      />
      {/* Star Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [null, Math.random() * -300],
            x: [null, (Math.random() - 0.5) * 80]
          }}
          transition={{ 
            duration: Math.random() * 6 + 4, 
            repeat: Infinity, 
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="absolute h-[1.5px] w-[1.5px] bg-white rounded-full z-10"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}

function SectionHeader({ title, eyebrow, icon: Icon }: { title: string; eyebrow: string; icon: any }) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[var(--brand-accent)] drop-shadow-[0_0_8px_var(--brand-accent)]">{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-black tracking-tight text-white/95">{title}</h2>
    </div>
  );
}

// =================================================================
// 2. MAIN LIBRARY PAGE
// =================================================================

export default function LibraryPage() {
  const { language, setNowPlaying, setIsPlaying } = useTheme();
  
  const stats = getUserLibraryStats();
  const allSongs = getAllSongsLibrary();
  const playlists = getUserPlaylists();
  const savedPlaylists = getSavedPlaylists();
  const likedSongs = getLikedSongs();
  const recentlyPlayed = getRecentlyPlayedLibrary();
  const savedRecommendations = getSavedRecommendationSongs();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <div className="relative pb-40 text-white antialiased">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12 pt-2 px-2">
        
        {/* ----------------------------------------------------------- */}
        {/* 1. CINEMATIC LIBRARY HUB (THE COMPACT CORE)                 */}
        {/* ----------------------------------------------------------- */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative group w-full rounded-[3rem] border border-white/10 bg-[#06080a] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        >
          <MoodAura />
          
          <div className="relative z-10 p-8 md:p-14 md:pb-28 flex flex-col gap-10">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
                <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/60">
                  {language === 'vi' ? 'Dữ liệu cá nhân' : 'Personal Vault'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] border border-[var(--brand-accent)]/20 shadow-[0_0_15px_rgba(30,215,96,0.2)]">
                <Zap className="h-3 w-3" />
                <span className="text-[0.55rem] font-bold uppercase tracking-widest">Active Sync</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white">
                  {language === 'vi' ? 'Hệ Sinh Thái' : 'Personal'}<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a88beb] via-white to-[#4facfe]">
                    {language === 'vi' ? 'Ký Ức Âm Nhạc' : 'Library Space'}.
                  </span>
                </h1>
                <p className="max-w-xl text-[0.9rem] font-medium leading-relaxed text-white/40 italic">
                  {language === 'vi'
                    ? '"Nơi mỗi bài hát không chỉ là giai điệu, mà là một mảnh linh hồn được lưu giữ."'
                    : '"Where every track is not just a melody, but a piece of your soul preserved in time."'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map((stat, i) => (
                  <div key={stat.id} className="p-5 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl group hover:bg-white/5 transition-all">
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">{stat.label[language]}</p>
                    <p className="text-3xl font-black text-white tracking-tighter group-hover:text-[var(--brand-accent)] transition-colors">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-8 pt-0 flex flex-nowrap gap-4 translate-y-8 z-20 overflow-x-auto pb-8 scrollbar-hide">
              {[
                { title: 'All Songs', Icon: Music2, color: 'text-[#4facfe]' },
                { title: 'Mood Flow', Icon: Waves, color: 'text-[#a88beb]' },
                { title: 'AI Saved', Icon: Sparkles, color: 'text-[var(--brand-accent)]' },
                { title: 'Liked', Icon: Heart, color: 'text-rose-500' },
                { title: 'Recently', Icon: History, color: 'text-amber-400' },
              ].map((nav, i) => (
                <motion.div
                   key={nav.title}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="group flex-shrink-0 flex items-center gap-4 px-6 h-16 rounded-[1.5rem] bg-black/80 border border-white/10 backdrop-blur-3xl hover:border-white/30 transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
                >
                   <div className={cn("h-8 w-8 rounded-full bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", nav.color)}>
                      <nav.Icon className="h-4 w-4" />
                   </div>
                   <span className="text-[0.7rem] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">{nav.title}</span>
                   <ArrowUpRight className="h-3 w-3 text-white/10 group-hover:text-white/40 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ----------------------------------------------------------- */}
        {/* 2. PLAYLIST DYNAMICS (HORIZONTAL REFINED)                   */}
        {/* ----------------------------------------------------------- */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 space-y-8"
        >
          <SectionHeader 
            eyebrow="Collections"
            title={language === 'vi' ? 'Danh sách Tuyển tập' : 'Playlist Gallery'}
            icon={ListMusic}
          />
          
          <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#a88beb]">{language === 'vi' ? 'Bạn đã tạo' : 'Created by you'}</h4>
                   <span className="h-[1px] flex-1 bg-white/[0.05] mx-4" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                   {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#4facfe]">{language === 'vi' ? 'Vệ tinh đã lưu' : 'Satellite Hubs'}</h4>
                   <span className="h-[1px] flex-1 bg-white/[0.05] mx-4" />
                </div>
                <div className="flex flex-col gap-4">
                   {savedPlaylists.slice(0, 3).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} variant="compact" />)}
                   
                   {/* Decorative Info Tile to fill space */}
                   <div className="mt-4 p-6 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center text-center gap-3">
                      <Globe className="h-6 w-6 text-white/20" />
                      <p className="text-[0.7rem] font-bold text-white/30 uppercase tracking-widest">{language === 'vi' ? 'Thêm Playlist mới' : 'Discovery mode'}</p>
                      <Link href="/bangDieuKhien" className="text-[0.65rem] text-[var(--brand-accent)] hover:underline">Khám phá thế giới âm nhạc →</Link>
                   </div>
                </div>
             </div>
          </div>
        </motion.section>

        {/* ----------------------------------------------------------- */}
        {/* 3. SYNC SHELVES (THE TIGHT GRID)                             */}
        {/* ----------------------------------------------------------- */}
        <section className="mt-8 space-y-12">
           <div className="grid gap-8 xl:grid-cols-3">
              {[
                { id: 'liked', label: 'Liked Tracks', songs: likedSongs, color: 'text-rose-500' },
                { id: 'recent', label: 'Recent Beats', songs: recentlyPlayed, color: 'text-[#a88beb]' },
                { id: 'saved-ai', label: 'AI Curated', songs: savedRecommendations, color: 'text-[var(--brand-accent)]' },
              ].map((shelf) => (
                <motion.div 
                   key={shelf.id}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="group p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/10 transition-all group overflow-hidden"
                >
                   <div className="flex items-center justify-between mb-8 px-2">
                      <p className={cn("text-[0.6rem] font-black font-uppercase tracking-[0.3em]", shelf.color)}>{shelf.label}</p>
                      <button className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                         <ChevronRight className="h-3 w-3 text-white/40" />
                      </button>
                   </div>
                   <div className="space-y-3">
                      {shelf.songs.slice(0, 4).map((song) => <SongCard key={song.id} song={song} variant="list" />)}
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* ----------------------------------------------------------- */}
        {/* 4. MOOD SPECTRUM (ENRICHED GRID)                            */}
        {/* ----------------------------------------------------------- */}
        <section className="mt-8 space-y-8">
           <SectionHeader 
             eyebrow="Emotion Engine"
             title={language === 'vi' ? 'Hành Tinh Cảm Xúc' : 'Mood Constellations'}
             icon={Waves}
           />
           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {libraryClusters.map((cluster) => (
                <motion.article 
                   key={cluster.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="relative p-8 rounded-[3rem] border border-white/10 bg-[#040506] overflow-hidden group shadow-2xl"
                >
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--brand-accent)]/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                   
                   <p className="text-[0.8rem] font-black uppercase tracking-widest text-white/80">{localizedCopy(cluster.title, language)}</p>
                   <p className="mt-2 text-[0.7rem] text-white/30 uppercase tracking-[0.2em] mb-8">{localizedCopy(cluster.subtitle, language)}</p>
                   
                   <div className="grid gap-4 sm:grid-cols-2 relative z-10">
                      {getSongsByIds(cluster.songIds).slice(0, 2).map((song) => (
                        <SongCard key={song.id} song={song} variant="compact" />
                      ))}
                   </div>
                </motion.article>
              ))}
              
              {/* Enrichment: Library Analytics Summary Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-[3rem] border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/5 overflow-hidden group flex flex-col justify-between"
              >
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <Activity className="h-12 w-12 text-[var(--brand-accent)]" />
                 </div>
                 <div>
                    <p className="text-[0.8rem] font-black uppercase tracking-widest text-white">{language === 'vi' ? 'Hoạt động tuần' : 'Week Analytics'}</p>
                    <h4 className="mt-6 text-4xl font-black text-white italic tracking-tighter">25.3h</h4>
                    <p className="text-[0.7rem] text-white/40 uppercase tracking-widest mt-1">Listening journey</p>
                 </div>
                 <div className="mt-8 flex items-center justify-between">
                    <span className="text-[0.6rem] font-bold text-[var(--brand-accent)] uppercase tracking-widest">{language === 'vi' ? 'Nhạc tăng trưởng 12%' : '12% Increase'}</span>
                    <Radio className="h-4 w-4 text-[var(--brand-accent)] animate-pulse" />
                 </div>
              </motion.div>
           </div>
        </section>

        {/* ----------------------------------------------------------- */}
        {/* 5. THE GLOBAL ARCHIVE (MUSIC WALL CTA)                      */}
        {/* ----------------------------------------------------------- */}
        <section className="mt-20 relative overflow-hidden rounded-[4rem] border border-white/[0.03] bg-gradient-to-t from-white/[0.02] to-transparent py-28 flex flex-col items-center text-center gap-8">
           
           {/* Background Music Wall Decoration */}
           <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, rotate: Math.random() * 20 - 10 }}
                 animate={{ 
                   opacity: [0, 0.4, 0],
                   y: [50, -50],
                   scale: [0.8, 1, 0.8]
                 }}
                 transition={{ 
                    duration: 6 + Math.random() * 4, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "easeInOut"
                 }}
                 className="absolute rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                 style={{ 
                   width: '80px', 
                   height: '80px',
                   left: `${(i % 6) * 18 + 5}%`,
                   top: `${Math.floor(i / 6) * 40 + 10}%`
                 }}
               >
                 <img src={mockSongs[i % mockSongs.length].coverUrl} alt="decorative cover" className="w-full h-full object-cover grayscale" />
               </motion.div>
             ))}
           </div>

           <div className="relative z-10 h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-spin-slow">
              <Library className="h-6 w-6 text-white/40" />
           </div>
           
           <div className="relative z-10 space-y-4">
              <h3 className="text-4xl font-black text-white tracking-tight">{language === 'vi' ? 'Khám phá tất cả nốt nhạc' : 'Explore the full spectrum'}</h3>
              <p className="max-w-xl mx-auto text-[0.95rem] text-white/40 leading-relaxed">
                 {language === 'vi' ? 'Truy cập vào cơ sở dữ liệu bài hát đầy đủ và bắt đầu phiên nghe trộn ngẫu nhiên của bạn ngay lập tức.' : 'Dive into the complete tracks database and start your random listening session instantly.'}
              </p>
           </div>

           <button
             onClick={() => {
               if (!allSongs.length) return;
               setNowPlaying(allSongs[0]);
               setIsPlaying(true);
             }}
             className="relative z-10 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
           >
             {language === 'vi' ? 'Phát Toàn Bộ Thư Viện' : 'Play Full Archive'}
           </button>
        </section>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

// Side Components
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
