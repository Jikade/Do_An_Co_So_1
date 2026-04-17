'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bot, ChevronRight, MessageSquareText, Send, WandSparkles, X } from 'lucide-react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockSongs, type Emotion } from '@/lib/duLieuGiaLap'
import { assistantQuickActions, detectEmotionFromText, localizedLabel, tasteProfile } from '@/lib/music-intelligence'
import { assistantPanelCopy } from '@/lib/vietnamese-home-copy'
import { cn } from '@/lib/tienIch'

interface AssistantMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const routeMap = {
  home: '/bangDieuKhien',
  emotion: '/nhanDienCamXuc',
  analytics: '/phanTich',
  recommendations: '/goiY',
  library: '/thuVien',
  history: '/lichSu',
  settings: '/caiDat',
} as const

const emotionNames: Record<Emotion, string> = {
  happy: 'Vui ve',
  sad: 'Buon',
  calm: 'Binh yen',
  angry: 'Tuc gian',
  romantic: 'Lang man',
  nostalgic: 'Hoai niem',
  energetic: 'Nang dong',
  stressed: 'Cang thang',
}

function firstSongByEmotion(emotion: Emotion) {
  return mockSongs.find((song) => song.emotion === emotion) ?? mockSongs[0]
}

export function AIAssistantPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const { setCurrentEmotion, setNowPlaying, setIsPlaying, togglePlayPause, isPlaying, currentEmotion } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      content:
        'To la Mood Copilot. Cau co the nho to phat nhac, mo trang, doc cam xuc, xem gu nghe hoac tao nhanh mot huong nghe hop mood.',
    },
  ])

  const quickActions = useMemo(
    () =>
      assistantQuickActions.map((item) => ({
        id: item.id,
        label: localizedLabel(item.label, 'vi'),
        prompt: localizedLabel(item.prompt, 'vi'),
      })),
    [],
  )

  const respond = (userInput: string) => {
    const normalized = userInput.toLowerCase()
    let reply = 'To da hieu yeu cau cua cau.'

    if (normalized.includes('calm') || normalized.includes('diu') || normalized.includes('thu gian')) {
      const song = firstSongByEmotion('calm')
      setCurrentEmotion('calm')
      setNowPlaying(song)
      setIsPlaying(true)
      reply = `To da chuyen mood sang Binh yen va phat ${song.title}. Huong nay bam theo gu ${localizedLabel(tasteProfile.topGenres[1].label, 'vi')} cua cau.`
    } else if (normalized.includes('voice') || normalized.includes('giong')) {
      router.push(routeMap.emotion)
      reply = 'To da mo trang Nhan dien cam xuc. Cau co the chuyen sang tab Giong noi va bat dau thu.'
    } else if (normalized.includes('face') || normalized.includes('camera') || normalized.includes('khuon mat')) {
      router.push(routeMap.emotion)
      reply = 'To da dua cau toi trang Mood AI. Che do khuon mat da san sang trong khoi phan tich.'
    } else if (normalized.includes('text') || normalized.includes('mood') || normalized.includes('cam xuc')) {
      const detectedEmotion = detectEmotionFromText(userInput)
      const song = firstSongByEmotion(detectedEmotion)
      setCurrentEmotion(detectedEmotion)
      setNowPlaying(song)
      reply = `To doc mood hien tai la ${emotionNames[detectedEmotion]}. ${song.title} dang la bai khoi dau hop nhat voi trang thai nay.`
    } else if (normalized.includes('genre') || normalized.includes('gu nhac') || normalized.includes('taste')) {
      router.push(routeMap.analytics)
      reply = `Gu nghe noi bat cua cau hien la ${localizedLabel(tasteProfile.topGenres[0].label, 'vi')}, ${localizedLabel(tasteProfile.topGenres[1].label, 'vi')} va ${localizedLabel(tasteProfile.topGenres[2].label, 'vi')}. To da mo trang phan tich de cau xem chi tiet.`
    } else if (normalized.includes('analytics') || normalized.includes('thong ke') || normalized.includes('phan tich')) {
      router.push(routeMap.analytics)
      reply = 'To da mo khu phan tich. O do cau se thay xu huong cam xuc, the loai noi bat, nghe si noi bat va cum gu nghe.'
    } else if (normalized.includes('history') || normalized.includes('lich su')) {
      router.push(routeMap.history)
      reply = 'To da mo lich su nghe va lich su quet cam xuc gan day cho cau.'
    } else if (normalized.includes('library') || normalized.includes('thu vien')) {
      router.push(routeMap.library)
      reply = 'To da mo Thu vien cua cau, noi co bai hat, playlist, bai da thich va cac bo suu tap cam xuc.'
    } else if (normalized.includes('recommend') || normalized.includes('playlist') || normalized.includes('goi y') || normalized.includes('focus')) {
      router.push(routeMap.recommendations)
      reply = 'To da mo trang goi y. Cac playlist o do dang duoc uu tien theo mood hien tai va ho so gu nghe cua cau.'
    } else if (normalized.includes('settings') || normalized.includes('cai dat')) {
      router.push(routeMap.settings)
      reply = 'To da mo cai dat de cau chinh camera, micro, quyen rieng tu va phat nhac.'
    } else if (normalized.includes('pause') || normalized.includes('dung')) {
      if (isPlaying) togglePlayPause()
      reply = 'To da tam dung bai dang phat.'
    } else if (normalized.includes('play') || normalized.includes('phat')) {
      if (!isPlaying) togglePlayPause()
      reply = 'To da tiep tuc phat nhac.'
    } else {
      const cluster = tasteProfile.clusters[0]
      reply = `To chua map dung lenh do, nhung cum gu nghe hop nhat cua cau luc nay la ${localizedLabel(cluster.title, 'vi')}. Cau co the thu kieu nhu "mo nhan dien giong noi", "phat gi do diu lai" hoac "cho minh xem gu nhac".`
    }

    const nextMessages: AssistantMessage[] = [
      { id: crypto.randomUUID(), role: 'user', content: userInput },
      { id: crypto.randomUUID(), role: 'assistant', content: reply },
    ]

    setMessages((prev) => [...prev, ...nextMessages].slice(-10))
  }

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    respond(trimmed)
    setInput('')
  }

  return (
    <div className="fixed bottom-24 right-4 z-[70] flex flex-col items-end gap-4 md:bottom-28 md:right-6">
      {isOpen ? (
        <div className="glass-strong relative w-[22rem] overflow-hidden rounded-[1.9rem] border border-white/10 p-4 shadow-[0_34px_90px_rgba(0,0,0,0.6)] md:w-[24rem]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_18%,transparent_82%,rgba(0,0,0,0.16))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.14)_0,rgba(255,255,255,0.14)_1px,transparent_1px,transparent_3px)]" />

          <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="pill-label text-[0.58rem] text-white/32">{assistantPanelCopy.eyebrow}</p>
              <h3 className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Bot className="h-4.5 w-4.5 text-[var(--brand-accent)]" />
                {assistantPanelCopy.title}
              </h3>
              <p className="mt-2 max-w-[17rem] text-xs leading-6 text-white/50">{assistantPanelCopy.description}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chip-premium flex h-9 w-9 items-center justify-center text-white/48 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => respond(action.prompt)}
                className="chip-premium px-3 py-2 text-xs font-medium text-white/68 transition-colors hover:text-white"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2 rounded-[1.35rem] border border-white/6 bg-black/16 p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'rounded-2xl px-3 py-2.5 text-sm leading-6',
                  message.role === 'assistant'
                    ? 'bg-white/[0.04] text-white/76'
                    : 'ml-6 bg-[rgba(30,215,96,0.14)] text-white',
                )}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            <div className="card-premium flex items-center gap-3 rounded-[1.25rem] px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(30,215,96,0.1)] text-[var(--brand-accent)]">
                <WandSparkles className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{assistantPanelCopy.currentContext}</p>
                <p className="truncate text-xs text-white/50">
                  {assistantPanelCopy.routeLabel}: {pathname} • {assistantPanelCopy.moodLabel}: {emotionNames[currentEmotion]}
                </p>
              </div>
            </div>

            <div className="chip-premium flex items-center gap-2 px-3 py-2.5">
              <MessageSquareText className="h-4 w-4 text-white/36" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder={assistantPanelCopy.inputPlaceholder}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/28 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_12px_24px_rgba(30,215,96,0.18)] transition-transform hover:scale-[1.03]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-white/48">
              <div className="card-premium rounded-[1.15rem] px-3 py-2.5">
                <p className="pill-label text-[0.58rem] text-white/28">{assistantPanelCopy.moodCardLabel}</p>
                <p className="mt-2 text-sm font-semibold text-white">{emotionNames[currentEmotion]}</p>
              </div>
              <div className="card-premium rounded-[1.15rem] px-3 py-2.5">
                <p className="pill-label text-[0.58rem] text-white/28">{assistantPanelCopy.topGenreLabel}</p>
                <p className="mt-2 text-sm font-semibold text-white">{localizedLabel(tasteProfile.topGenres[0].label, 'vi')}</p>
              </div>
              <div className="card-premium rounded-[1.15rem] px-3 py-2.5">
                <p className="pill-label text-[0.58rem] text-white/28">{assistantPanelCopy.fastActionLabel}</p>
                <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-white">
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
                  {assistantPanelCopy.ready}
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Mood Copilot' : 'Open Mood Copilot'}
        className={cn(
          'group relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(12,15,18,0.98),rgba(6,8,10,0.98))] shadow-[0_18px_52px_rgba(0,0,0,0.44),inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300',
          isOpen
            ? 'border-[var(--brand-accent)]/18 shadow-[0_20px_54px_rgba(0,0,0,0.46),0_0_28px_rgba(30,215,96,0.1),inset_0_0_0_1px_rgba(255,255,255,0.04)]'
            : 'hover:-translate-y-0.5 hover:border-[var(--brand-accent)]/22 hover:shadow-[0_22px_58px_rgba(0,0,0,0.48),0_0_34px_rgba(30,215,96,0.14),inset_0_0_0_1px_rgba(255,255,255,0.04)]',
        )}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_28%,rgba(79,172,254,0.12),transparent_38%),radial-gradient(circle_at_50%_74%,rgba(30,215,96,0.16),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/6" />
        <Image
          src="/img/logo/logochatbox.png"
          alt="Mood Copilot"
          width={44}
          height={44}
          className="relative h-11 w-11 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.32)]"
        />
        <span className="absolute bottom-[0.62rem] right-[0.62rem] h-2.5 w-2.5 rounded-full border border-[#05080a] bg-[var(--brand-accent)] shadow-[0_0_14px_rgba(30,215,96,0.78)]" />
      </button>
    </div>
  )
}
