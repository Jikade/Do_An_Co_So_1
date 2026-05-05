import SongCard from "@/components/music/song-card";
import { getSongs } from "@/lib/api/songs";

export const dynamic = "force-dynamic";

export default async function BangDieuKhienPage() {
  const songs = await getSongs();

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
