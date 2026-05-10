"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Brain, Loader2, Music2, Play, Sparkles, WandSparkles } from "lucide-react"

import { ConfidenceBar } from "@/components/thanhDoTinCay"
import { MoodBadge } from "@/components/huyHieuCamXuc"
import { SongCard } from "@/components/theBaiHat"
import { cn } from "@/lib/tienIch"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import {
  detectTextEmotion,
  emotionNameLabel,
  recommendedTrackToSong,
  toUiEmotion,
  type EmotionDetectResponse,
  type NlpEmotion,
} from "@/lib/emotion-api"

const DEFAULT_PROBABILITIES: Record<NlpEmotion, number> = {
  happy: 0.25,
  sad: 0.25,
  angry: 0.25,
  relaxed: 0.25,
}

const EXAMPLE_PROMPTS = [
  "Tôi cảm thấy rất cô đơn và mệt mỏi, chỉ muốn nghe một bài hát nhẹ nhàng.",
  "Hôm nay tôi vui quá, mọi thứ đều rất tuyệt và tôi muốn nghe nhạc tích cực.",
  "Tôi đang rất bực mình và khó chịu, cần nhạc để giải tỏa năng lượng.",
  "Tôi muốn thư giãn sau một ngày dài, tâm trí cần bình yên hơn.",
]

export default function EmotionDetectionPage() {
  const { language, fusionScore, currentEmotion, setCurrentEmotion, setConfidences, setNowPlaying, setIsPlaying } = useTheme()
  const [textInput, setTextInput] = useState(EXAMPLE_PROMPTS[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<EmotionDetectResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const probabilities = result?.probabilities ?? DEFAULT_PROBABILITIES
  const probabilityRows = Object.entries(probabilities) as Array<[NlpEmotion, number]>
  const detectedUiEmotion = result ? toUiEmotion(result.emotion) : currentEmotion
  const confidencePercent = result?.confidencePercent ?? fusionScore
  const recommendedSongs = useMemo(
    () => (result?.recommendedSongs ?? []).map(recommendedTrackToSong),
    [result?.recommendedSongs],
  )
  const topSong = result?.autoPlaySong ?? result?.recommendedSongs?.[0] ?? null

  const handleAnalyze = async () => {
    const cleanText = textInput.trim()
    if (!cleanText) {
      setError("Vui lòng nhập nội dung cảm xúc trước khi phân tích.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const data = await detectTextEmotion(cleanText, 9)
      setResult(data)

      const uiEmotion = toUiEmotion(data.emotion)
      const confidence = data.confidencePercent ?? Math.round(data.confidence * 100)
      setCurrentEmotion(uiEmotion)
      setConfidences(confidence, confidence, confidence)

      const autoSong = data.autoPlaySong ?? data.recommendedSongs[0]
      if (autoSong) {
        setNowPlaying(recommendedTrackToSong(autoSong))
        setIsPlaying(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể phân tích cảm xúc. Vui lòng kiểm tra backend/ML service.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-500/15 via-slate-950 to-cyan-500/10 p-6 shadow-2xl shadow-black/20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
              <Sparkles className="h-4 w-4" />
              Emotion AI / NLP tiếng Việt
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Nhận diện cảm xúc từ văn bản</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                Nhập vài câu mô tả tâm trạng. Backend sẽ gọi ML service, dự đoán cảm xúc, lọc bài hát theo mood trong database và tự động phát bài phù hợp nhất.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/60">Cảm xúc hiện tại</p>
                <div className="mt-2 flex items-center gap-3">
                  <MoodBadge emotion={detectedUiEmotion} size="lg" />
                  {result ? <span className="text-sm text-white/70">{emotionNameLabel(result.emotion, language)}</span> : null}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Độ tin cậy</p>
                <p className="text-3xl font-bold text-white">{confidencePercent}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-200">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Văn bản đầu vào</h2>
              <p className="text-sm text-white/60">Hỗ trợ tiếng Việt có dấu hoặc không dấu.</p>
            </div>
          </div>

          <textarea
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder="Ví dụ: Tôi cảm thấy rất cô đơn và mệt mỏi..."
            className="min-h-[220px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTextInput(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {prompt.slice(0, 42)}...
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-4 flex gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={cn(
              "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
            )}
          >
            {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5" />}
            {isAnalyzing ? "AI đang phân tích..." : "Phân tích cảm xúc"}
          </button>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Kết quả NLP</h2>
              <p className="text-sm text-white/60">Xác suất từng cảm xúc được chuẩn hóa về 100%.</p>
            </div>
            {result ? <MoodBadge emotion={detectedUiEmotion} size="md" /> : null}
          </div>

          <div className="space-y-4">
            {probabilityRows.map(([emotion, value], index) => {
              const percent = Math.round(value * 100)
              const isTop = result?.emotion === emotion
              return (
                <div key={emotion} className={cn("rounded-3xl border p-4", isTop ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/20")}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{emotionNameLabel(emotion, language)}</span>
                    <span className="text-white/70">{percent}%</span>
                  </div>
                  <ConfidenceBar label={emotionNameLabel(emotion, language)} value={percent} color={index === 0 ? "primary" : index === 1 ? "secondary" : "accent"} />
                </div>
              )
            })}
          </div>

          {result?.rationale ? <p className="mt-5 rounded-2xl bg-black/25 p-4 text-sm leading-6 text-white/65">{result.rationale}</p> : null}
        </section>
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Music2 className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-[0.25em]">Recommendation</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Bài hát đề xuất</h2>
            <p className="mt-1 text-sm text-white/60">Bài có điểm cao nhất sẽ được đưa vào player và phát tự động.</p>
          </div>

          {topSong ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
              <Play className="h-4 w-4 fill-current" />
              Auto-play: {topSong.title}
            </div>
          ) : null}
        </div>

        {recommendedSongs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedSongs.map((song, index) => {
              const raw = result?.recommendedSongs[index]
              return (
                <div key={song.id} className="space-y-2">
                  <SongCard song={song} />
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2 text-xs text-white/55">
                    <span>Mood DB: {raw?.mood ?? raw?.emotion ?? "unknown"}</span>
                    <span>Score: {Math.round(raw?.recommendation_score ?? 0)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-black/15 p-8 text-center text-white/60">
            Nhập văn bản và bấm “Phân tích cảm xúc” để nhận danh sách bài hát phù hợp.
          </div>
        )}
      </section>
    </div>
  )
}
