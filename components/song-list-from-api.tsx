"use client";

import { useEffect, useState } from "react";

import { PlayableSongCard } from "@/components/music/playable-song-card";
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

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white">
        Đang tải danh sách bài hát...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-red-200">
        {error}
      </section>
    );
  }

  if (songs.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white/70">
        Chưa có bài hát nào trong backend.
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/45">
          Bấm play để phát bằng player chung phía dưới.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {songs.map((song) => (
          <PlayableSongCard key={song.id} track={song} />
        ))}
      </div>
    </section>
  );
}
