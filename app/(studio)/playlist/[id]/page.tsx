import { notFound } from 'next/navigation'
import { Play } from 'lucide-react'
import { getPlaylistById, getSongsForPlaylist } from '@/lib/khoaLisa-data'
import { formatDuration } from '@/lib/duLieuGiaLap'

export default async function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const playlist = getPlaylistById(id)

  if (!playlist) {
    notFound()
  }

  const songs = getSongsForPlaylist(id)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(114,97,255,0.24),transparent_36%),linear-gradient(180deg,rgba(18,22,32,0.96),rgba(10,12,17,0.96))] p-6 md:p-8">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-cyan-200/75">Playlist detail</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{playlist.name.vi}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">{playlist.description.vi}</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-white/45">
          <span>{playlist.songCount} tracks</span>
          <span>•</span>
          <span>{playlist.duration}</span>
          <button className="ml-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
            <Play className="h-4 w-4 fill-current" />
            Phat playlist
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.04]">
        <div className="grid grid-cols-[56px_1fr_auto] gap-4 border-b border-white/8 px-5 py-4 text-xs uppercase tracking-[0.22em] text-white/35">
          <span>#</span>
          <span>Track</span>
          <span>Length</span>
        </div>
        <div className="divide-y divide-white/8">
          {songs.map((song, index) => (
            <div key={song.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 px-5 py-4">
              <span className="text-sm text-white/35">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="font-medium text-white">{song.title}</p>
                <p className="text-sm text-white/45">{song.artist} • {song.album}</p>
              </div>
              <span className="text-sm text-white/45">{formatDuration(song.duration)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
