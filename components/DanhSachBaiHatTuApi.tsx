"use client";

import { useEffect, useState } from "react";
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
    <div className="grid gap-4">
      {tracks.map((track) => (
        <div key={track.id} className="rounded-xl border border-white/10 p-4">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="h-24 w-24 rounded-lg object-cover"
          />
          <h3 className="mt-2 font-semibold">{track.title}</h3>
          <p className="text-sm text-white/60">{track.artist}</p>
          <p className="text-xs text-white/40">
            {track.emotionLabelVi ?? track.emotion}
          </p>
          <audio controls src={track.audioUrl} className="mt-3 w-full" />
        </div>
      ))}
    </div>
  );
}
