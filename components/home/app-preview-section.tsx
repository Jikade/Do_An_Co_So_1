import Image from 'next/image'
import { Play, Search, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/common/section-heading'
import { appPreviewHighlights, appPreviewPlaylist } from '@/lib/khoaLisa-data'

export function AppPreviewSection() {
  const nowPlaying = appPreviewPlaylist[1]

  return (
    <section id="preview" className="px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="App preview"
          title="Trang chu khong can noi qua nhieu, chi can cho thay trai nghiem."
          description="Mockup duoc tiet che: player, queue va mood recommendation cung xuat hien trong mot bo cuc thoang, premium, nhin la muon vao app."
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[34px] border border-white/8 bg-[#0d1118] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
            <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/55">Mood queue</p>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Live palette</span>
                </div>
                <div className="mt-5 space-y-3">
                  {appPreviewPlaylist.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
                        <Image src={song.coverUrl} alt={song.title} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{song.title}</p>
                        <p className="truncate text-xs text-white/45">{song.artist}</p>
                      </div>
                      <span className="text-xs text-white/35">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(38,43,56,0.95),rgba(11,13,18,0.92))] p-5">
                <div className="flex items-center justify-between rounded-full border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/50">
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search by mood, artist, moment
                  </span>
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                </div>

                <div className="mt-5 rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(112,90,255,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="relative h-44 w-44 overflow-hidden rounded-[30px] shadow-[0_28px_70px_rgba(89,76,255,0.35)]">
                      <Image src={nowPlaying.coverUrl} alt={nowPlaying.title} fill className="object-cover" sizes="176px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">Now playing</p>
                      <h3 className="mt-3 text-3xl font-semibold text-white">{nowPlaying.title}</h3>
                      <p className="mt-2 text-sm text-white/55">{nowPlaying.artist} • Midnight recommendation</p>
                      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" />
                      </div>
                      <div className="mt-5 flex items-center gap-3">
                        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                          <Play className="h-5 w-5 fill-current" />
                        </button>
                        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65">
                          Mood match 92%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {appPreviewHighlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/35">{item.label}</p>
                      <p className="mt-2 text-sm text-white/70">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">Mood recommendation</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Goi y khong on ao, nhung rat co gu.</h3>
              <p className="mt-3 text-sm leading-7 text-white/58">
                KhoaLisa uu tien mot khung nhin sach: it section hon, khoang trong rong hon, de nguoi dung cam thay duoc dan di thay vi bi nhan chim trong UI.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,22,30,0.95),rgba(10,12,17,0.95))] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/55">For tonight</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">5 curated picks</span>
              </div>
              <div className="mt-5 space-y-4">
                {appPreviewPlaylist.slice(0, 3).map((song) => (
                  <div key={song.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
                      <Image src={song.coverUrl} alt={song.title} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{song.title}</p>
                      <p className="truncate text-xs text-white/45">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
