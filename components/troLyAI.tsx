"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  Bot,
  Languages,
  Loader2,
  Mic,
  MicOff,
  Minus,
  Music2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { useNhanDangGiongNoi } from "@/hooks/useNhanDangGiongNoi";
import { mockSongs } from "@/lib/duLieuGiaLap";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import {
  musicBotQuickPrompts,
  resolveBotMusicCommand,
} from "@/lib/lenhBotNhac";
import { cn } from "@/lib/tienIch";

interface AssistantMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AIAssistantPanel() {
  const {
    language,
    currentEmotion,
    songs,
    isLoadingSongs,
    songError,
    nowPlaying,
    setNowPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    setVolume,
    setIsMuted,
  } = useTheme();

  const [viewState, setViewState] = useState<"minimized" | "expanded">(
    "minimized",
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        language === "vi"
          ? "KhoaLisa AI sẵn sàng. Bạn có thể nhập hoặc nói để yêu cầu mình phát nhạc theo tên bài, mood, artist hoặc random."
          : "KhoaLisa AI is ready. You can type or speak to play music by song title, mood, artist, or random.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const availableSongs = useMemo(() => {
    return songs.length > 0 ? songs : mockSongs;
  }, [songs]);

  const quickActions = useMemo(() => {
    return musicBotQuickPrompts.map((item) => ({
      id: item.id,
      label: item.label[language] ?? item.label.vi,
      prompt: item.prompt[language] ?? item.prompt.vi,
    }));
  }, [language]);

  useEffect(() => {
    if (viewState === "expanded") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewState]);

  const pushConversation = useCallback((userInput: string, reply: string) => {
    setMessages((prev) =>
      [
        ...prev,
        {
          id: makeId(),
          role: "user",
          content: userInput,
        },
        {
          id: makeId(),
          role: "assistant",
          content: reply,
        },
      ].slice(-14),
    );
  }, []);

  const respond = useCallback(
    (userInput: string) => {
      const result = resolveBotMusicCommand(userInput, availableSongs, {
        language,
        currentEmotion,
        nowPlaying,
      });

      let reply = result.reply;

      if (isLoadingSongs && availableSongs.length === 0) {
        reply =
          language === "vi"
            ? "Mình đang tải danh sách bài hát, thử lại sau vài giây nhé."
            : "I am still loading songs. Please try again shortly.";
      }

      if (songError && availableSongs.length === mockSongs.length) {
        reply +=
          language === "vi"
            ? " Mình đang dùng dữ liệu mock vì backend chưa trả danh sách bài hát."
            : " I am using mock data because the backend song list is unavailable.";
      }

      if (result.type === "play") {
        setNowPlaying(result.song);
        setIsPlaying(true);
      }

      if (result.type === "control") {
        if (result.control === "pause") {
          setIsPlaying(false);
        }

        if (result.control === "resume") {
          setIsPlaying(true);
        }

        if (result.control === "next") {
          playNext();
        }

        if (result.control === "previous") {
          playPrevious();
        }
      }

      if (result.type === "volume") {
        setVolume(result.value);
        setIsMuted(Boolean(result.muted));
      }

      pushConversation(userInput, reply);
    },
    [
      availableSongs,
      currentEmotion,
      isLoadingSongs,
      language,
      nowPlaying,
      playNext,
      playPrevious,
      pushConversation,
      setIsMuted,
      setIsPlaying,
      setNowPlaying,
      setVolume,
      songError,
    ],
  );

  const handleFinalSpeechText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setInput(trimmed);
      respond(trimmed);
      setInput("");
    },
    [respond],
  );

  const {
    isSupported: isSpeechSupported,
    isListening,
    speechLocale,
    interimTranscript,
    error: speechError,
    toggleListening,
    toggleSpeechLocale,
  } = useNhanDangGiongNoi({
    language,
    onFinalText: handleFinalSpeechText,
  });

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    respond(trimmed);
    setInput("");
  }, [input, respond]);

  return (
    <div className="fixed bottom-28 right-5 z-[90] md:bottom-24 md:right-8">
      <AnimatePresence mode="wait">
        {viewState === "expanded" ? (
          <motion.div
            key="assistant-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[min(92vw,24rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-black/85 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.18em]">
                    KhoaLisa AI
                  </h3>

                  <p className="text-[0.68rem] text-white/45">
                    {isLoadingSongs
                      ? language === "vi"
                        ? "Đang tải thư viện nhạc..."
                        : "Loading library..."
                      : nowPlaying
                        ? `${nowPlaying.title} · ${nowPlaying.artist}`
                        : language === "vi"
                          ? "Điều khiển trình phát nhạc"
                          : "Music player control"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewState("minimized")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Minimize assistant"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewState("minimized")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[22rem] space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "ml-auto bg-white text-black"
                      : "mr-auto border border-white/10 bg-white/[0.06] text-white/85",
                  )}
                >
                  {message.content}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => respond(action.prompt)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-2">
                <Sparkles className="ml-2 h-4 w-4 shrink-0 text-white/35" />

                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={
                    language === "vi"
                      ? "Nói hoặc nhập: mở bài Lemon Tree..."
                      : "Speak or type: play Lemon Tree..."
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                  autoComplete="off"
                />

                <button
                  type="button"
                  onClick={toggleSpeechLocale}
                  className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 text-[0.62rem] font-black text-white/55 transition hover:bg-white/10 hover:text-white"
                  title={
                    language === "vi"
                      ? "Đổi ngôn ngữ ghi âm Việt/Anh"
                      : "Switch voice language Vietnamese/English"
                  }
                  aria-label={
                    language === "vi"
                      ? "Đổi ngôn ngữ ghi âm"
                      : "Switch speech language"
                  }
                >
                  <Languages className="h-3.5 w-3.5" />
                  {speechLocale === "vi-VN" ? "VI" : "EN"}
                </button>

                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={!isSpeechSupported}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95",
                    isListening
                      ? "border-red-300/40 bg-red-500/20 text-red-100"
                      : "border-white/10 bg-white/[0.05] text-white/55 hover:bg-white/10 hover:text-white",
                    !isSpeechSupported && "cursor-not-allowed opacity-40",
                  )}
                  title={
                    !isSpeechSupported
                      ? "Trình duyệt chưa hỗ trợ nhận diện giọng nói"
                      : isListening
                        ? "Dừng ghi âm"
                        : "Bấm để nói"
                  }
                  aria-label={
                    isListening
                      ? language === "vi"
                        ? "Dừng ghi âm"
                        : "Stop recording"
                      : language === "vi"
                        ? "Bắt đầu ghi âm"
                        : "Start recording"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
                  aria-label="Send command"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {isListening && (
                <p className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50">
                  {language === "vi" ? "Đang nghe" : "Listening"}
                  {interimTranscript ? `: ${interimTranscript}` : "..."}
                </p>
              )}

              {speechError && (
                <p className="mt-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs text-red-100/80">
                  {speechError}
                </p>
              )}

              {!isSpeechSupported && (
                <p className="mt-2 rounded-2xl border border-yellow-300/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-100/80">
                  {language === "vi"
                    ? "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Hãy thử Chrome hoặc Edge."
                    : "This browser does not support speech recognition. Try Chrome or Edge."}
                </p>
              )}

              <div className="mt-2 flex items-center gap-2 px-2 text-[0.68rem] text-white/35">
                {isLoadingSongs ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Music2 className="h-3.5 w-3.5" />
                )}

                <span>
                  {language === "vi"
                    ? `${availableSongs.length} bài có thể phát`
                    : `${availableSongs.length} playable songs`}
                </span>

                <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest text-white/30">
                  {speechLocale === "vi-VN" ? "Voice VI" : "Voice EN"}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="assistant-orb"
            type="button"
            onClick={() => setViewState("expanded")}
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="relative flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:scale-110 hover:border-white/20 hover:bg-black active:scale-95"
            aria-label="Open KhoaLisa AI assistant"
          >
            <span className="absolute inset-0 rounded-full bg-white/5 blur-xl" />

            <Bot className="relative h-7 w-7 text-white" />

            {nowPlaying ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-emerald-400">
                <AudioLines className="h-3 w-3 text-black" />
              </span>
            ) : (
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border border-black bg-white/40" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
