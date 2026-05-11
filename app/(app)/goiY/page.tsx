"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SongCard from "@/components/music/song-card";
import { getSongs, type Song } from "@/lib/api/songs";
import { getPersonalRecommendations } from "@/lib/api/recommendations";
import { useTheme } from "@/lib/nguCanhGiaoDien";

export default function GoiYPage() {
  const { currentEmotion } = useTheme();
  const [songs, setSongs] = useState<Song[]>([]);
  const [rationale, setRationale] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getPersonalRecommendations(24, {
          emotion: currentEmotion,
          source: "goiY",
        });

        if (cancelled) return;

        setSongs(result.tracks);
        setRationale(result.rationale ?? null);
      } catch (recommendError) {
        try {
          const fallbackSongs = await getSongs();

          if (cancelled) return;

          setSongs(fallbackSongs);
          setRationale(null);
          setError(
            "Chưa thể tải gợi ý cá nhân hóa. Đang hiển thị thư viện bài hát.",
          );
        } catch (songsError) {
          if (cancelled) return;

          setSongs([]);
          setRationale(null);
          setError(
            songsError instanceof Error
              ? songsError.message
              : "Không tải được danh sách bài hát.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [currentEmotion]);

  return (
    <main className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/"
          className="text-sm font-medium text-white/50 transition hover:text-white"
        >
          Trang chủ
        </Link>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/35">
            Cá nhân hóa theo tài khoản
          </p>

          <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
            Gợi ý dành riêng cho cậu
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
            Hệ thống ưu tiên bài hát dựa trên lịch sử nghe, thời lượng nghe,
            mood gần đây, like/skip và gu nghệ sĩ của tài khoản hiện tại.
          </p>
        </div>

        {rationale ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
            {rationale}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
            {error}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
          Đang tạo gợi ý theo lịch sử nghe của bạn...
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>

          {songs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
              Chưa có bài hát nào để gợi ý. Hãy thêm bài hát trong trang quản lý
              bài hát trước.
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
