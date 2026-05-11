import Link from "next/link";

import { FilteredSongGrid } from "@/components/music/filtered-song-grid";
import { getSongs } from "@/lib/api/songs";

export const dynamic = "force-dynamic";

export default async function ThuVienPage() {
  const songs = await getSongs();

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
            Thư viện
          </p>

          <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
            Không gian nghe của cậu
          </h1>
        </div>
      </div>

      <FilteredSongGrid
        songs={songs}
        emptyMessage="Không có bài hát nào phù hợp với bộ lọc hiện tại."
      />
    </main>
  );
}
