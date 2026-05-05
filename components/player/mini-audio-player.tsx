"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type MiniAudioPlayerProps = {
  src: string;
};

function formatTime(time: number) {
  if (!time || Number.isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function MiniAudioPlayer({ src }: MiniAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-4">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-black shadow-lg transition hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-[11px] text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="relative">
              <div className="h-2 rounded-full bg-white/10" />
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="absolute left-0 top-[-6px] h-4 w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
