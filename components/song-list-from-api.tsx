"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { getTracks, type UiTrack } from "@/lib/tracks-api";

type SongListFromApiProps = {
  title?: string;
  limit?: number;
};

export default function SongListFromApi({
  title = "Danh sách bài hát",
  limit,
}: SongListFromApiProps) {
  const [songs, setSongs] = useState<UiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTracks();
        const finalData =
          typeof limit === "number" ? data.slice(0, limit) : data;

        if (!cancelled) {
          setSongs(finalData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Không tải được danh sách bài hát",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSongs();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  async function handlePlay(song: UiTrack) {
    const audio = audioRef.current;

    if (!audio) return;

    const isSameSong = playingId === song.id;
    const isPlaying = !audio.paused;

    if (isSameSong && isPlaying) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    try {
      audio.src = song.audioUrl;
      audio.load();

      await audio.play();

      setPlayingId(song.id);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        "Không phát được file mp3. Hãy kiểm tra audio_url trong database và backend /media.",
      );
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl bg-white/5 p-6 text-white">
        Đang tải danh sách bài hát...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-red-500/10 p-6 text-red-200">
        {error}
      </section>
    );
  }

  if (songs.length === 0) {
    return (
      <section className="rounded-2xl bg-white/5 p-6 text-white">
        Chưa có bài hát nào trong backend.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setPlayingId(null)}
      />

      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/60">
          Dữ liệu được fetch từ FastAPI backend.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {songs.map((song) => {
          const isCurrentSong = playingId === song.id;

          return (
            <article
              key={song.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-white/10">
                <img
                  src={song.coverUrl || "/placeholder.svg"}
                  alt={song.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>

              <div className="mt-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-white">
                  {song.title}
                </h3>

                <p className="line-clamp-1 text-sm text-white/60">
                  {song.artist || "Unknown Artist"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handlePlay(song)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:bg-white/90"
              >
                {isCurrentSong ? (
                  <>
                    <Pause size={18} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Play
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
