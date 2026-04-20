'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Brain,
  Camera,
  ChevronRight,
  FileText,
  Loader2,
  Mic,
  Play,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockSongs, type Emotion } from '@/lib/duLieuGiaLap'
import { detectEmotionFromText, localizedLabel, moodModes, tasteProfile } from '@/lib/music-intelligence'
import { MoodBadge } from '@/components/huyHieuCamXuc'
import { ConfidenceBar } from '@/components/thanhDoTinCay'
import { SongCard } from '@/components/theBaiHat'
import { cn } from '@/lib/tienIch'

type DetectionMode = 'text' | 'voice' | 'face'

interface AnalysisLog {
  id: string
  mode: DetectionMode
  emotion: Emotion
  confidence: number
  note: string
}

const modeIcon = {
  text: FileText,
  voice: Mic,
  face: Camera,
}

const defaultPrompts = {
  vi: {
    text: 'Hôm nay mình hơi quá tải nhưng vẫn muốn một playlist giúp dịu lại và tập trung hơn.',
    voice: 'Tông giọng chậm, hơi mệt, cần chuyển sang vùng thư giãn.',
    face: 'Biểu cảm căng nhẹ quanh mắt, năng lượng thấp, phù hợp với hướng nghe giảm áp.',
  },
  en: {
    text: 'I feel overloaded today but still want a playlist that keeps me calm and focused.',
    voice: 'Pacing sounds slower and tired, suggesting a calm-down listening direction.',
    face: 'Facial tension around the eyes with low energy, pointing toward decompression music.',
  },
}

