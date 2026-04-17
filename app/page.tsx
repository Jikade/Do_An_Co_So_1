import Link from 'next/link'
import { ArrowRight, Crown, Disc3, Play, Radio, ScanFace, Waves } from 'lucide-react'
import {
  genreCollections,
  getFeaturedLandingPlaylists,
  howItWorksSteps,
  landingTrustTags,
  localizedCopy,
  moodCollections,
  personalizedPreview,
  premiumFeatures,
} from '@/lib/product-upgrade-data'
import { landingPageCopy } from '@/lib/vietnamese-home-copy'

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-cyan-100/75">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/58 md:text-base">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  const featuredPlaylists = getFeaturedLandingPlaylists()
  const copy = landingPageCopy

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#121212] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(91,109,255,0.16),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(30,215,96,0.09),transparent_18%),linear-gradient(180deg,#121212,#0f1013_42%,#121212)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[160px]" />

      <main>
        <section className="relative px-5 pb-16 pt-8 md:px-8 md:pb-20 md:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between rounded-full border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-xl md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_40px_rgba(97,144,255,0.16)]">
                  <Radio className="h-5 w-5 text-cyan-100" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.28em] text-white/35">{copy.brandEyebrow}</p>
                  <p className="text-base font-semibold text-white">MoodSync AI</p>
                </div>
              </div>

              <Link href="/app" className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90">
                {copy.enterApp}
              </Link>
            </div>

            <div className="grid gap-10 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-cyan-100/85">
                  <Waves className="h-3.5 w-3.5" />
                  {copy.heroBadge}
                </div>
                <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
                  {copy.heroTitle}
                  <span className="mt-2 block bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                    {copy.heroTitleAccent}
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
                  {copy.heroDescription}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-black transition hover:bg-white/90">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    {copy.primaryCta}
                  </Link>
                  <Link href="/nhanDienCamXuc" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 text-sm font-medium text-white transition hover:bg-white/[0.08]">
                    <ScanFace className="mr-2 h-4 w-4" />
                    {copy.secondaryCta}
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {landingTrustTags.map((tag) => (
                    <span key={tag.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/62">
                      {localizedCopy(tag.label, 'vi')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-10 top-8 h-44 rounded-full bg-cyan-400/10 blur-[110px]" />
                <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(14,15,19,0.96))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.36)] md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/35">{copy.previewEyebrow}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{copy.previewTitle}</p>
                      <p className="mt-1 text-sm text-white/48">{copy.previewDescription}</p>
                    </div>
                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                      {copy.previewStatus}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(113,92,255,0.4),transparent_40%),linear-gradient(135deg,rgba(34,38,52,1),rgba(15,17,24,1))] p-5">
                      <div className="flex aspect-square items-center justify-center rounded-[24px] border border-white/10 bg-black/20 shadow-[0_24px_70px_rgba(90,84,255,0.28)]">
                        <Disc3 className="h-16 w-16 text-white" />
                      </div>
                      <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/38">
                        <span>{copy.previewMoodFit}</span>
                        <span>92%</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[26px] border border-white/8 bg-white/[0.035] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white/56">{copy.previewCurrentMood}</p>
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/66">{copy.previewMoodValue}</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-white/58">{copy.previewMoodDescription}</p>
                      </div>

                      <div className="rounded-[26px] border border-white/8 bg-white/[0.035] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white/56">{copy.productPreviewLabels.queue}</p>
                          <span className="text-xs text-cyan-100/80">{copy.productPreviewLabels.internalPicks}</span>
                        </div>
                        <div className="mt-4 space-y-3">
                          {['Velvet Night', 'Rose Garden', 'Summer Wine'].map((title, index) => (
                            <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/6 bg-black/20 px-3 py-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(95,108,255,0.9),rgba(45,212,191,0.5))]">
                                <Disc3 className="h-4 w-4 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{title}</p>
                                <p className="truncate text-xs text-white/42">{copy.previewQueueReasons[index]}</p>
                              </div>
                              <span className="text-xs text-white/28">{`0${index + 1}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow={copy.landingSections.emotions.eyebrow}
              title={copy.landingSections.emotions.title}
              description={copy.landingSections.emotions.description}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {moodCollections.map((mood) => (
                <Link
                  key={mood.id}
                  href="/goiY"
                  className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#181818] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/14"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mood.accent} opacity-90`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
                  <div className="relative">
                    <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">{localizedCopy(mood.title, 'vi')}</div>
                    <h3 className="mt-12 text-xl font-medium text-white">{localizedCopy(mood.title, 'vi')}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{localizedCopy(mood.subtitle, 'vi')}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/72 transition group-hover:text-white">
                      {copy.openPicks}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow={copy.landingSections.genres.eyebrow}
              title={copy.landingSections.genres.title}
              description={copy.landingSections.genres.description}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {genreCollections.slice(0, 10).map((genre) => (
                <Link
                  key={genre.id}
                  href="/goiY"
                  className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#1f1f1f] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/14"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.accent} opacity-85`} />
                  <div className="relative">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/34">{copy.landingSections.genres.eyebrow}</p>
                    <h3 className="mt-10 text-xl font-medium text-white">{localizedCopy(genre.title, 'vi')}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{localizedCopy(genre.subtitle, 'vi')}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/72 transition group-hover:text-white">
                      {copy.explore}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow={copy.landingSections.howItWorks.eyebrow}
              title={copy.landingSections.howItWorks.title}
              description={copy.landingSections.howItWorks.description}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {howItWorksSteps.map((step, index) => (
                <article key={step.id} className="rounded-[30px] border border-white/8 bg-[#252525] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                    <span className="text-sm font-semibold">{`0${index + 1}`}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-medium text-white">{localizedCopy(step.title, 'vi')}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">{localizedCopy(step.description, 'vi')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(16,17,21,0.96))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.3)]">
                <SectionHeader
                  eyebrow={copy.landingSections.personalization.eyebrow}
                  title={copy.landingSections.personalization.title}
                  description={copy.landingSections.personalization.description}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {personalizedPreview.map((item) => (
                  <article key={item.id} className="rounded-[28px] border border-white/8 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/34">{localizedCopy(item.label, 'vi')}</p>
                    <h3 className="mt-4 text-xl font-semibold text-white">{localizedCopy(item.value, 'vi')}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/58">{localizedCopy(item.detail, 'vi')}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow={copy.landingSections.playlists.eyebrow}
              title={copy.landingSections.playlists.title}
              description={copy.landingSections.playlists.description}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredPlaylists.map((playlist) => (
                <article key={playlist.id} className="group overflow-hidden rounded-[30px] border border-white/8 bg-[#252525] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={playlist.coverUrl} alt={playlist.name.vi} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                      {copy.playlistOverrides[playlist.id as keyof typeof copy.playlistOverrides]?.name ?? playlist.name.vi}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white">{copy.playlistOverrides[playlist.id as keyof typeof copy.playlistOverrides]?.name ?? playlist.name.vi}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">{copy.playlistOverrides[playlist.id as keyof typeof copy.playlistOverrides]?.description ?? playlist.description.vi}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-white/42">{playlist.songCount} {copy.songsUnit} • {playlist.duration}</span>
                      <Link href="/goiY" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90">
                        {copy.featuredPlaylistCta}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(31,31,31,0.96),rgba(18,18,18,0.95))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100/75">{copy.landingSections.premium.eyebrow}</p>
                  <h2 className="mt-3 flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
                    <Crown className="h-7 w-7 text-[#ffe59a]" />
                    {copy.landingSections.premium.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/58 md:text-base">
                    {copy.landingSections.premium.description}
                  </p>
                </div>

                <div className="grid gap-3 md:min-w-[22rem]">
                  {premiumFeatures.slice(0, 3).map((feature) => (
                    <div key={feature.title.en} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                      <p className="text-sm font-medium text-white">{localizedCopy(feature.title, 'vi')}</p>
                      <p className="mt-1 text-xs leading-6 text-white/46">{localizedCopy(feature.detail, 'vi')}</p>
                    </div>
                  ))}
                  <Link href="/caiDat" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90">
                    {copy.landingSections.premium.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-8 md:py-18">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(86,99,255,0.24),transparent_36%),linear-gradient(180deg,rgba(18,21,29,0.98),rgba(8,10,14,0.96))] px-6 py-10 text-center shadow-[0_28px_90px_rgba(0,0,0,0.32)] md:px-10">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100/75">{copy.landingSections.final.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {copy.landingSections.final.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
              {copy.landingSections.final.description}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-black transition hover:bg-white/90">
                {copy.landingSections.final.primaryCta}
              </Link>
              <Link href="/nhanDienCamXuc" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 text-sm font-medium text-white transition hover:bg-white/[0.08]">
                {copy.landingSections.final.secondaryCta}
              </Link>
              <Link href="/goiY" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 text-sm font-medium text-white transition hover:bg-white/[0.08]">
                {copy.landingSections.final.tertiaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 px-5 py-7 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Radio className="h-4 w-4 text-cyan-100" />
            </div>
            <span className="font-medium text-white/78">MoodSync AI</span>
          </div>
          <p>{copy.footer}</p>
        </div>
      </footer>
    </div>
  )
}
