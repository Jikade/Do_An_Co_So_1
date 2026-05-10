import SongCard from "@/components/music/song-card";
import { getSongs, type Song } from "@/lib/api/songs";

export const dynamic = "force-dynamic";

export default async function BangDieuKhienPage() {
  let songs: Song[] = [];
  let errorMessage: string | null = null;

  try {
    songs = await getSongs();
  } catch (error) {
    console.error("[BangDieuKhienPage] getSongs failed:", error);
    errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể tải danh sách bài hát.";
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Trang chủ
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Không gian nghe của cậu
        </h1>
      </div>

      {errorMessage && (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-100">
          Không tải được danh sách bài hát. Backend có thể chưa sẵn sàng.
          <div className="mt-2 break-all text-red-100/70">{errorMessage}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {songs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-white/60">
          Chưa có bài hát nào
        </div>
      )}
    </div>
  );
}
