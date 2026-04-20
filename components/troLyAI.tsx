'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, MessageSquareText, Send, Sparkles, Minus, X, Info, AudioLines } from 'lucide-react';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { mockSongs, type Emotion } from '@/lib/duLieuGiaLap';
import { assistantQuickActions, detectEmotionFromText, localizedLabel } from '@/lib/music-intelligence';
import { cn } from '@/lib/tienIch';

interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
}

const routeMap = {
  home: '/bangDieuKhien',
  emotion: '/nhanDienCamXuc',
  analytics: '/phanTich',
  space: '/khongGian',
  recommendations: '/goiY',
  library: '/thuVien',
  history: '/lichSu',
  settings: '/caiDat',
} as const;

const emotionNames: Record<Emotion, string> = {
  happy: 'Vui vẻ',
  sad: 'Buồn',
  calm: 'Bình yên',
  angry: 'Tức giận',
  romantic: 'Lãng mạn',
  nostalgic: 'Hoài niệm',
  energetic: 'Năng động',
  stressed: 'Căng thẳng',
};

function firstSongByEmotion(emotion: Emotion) {
  return mockSongs.find((song) => song.emotion === emotion) ?? mockSongs[0];
}

export function AIAssistantPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentEmotion, setNowPlaying, setIsPlaying, currentEmotion, language } = useTheme();

  // States: 'minimized' (the orb launcher), 'expanded' (the chat panel)
  // We remove 'dismissed' to ensure the launcher is always persistent as requested.
  const [viewState, setViewState] = useState<'minimized' | 'expanded'>('minimized');
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: language === 'vi' ? 'Trợ lý KhoaLisa sẵn sàng.' : 'KhoaLisa ready.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = useMemo(
    () =>
      assistantQuickActions.slice(0, 3).map((item) => ({
        id: item.id,
        label: localizedLabel(item.label, language),
        prompt: localizedLabel(item.prompt, language),
      })),
    [language],
  );

  // Auto-scroll logic
  useEffect(() => {
    if (messagesEndRef.current && viewState === 'expanded') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, viewState]);

  const respond = (userInput: string) => {
    const normalized = userInput.toLowerCase();
    let reply = language === 'vi' ? 'Đã nhận lệnh.' : 'Acknowledged.';

    if (normalized.includes('calm') || normalized.includes('diu') || normalized.includes('thu gian')) {
      const song = firstSongByEmotion('calm');
      setCurrentEmotion('calm');
      setNowPlaying(song);
      setIsPlaying(true);
      reply = language === 'vi' ? `Sang mode Bình Yên. Chơi thẻ: ${song.title}.` : `Calm mode. Playing: ${song.title}.`;
    } else if (normalized.includes('voice') || normalized.includes('giong')) {
      router.push(routeMap.emotion);
      reply = language === 'vi' ? 'Mở Phân tích Giọng nói.' : 'Opening Voice Analysis.';
    } else if (normalized.includes('space') || normalized.includes('khong gian')) {
      router.push(routeMap.space);
      reply = language === 'vi' ? 'Vào Không Gian Cảm Xúc.' : 'Entering Emotion Space.';
    } else if (normalized.includes('text') || normalized.includes('mood') || normalized.includes('cam xuc')) {
      const detectedEmotion = detectEmotionFromText(userInput);
      const song = firstSongByEmotion(detectedEmotion);
      setCurrentEmotion(detectedEmotion);
      setNowPlaying(song);
      reply = language === 'vi' ? `Nhận dạng: ${emotionNames[detectedEmotion]}.` : `Detected: ${detectedEmotion}.`;
    } else if (normalized.includes('recommend') || normalized.includes('playlist') || normalized.includes('goi y')) {
      router.push(routeMap.recommendations);
      reply = language === 'vi' ? 'Mở Recommendation Intelligence.' : 'Opening Intelligence Dashboard.';
    } else {
      reply = language === 'vi' 
        ? `${language === 'vi' ? 'Trợ lý KhoaLisa' : 'KhoaLisa'} đang ở trạng thái: ${emotionNames[currentEmotion]}.`
        : `State: ${currentEmotion}.`;
    }

    const nextMessages: AssistantMessage[] = [
      { id: crypto.randomUUID(), role: 'user', content: userInput },
      { id: crypto.randomUUID(), role: 'assistant', content: reply },
    ];

    setMessages((prev) => [...prev, ...nextMessages].slice(-10));
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    respond(trimmed);
    setInput('');
  };

  return (
    <div className="fixed bottom-10 right-4 z-[999] flex flex-col items-end gap-4 md:right-10">
      
      <AnimatePresence mode="wait">
        
        {/* ================================================================= */}
        {/* 1. CHAT PANEL (EXPANDED STATE)                                   */}
        {/* ================================================================= */}
        {viewState === 'expanded' && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.8, filter: 'blur(20px)', transition: { duration: 0.25, ease: 'easeInOut' } }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#06080a]/95 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] w-[20rem] md:w-[23rem] h-[32rem] origin-bottom-right"
          >
            {/* COMPACT CLEAN HEADER */}
            <header className="flex flex-none items-center justify-between px-6 py-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                 <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] shadow-[0_0_15px_rgba(30,215,96,0.1)]">
                    <Bot className="h-4 w-4" />
                 </div>
                 <h3 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-white">KhoaLisa AI</h3>
              </div>
              <button 
                onClick={() => setViewState('minimized')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* MESSAGES FLOW */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide flex flex-col gap-4">
              <div className="mx-auto flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.02]">
                 <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40 truncate max-w-[120px]">{pathname}</span>
                 <span className="h-1 w-1 rounded-full bg-white/20" />
                 <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--brand-accent)] font-bold">{currentEmotion}</span>
              </div>

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn('flex w-full', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.8rem] leading-relaxed shadow-sm transition-all',
                      message.role === 'assistant'
                        ? 'bg-white/[0.03] border border-white/[0.05] text-white/70 rounded-tl-sm'
                        : 'bg-[var(--brand-accent)] text-black font-semibold shadow-[0_10px_20px_rgba(30,215,96,0.15)] rounded-tr-sm',
                    )}
                  >
                    <p className="tracking-wide select-none">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* COMPOSER (PILL STYLE) */}
            <div className="flex-none px-6 pb-6 pt-2 bg-gradient-to-t from-[#06080a] to-transparent">
               <div className="mb-4 flex flex-wrap gap-2">
                 {quickActions.map((action) => (
                   <button
                     key={action.id}
                     onClick={() => respond(action.prompt)}
                     className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[0.62rem] uppercase tracking-widest font-black text-white/30 transition-all hover:bg-white/10 hover:text-white"
                   >
                     <ChevronRight className="h-2.5 w-2.5" />
                     {action.label}
                   </button>
                 ))}
               </div>

               <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1.5 focus-within:border-white/30 focus-within:bg-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                         event.preventDefault();
                         handleSubmit();
                      }
                    }}
                    placeholder={language === 'vi' ? 'Nhập yêu cầu...' : 'Command...'}
                    className="w-full bg-transparent px-4 text-[0.85rem] text-white placeholder:text-white/20 outline-none font-medium"
                    autoComplete="off"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      input.trim() 
                        ? "bg-[var(--brand-accent)] text-black hover:scale-105 shadow-[0_0_20px_rgba(30,215,96,0.3)]" 
                        : "bg-white/5 text-white/10 pointer-events-none"
                    )}
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 2. FLOATING ORB LAUNCHER (MINIMIZED STATE)                       */}
        {/* ================================================================= */}
        {viewState === 'minimized' && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            {/* Subtle Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-[var(--brand-accent)]/20 blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* The Simple Circular Chat Bubble Launcher */}
            <button
               onClick={() => setViewState('expanded')}
               className="relative flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:bg-black hover:border-white/20 hover:scale-110 active:scale-95"
            >
               <div className="relative flex h-12 w-12 items-center justify-center rounded-full overflow-hidden">
                  <Image
                    src="/img/logo/logochatbox.png"
                    alt="KhoaLisa AI"
                    width={40}
                    height={40}
                    className="object-contain transition-transform duration-700 group-hover:rotate-12 rounded-full"
                  />
                  {/* Status Indicator */}
                  <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-accent)] opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--brand-accent)] shadow-[0_0_8px_var(--brand-accent)]"></span>
                  </span>
               </div>
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
