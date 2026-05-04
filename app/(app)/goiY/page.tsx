import SongListFromApi from "@/components/song-list-from-api";

export default function GoiYPage() {
  return (
    <main className="min-h-screen bg-[#050608] px-6 py-8 text-white">
      <SongListFromApi title="Gợi ý bài hát" limit={12} />
    </main>
  );
}
