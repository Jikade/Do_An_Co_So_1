"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { AlertTriangle, Brain, Loader2, Mic, MicOff, Music2, Play, Sparkles, WandSparkles } from "lucide-react"

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

type SpeechRecognitionResultLike = {
  isFinal: boolean
  [index: number]: {
    transcript: string
  }
}

type SpeechRecognitionResultListLike = {
  length: number
  [index: number]: SpeechRecognitionResultLike
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: SpeechRecognitionResultListLike
}

type SpeechRecognitionErrorEventLike = {
  error: string
  message?: string
}

type BrowserSpeechRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor
}

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

const SPEECH_ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Bạn chưa cấp quyền microphone. Hãy cho phép trình duyệt dùng microphone rồi thử lại.",
  "service-not-allowed": "Dịch vụ nhận diện giọng nói đang bị trình duyệt chặn.",
  "audio-capture": "Không tìm thấy microphone hoặc microphone đang bị ứng dụng khác sử dụng.",
  network: "Không thể kết nối dịch vụ nhận diện giọng nói. Vui lòng kiểm tra mạng.",
  "no-speech": "Chưa nghe thấy giọng nói. Hãy thử nói gần microphone hơn.",
}

export default function EmotionDetectionPage() {
  const { language, fusionScore, currentEmotion, setCurrentEmotion, setConfidences, setNowPlaying, setIsPlaying } = useTheme()

  const [textInput, setTextInput] = useState(EXAMPLE_PROMPTS[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<EmotionDetectResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speechStatus, setSpeechStatus] = useState("Bấm micro để đọc cảm xúc bằng tiếng Việt và tự điền vào ô văn bản.")

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const finalTranscriptRef = useRef(EXAMPLE_PROMPTS[0])

  const probabilities = result?.probabilities ?? DEFAULT_PROBABILITIES
  const probabilityRows = Object.entries(probabilities) as Array<[NlpEmotion, number]>
  const detectedUiEmotion = result ? toUiEmotion(result.emotion) : currentEmotion
  const confidencePercent = result?.confidencePercent ?? fusionScore

  const recommendedSongs = useMemo(
    () => (result?.recommendedSongs ?? []).map(recommendedTrackToSong),
    [result?.recommendedSongs],
  )

  const topSong = result?.autoPlaySong ?? result?.recommendedSongs?.[0] ?? null

  useEffect(() => {
    const SpeechRecognitionConstructor =
      (window as SpeechRecognitionWindow).SpeechRecognition ??
      (window as SpeechRecognitionWindow).webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      setSpeechSupported(false)
      setSpeechStatus("Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy thử Chrome hoặc Edge.")
      return
    }

    const recognition = new SpeechRecognitionConstructor()

    recognition.lang = "vi-VN"
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setSpeechStatus("Đang nghe... hãy nói cảm xúc của bạn bằng tiếng Việt.")
    }

    recognition.onend = () => {
      setIsListening(false)
      setSpeechStatus("Đã dừng ghi âm. Bạn có thể chỉnh lại văn bản hoặc bấm phân tích.")
    }

    recognition.onerror = (event) => {
      setIsListening(false)

      if (event.error === "aborted") {
        setSpeechStatus("Đã hủy ghi âm.")
        return
      }

      const message = SPEECH_ERROR_MESSAGES[event.error] ?? `Không thể nhận diện giọng nói (${event.error}).`

      setSpeechStatus(message)
      setError(message)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const resultItem = event.results[index]
        const transcript = resultItem[0]?.transcript ?? ""

        if (resultItem.isFinal) {
          finalTranscript += ` ${transcript}`
        } else {
          interimTranscript += ` ${transcript}`
        }
      }

      if (finalTranscript.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalTranscript}`.trim()
      }

      const nextText = `${finalTranscriptRef.current} ${interimTranscript}`.trim()

      if (nextText) {
        setTextInput(nextText)
        setSpeechStatus(
          interimTranscript.trim()
            ? "Đang nhận diện tạm thời..."
            : "Đã nhận diện xong một đoạn. Bạn có thể nói tiếp hoặc dừng ghi âm.",
        )
      }
    }

    recognitionRef.current = recognition
    setSpeechSupported(true)

    return () => {
      recognition.onstart = null
      recognition.onend = null
      recognition.onerror = null
      recognition.onresult = null
      recognition.abort()
      recognitionRef.current = null
    }
  }, [])

  const handleTextChange = (value: string) => {
    finalTranscriptRef.current = value
    setTextInput(value)
  }

  const handleToggleListening = () => {
    const recognition = recognitionRef.current

    if (!recognition) {
      const message = "Trình duyệt hiện tại chưa hỗ trợ ghi âm chuyển thành văn bản."
      setSpeechStatus(message)
      setError(message)
      return
    }

    if (isListening) {
      recognition.stop()
      return
    }

    finalTranscriptRef.current = ""
    setTextInput("")
    setError(null)
    setSpeechStatus("Đang xin quyền microphone...")

    try {
      recognition.start()
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "InvalidStateError"
          ? "Microphone đang được ghi âm. Hãy dừng ghi âm trước khi bắt đầu lại."
          : "Không thể bắt đầu ghi âm. Vui lòng thử lại."

      setSpeechStatus(message)
      setError(message)
    }
  }

  const handleExamplePrompt = (prompt: string) => {
    if (isListening) {
      recognitionRef.current?.stop()
    }

    finalTranscriptRef.current = prompt
    setTextInput(prompt)
    setSpeechStatus("Đã chọn ví dụ mẫu.")
  }

  const handleAnalyze = async () => {
    if (isListening) {
      recognitionRef.current?.stop()
    }

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
                Nhập vài câu mô tả tâm trạng. Backend sẽ gọi ML service, dự đoán cảm xúc, lọc bài hát theo mood
                trong database và tự động phát bài phù hợp nhất.
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
            onChange={(event) => handleTextChange(event.target.value)}
            placeholder="Ví dụ: Tôi cảm thấy rất cô đơn và mệt mỏi..."
            className="min-h-[220px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
          />

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl transition",
                    isListening ? "bg-red-500/15 text-red-100 ring-4 ring-red-400/10" : "bg-cyan-500/15 text-cyan-100",
                  )}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">Ghi âm giọng nói</p>
                  <p className="text-xs text-white/55">Ngôn ngữ nhận diện: Tiếng Việt — vi-VN</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleListening}
                disabled={!speechSupported || isAnalyzing}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                  isListening
                    ? "border-red-300/40 bg-red-400/15 text-red-50 hover:bg-red-400/20"
                    : "border-cyan-300/30 bg-cyan-400/10 text-cyan-50 hover:bg-cyan-400/15",
                  (!speechSupported || isAnalyzing) && "cursor-not-allowed opacity-50 hover:bg-transparent",
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
              </button>
            </div>

            <p className={cn("mt-3 text-sm leading-6", isListening ? "text-cyan-100" : "text-white/55")}>
              {speechStatus}
            </p>

            {isListening ? (
              <div className="mt-3 flex h-9 items-end gap-1">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={index}
                    className="w-1.5 animate-pulse rounded-full bg-cyan-200/80"
                    style={{ height: `${10 + ((index % 6) + 1) * 4}px` }}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleExamplePrompt(prompt)}
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
            disabled={isAnalyzing || isListening}
            className={cn(
              "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
            )}
          >
            {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5" />}
            {isListening ? "Dừng ghi âm trước khi phân tích" : isAnalyzing ? "AI đang phân tích..." : "Phân tích cảm xúc"}
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
                <div
                  key={emotion}
                  className={cn(
                    "rounded-3xl border p-4",
                    isTop ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/20",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{emotionNameLabel(emotion, language)}</span>
                    <span className="text-white/70">{percent}%</span>
                  </div>

                  <ConfidenceBar
                    label={emotionNameLabel(emotion, language)}
                    value={percent}
                    color={index === 0 ? "primary" : index === 1 ? "secondary" : "accent"}
                  />
                </div>
              )
            })}
          </div>

          {result?.rationale ? (
            <p className="mt-5 rounded-2xl bg-black/25 p-4 text-sm leading-6 text-white/65">{result.rationale}</p>
          ) : null}
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
