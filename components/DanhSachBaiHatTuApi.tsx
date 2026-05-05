"use client";

import { useEffect, useState } from "react";

import { PlayableSongCard } from "@/components/music/playable-song-card";
import { getTracks, type UiTrack } from "@/lib/tracks-api";

export function DanhSachBaiHatTuApi() {
  const [tracks, setTracks] = useState<UiTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTracks()
      .then(setTracks)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Lỗi tải bài hát"),
      );
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {tracks.map((track) => (
        <PlayableSongCard key={track.id} track={track} />
      ))}
    </div>
  );
}