export default function EmotionDetectionPage() {
  const {
    language,
    currentEmotion,
    setCurrentEmotion,
    faceConfidence,
    voiceConfidence,
    textConfidence,
    fusionScore,
    setConfidences,
    setNowPlaying,
    setIsPlaying,
  } = useTheme()

  const [activeMode, setActiveMode] = useState<DetectionMode>('text')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [textInput, setTextInput] = useState(defaultPrompts[language].text)
  const [logs, setLogs] = useState<AnalysisLog[]>([
    {
      id: 'log-1',
      mode: 'voice',
      emotion: 'romantic',
      confidence: 83,
      note: language === 'vi' ? 'Giọng nói mềm, nhịp đều, ưu tiên vocal gần.' : 'Soft tone and stable pacing suggest intimate vocals.',
    },
    {
      id: 'log-2',
      mode: 'face',
      emotion: 'calm',
      confidence: 88,
      note: language === 'vi' ? 'Biểu cảm thư giãn, hợp lo-fi / chill pop.' : 'Relaxed expression aligns with lo-fi and chill pop.',
    },
  ])

  const recommendedSongs = useMemo(() => mockSongs.filter((song) => song.emotion === currentEmotion).slice(0, 3), [currentEmotion])

  const modeCopy = useMemo(() => moodModes.find((item) => item.id === activeMode) ?? moodModes[0], [activeMode])

  const handleAnalyze = () => {
    setIsAnalyzing(true)

    window.setTimeout(() => {
      const emotion = activeMode === 'text' ? detectEmotionFromText(textInput) : activeMode === 'voice' ? 'calm' : 'stressed'
      const nextFace = activeMode === 'face' ? 93 : 81
      const nextVoice = activeMode === 'voice' ? 89 : 77
      const nextText = activeMode === 'text' ? 91 : 79
      const confidence = activeMode === 'face' ? nextFace : activeMode === 'voice' ? nextVoice : nextText

      setConfidences(nextFace, nextVoice, nextText)
      setCurrentEmotion(emotion)

      const firstTrack = mockSongs.find((song) => song.emotion === emotion) ?? mockSongs[0]
      setNowPlaying(firstTrack)
      setIsPlaying(true)

      setLogs((prev) => [
        {
          id: `${activeMode}-${Date.now()}`,
          mode: activeMode,
          emotion,
          confidence,
          note: tasteProfile.recommendationReasons[emotion][language],
        },
        ...prev,
      ].slice(0, 6))

      setIsAnalyzing(false)
    }, 1600)
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-elevated overflow-hidden p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="pill-label text-[0.66rem] text-white/35">Emotion AI</p>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              {language === 'vi' ? 'Text, giọng nói, khuôn mặt — ba cửa vào cùng một mood engine.' : 'Text, voice, face — three inputs for one mood engine.'}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 md:text-base">
              {language === 'vi'
                ? 'Trang này giữ đúng shell tối premium hiện tại, nhưng biến nhận diện cảm xúc thành một khu làm việc thực thụ: đọc mood, chấm confidence, rồi đẩy ngay sang đề xuất và player.'
                : 'This page keeps the same premium dark shell, while turning emotion detection into a real workspace: read mood, score confidence, then route directly into recommendations and playback.'}
            </p>
          </div>
          <div className="surface-panel min-w-[15rem] p-4">
            <p className="pill-label text-[0.62rem] text-white/30">Overall fusion</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <MoodBadge emotion={currentEmotion} size="lg" animated />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{fusionScore}%</p>
                <p className="text-xs text-white/42">{language === 'vi' ? 'Tổng hợp tín hiệu' : 'Combined signal'}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] via-[var(--song-primary)] to-[var(--song-secondary)]" style={{ width: `${fusionScore}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {moodModes.map((mode) => {
            const Icon = modeIcon[mode.id]
            const isActive = activeMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id)
                  setTextInput(defaultPrompts[language][mode.id])
                }}
                className={cn(
                  'surface-panel w-full p-5 text-left transition-all',
                  isActive && 'ring-1 ring-[var(--brand-accent)]/60 shadow-[0_0_0_1px_rgba(30,215,96,0.16),0_24px_44px_rgba(0,0,0,0.36)]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--song-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  {isActive && <span className="accent-pill rounded-full px-3 py-1 text-[0.62rem] font-medium">live</span>}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{localizedLabel(mode.title, language)}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">{localizedLabel(mode.description, language)}</p>
                <p className="mt-3 text-xs leading-6 text-white/38">{localizedLabel(mode.helper, language)}</p>
              </button>
            )
          })}
        </div>

        <div className="space-y-6">
          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Active workspace</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{localizedLabel(modeCopy.title, language)}</h2>
              </div>
              <span className="search-pill rounded-full px-3 py-1.5 text-xs text-white/54">
                {activeMode === 'text' ? 'Text prompt' : activeMode === 'voice' ? 'Voice waveform' : 'Camera signal'}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="glass rounded-[1.4rem] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <WandSparkles className="h-4 w-4 text-[var(--brand-accent)]" />
                  {language === 'vi' ? 'Input zone' : 'Input zone'}
                </div>
                <div className="mt-4 rounded-[1.3rem] border border-white/6 bg-black/18 p-4">
                  {activeMode === 'text' ? (
                    <textarea
                      value={textInput}
                      onChange={(event) => setTextInput(event.target.value)}
                      className="h-40 w-full resize-none bg-transparent text-sm leading-7 text-white placeholder:text-white/28 focus:outline-none"
                    />
                  ) : activeMode === 'voice' ? (
                    <div className="space-y-4">
                      <div className="flex h-40 items-center justify-center rounded-[1.2rem] bg-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 14 }).map((_, index) => (
                            <span
                              key={index}
                              className="w-1.5 rounded-full bg-[var(--song-primary)]/90"
                              style={{ height: `${18 + ((index % 5) + 1) * 10}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-white/56">{defaultPrompts[language].voice}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex h-40 items-center justify-center rounded-[1.2rem] border border-[var(--song-primary)]/30 bg-[radial-gradient(circle_at_center,rgba(124,141,255,0.14),transparent_60%)]">
                        <div className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/72">
                          {language === 'vi' ? 'Camera preview placeholder' : 'Camera preview placeholder'}
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-white/56">{defaultPrompts[language].face}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass rounded-[1.4rem] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4 text-[var(--song-primary)]" />
                  {language === 'vi' ? 'Realtime confidence' : 'Realtime confidence'}
                </div>
                <div className="mt-4 space-y-4 rounded-[1.2rem] border border-white/6 bg-black/18 p-4">
                  <ConfidenceBar label={language === 'vi' ? 'Khuôn mặt' : 'Face'} value={faceConfidence} color="primary" />
                  <ConfidenceBar label={language === 'vi' ? 'Giọng nói' : 'Voice'} value={voiceConfidence} color="secondary" />
                  <ConfidenceBar label={language === 'vi' ? 'Văn bản' : 'Text'} value={textConfidence} color="accent" />
                  <div className="rounded-2xl bg-white/[0.03] p-4">
                    <p className="pill-label text-[0.58rem] text-white/28">Mood guidance</p>
                    <p className="mt-3 text-sm leading-7 text-white/56">{tasteProfile.recommendationReasons[currentEmotion][language]}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAnalyze}
                className="pill-button pill-button-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isAnalyzing ? (language === 'vi' ? 'Đang đọc mood...' : 'Analyzing mood...') : (language === 'vi' ? 'Bắt đầu phân tích' : 'Start analysis')}
              </button>
              <Link href="/goiY" className="pill-button pill-button-secondary inline-flex items-center gap-2 px-5 py-3 text-sm text-white/78">
                {language === 'vi' ? 'Sang gợi ý' : 'Open recommendations'}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Play next from this mood</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{language === 'vi' ? 'Đề xuất nối tiếp ngay sau khi quét' : 'Immediate recommendations after scan'}</h2>
              </div>
              <MoodBadge emotion={currentEmotion} size="sm" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {recommendedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Current read</p>
            <div className="mt-4 rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(30,215,96,0.1),rgba(255,255,255,0.03))] p-4">
              <MoodBadge emotion={currentEmotion} size="lg" animated />
              <p className="mt-4 text-3xl font-bold text-white">{fusionScore}%</p>
              <p className="mt-1 text-sm text-white/46">{language === 'vi' ? 'Confidence sau hợp nhất tín hiệu' : 'Confidence after signal fusion'}</p>
              <p className="mt-4 text-sm leading-7 text-white/56">{tasteProfile.recommendationReasons[currentEmotion][language]}</p>
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Recent scans</p>
            <div className="mt-4 space-y-3">
              {logs.map((item) => {
                const Icon = modeIcon[item.mode]
                return (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-[var(--song-primary)]">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.mode.toUpperCase()}</p>
                          <p className="text-xs text-white/42">{item.confidence}% confidence</p>
                        </div>
                      </div>
                      <MoodBadge emotion={item.emotion} size="sm" />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/56">{item.note}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Why it fits your taste</p>
            <div className="mt-4 space-y-3">
              {tasteProfile.topGenres.slice(0, 3).map((genre) => (
                <div key={genre.id} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-medium text-white">{localizedLabel(genre.label, language)}</p>
                  <span className="text-sm text-white/48">{genre.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
