'use client';

import Link from 'next/link';
import { Heart, Library, Music2, PlayCircle, Sparkles, Waves } from 'lucide-react';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import {
  getAllSongsLibrary,
  getLikedSongs,
  getRecentlyPlayedLibrary,
  getSavedPlaylists,
  getSavedRecommendationSongs,
  getUserLibraryStats,
  getUserPlaylists,
  libraryClusters,
  localizedCopy,
  getSongsByIds,
} from '@/lib/product-upgrade-data';
import { SongCard } from '@/components/theBaiHat';
import { PlaylistCard } from '@/components/theDanhSachPhat';

function ShelfTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="pill-label text-[0.62rem] text-white/32">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56">{description}</p>
    </div>
  );
}

export default function LibraryPage() {
  const { language, setNowPlaying, setIsPlaying } = useTheme();
  const stats = getUserLibraryStats();
  const allSongs = getAllSongsLibrary();
  const playlists = getUserPlaylists();
  const savedPlaylists = getSavedPlaylists();
  const likedSongs = getLikedSongs();
  const recentlyPlayed = getRecentlyPlayedLibrary();
  const savedRecommendations = getSavedRecommendationSongs();

  return (
    <div className="space-y-10 pb-32">
      <section className="surface-elevated overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_22rem]">
          <div>
            <p className="pill-label text-[0.66rem] text-white/34">Library</p>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold text-white md:text-5xl">
              {language === 'vi' ? 'Thu vien cua toi la mot music space, khong phai noi do list.' : 'My library is a music space, not a place to dump lists.'}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 md:text-base">
              {language === 'vi'
                ? 'Tat ca bai hat, playlist, liked songs, recently played, saved recommendations va mood collections duoc bo tri thanh nhung lop su dung ro rang.'
                : 'All songs, playlists, liked songs, recently played items, saved recommendations, and mood collections are arranged as distinct layers of use.'}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-[1.5rem] border border-white/6 bg-white/[0.03] p-4">
                  <p className="pill-label text-[0.58rem] text-white/28">{stat.label[language]}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Inside this space</p>
            <div className="mt-4 space-y-3">
              {[
                { title: 'All songs', text: 'Everything you can play from one place.', Icon: Music2 },
                { title: 'Mood collections', text: 'Shelves that mirror how you actually listen.', Icon: Waves },
                { title: 'Saved recommendations', text: 'AI picks worth keeping for later.', Icon: Sparkles },
                { title: 'Liked songs', text: 'Fast access to tracks you already approved.', Icon: Heart },
              ].map(({ title, text, Icon }) => (
                <div key={title} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-white/46">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/bangDieuKhien" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-accent)] hover:underline">
              {language === 'vi' ? 'Quay lai Home' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <ShelfTitle
          eyebrow="Your playlists"
          title={language === 'vi' ? 'Playlist tu tao va playlist da luu' : 'Created playlists and saved playlists'}
          description={language === 'vi' ? 'Phan nay giu ro ran giua list do ban tao va nhung list ban muon quay lai.' : 'This split keeps clear ownership between what you created and what you want to return to.'}
        />
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="surface-elevated p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Created</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
            </div>
          </div>
          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Saved</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {savedPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} variant="compact" />)}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <ShelfTitle
          eyebrow="Personal shelves"
          title={language === 'vi' ? 'Liked songs, recently played va saved recommendations' : 'Liked songs, recently played, and saved recommendations'}
          description={language === 'vi' ? 'Nhung shelf nay giup thu vien co tinh ca nhan that su, khong chi la danh muc metadata.' : 'These shelves make the library feel personal instead of behaving like a metadata catalog.'}
        />
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="surface-elevated p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Liked songs</p>
            <div className="mt-4 space-y-3">
              {likedSongs.slice(0, 4).map((song) => <SongCard key={song.id} song={song} variant="list" />)}
            </div>
          </div>
          <div className="surface-elevated p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Recently played</p>
            <div className="mt-4 space-y-3">
              {recentlyPlayed.slice(0, 4).map((song) => <SongCard key={song.id} song={song} variant="list" />)}
            </div>
          </div>
          <div className="surface-elevated p-5">
            <p className="pill-label text-[0.62rem] text-white/28">Saved recommendations</p>
            <div className="mt-4 space-y-3">
              {savedRecommendations.slice(0, 4).map((song) => <SongCard key={song.id} song={song} variant="list" />)}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <ShelfTitle
          eyebrow="Mood collections"
          title={language === 'vi' ? 'Nhung nhom nhac duoc to chuc theo cach ban cam thay' : 'Collections organized around how you feel'}
          description={language === 'vi' ? 'Mood-based collections khien thu vien van trung thanh voi loi hua san pham: music by emotion.' : 'Mood-based collections keep the library aligned with the core promise of music by emotion.'}
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {libraryClusters.map((cluster) => (
            <article key={cluster.id} className="surface-elevated overflow-hidden p-5">
              <p className="pill-label text-[0.62rem] text-white/28">{localizedCopy(cluster.title, language)}</p>
              <p className="mt-3 text-sm leading-7 text-white/56">{localizedCopy(cluster.subtitle, language)}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {getSongsByIds(cluster.songIds).slice(0, 4).map((song) => (
                  <SongCard key={song.id} song={song} variant="compact" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <ShelfTitle
          eyebrow="All songs"
          title={language === 'vi' ? 'Tat ca bai hat trong khong gian cua ban' : 'All songs in your space'}
          description={language === 'vi' ? 'Khi can tim nhanh mot bai, khu nay van giu dang card premium thay vi roi vao giao dien bang dieu khien.' : 'When you need fast access to everything, this shelf still keeps the premium card language instead of falling into a dashboard table.'}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {allSongs.slice(0, 8).map((song) => (
            <SongCard key={song.id} song={song} variant="compact" />
          ))}
        </div>
        <div className="surface-panel flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-semibold text-white">{language === 'vi' ? 'Uploaded or generated tracks can live here too.' : 'Uploaded or generated tracks can live here too.'}</p>
            <p className="mt-1 text-xs text-white/46">{language === 'vi' ? 'Khu vuc nay da san sang mo rong cho noi dung nguoi dung dua vao he thong.' : 'This space is ready to expand for user-provided content in future iterations.'}</p>
          </div>
          <button
            onClick={() => {
              if (!allSongs.length) return;
              setNowPlaying(allSongs[0]);
              setIsPlaying(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition hover:bg-white/[0.08]"
          >
            <PlayCircle className="h-4 w-4" />
            {language === 'vi' ? 'Play all songs' : 'Play all songs'}
          </button>
        </div>
      </section>
    </div>
  );
}
