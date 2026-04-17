<<<<<<< HEAD
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
=======
'use client';

import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/chuyenNgonNgu';
import Link from 'next/link';
import { 
  Radio, 
  Play, 
  Scan, 
  Mic, 
  FileText, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Check,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/tienIch';

export default function LandingPage() {
  const { language, t } = useTheme();

  const content = {
    vi: {
      nav: {
        features: 'Tính năng',
        howItWorks: 'Cách hoạt động',
        pricing: 'Bảng giá',
        testimonials: 'Đánh giá',
        login: 'Đăng nhập',
        getStarted: 'Bắt đầu ngay',
      },
      hero: {
        badge: 'AI Cảm xúc Thế hệ mới',
        title: 'Âm nhạc theo',
        titleHighlight: 'cảm xúc của bạn',
        description: 'AI phát hiện cảm xúc từ khuôn mặt, giọng nói và văn bản để đề xuất âm nhạc hoàn hảo cho bạn. Trải nghiệm âm nhạc chưa từng có.',
        cta: 'Trải nghiệm miễn phí',
        secondaryCta: 'Xem demo',
        stats: [
          { value: '10M+', label: 'Bài hát' },
          { value: '98%', label: 'Độ chính xác' },
          { value: '2M+', label: 'Người dùng' },
        ],
      },
      features: {
        title: 'Công nghệ AI đột phá',
        subtitle: 'Khám phá cách MoodSync AI hiểu và đồng cảm với bạn',
        items: [
          {
            icon: Scan,
            title: 'Nhận diện khuôn mặt',
            description: 'AI phân tích biểu cảm khuôn mặt real-time để hiểu cảm xúc của bạn',
          },
          {
            icon: Mic,
            title: 'Phân tích giọng nói',
            description: 'Công nghệ xử lý âm thanh tiên tiến nhận diện cảm xúc qua giọng nói',
          },
          {
            icon: FileText,
            title: 'Phân tích văn bản',
            description: 'NLP hiểu ngữ cảnh và cảm xúc từ những gì bạn viết',
          },
          {
            icon: Brain,
            title: 'Tổng hợp đa phương thức',
            description: 'Thuật toán late-fusion kết hợp tất cả nguồn để đưa ra kết quả chính xác nhất',
          },
          {
            icon: Sparkles,
            title: 'Đề xuất AI thông minh',
            description: 'Gợi ý bài hát và playlist phù hợp hoàn hảo với tâm trạng của bạn',
          },
          {
            icon: Zap,
            title: 'Phản hồi tức thì',
            description: 'Xử lý và đề xuất trong vài giây, trải nghiệm mượt mà không gián đoạn',
          },
        ],
      },
      howItWorks: {
        title: 'Cách hoạt động',
        subtitle: 'Chỉ 3 bước đơn giản để bắt đầu',
        steps: [
          {
            number: '01',
            title: 'Cho phép truy cập',
            description: 'Bật camera hoặc microphone, hoặc nhập văn bản mô tả cảm xúc',
          },
          {
            number: '02',
            title: 'AI phân tích',
            description: 'MoodSync AI phân tích và xác định cảm xúc của bạn trong thời gian thực',
          },
          {
            number: '03',
            title: 'Thưởng thức âm nhạc',
            description: 'Nhận đề xuất playlist và bài hát phù hợp hoàn hảo với tâm trạng',
          },
        ],
      },
      pricing: {
        title: 'Chọn gói phù hợp',
        subtitle: 'Bắt đầu miễn phí, nâng cấp khi cần',
        plans: [
          {
            name: 'Free',
            price: '0',
            period: 'Mãi mãi',
            description: 'Trải nghiệm cơ bản',
            features: [
              'Phát hiện cảm xúc cơ bản',
              '10 bài hát/ngày',
              'Chế độ văn bản',
              'Playlist giới hạn',
            ],
            cta: 'Bắt đầu miễn phí',
            highlighted: false,
          },
          {
            name: 'Plus',
            price: '79.000',
            period: '/tháng',
            description: 'Cho người yêu nhạc',
            features: [
              'Phát hiện khuôn mặt + văn bản',
              'Không giới hạn bài hát',
              'Playlist cá nhân hóa',
              'Không quảng cáo',
              'Chất lượng cao',
            ],
            cta: 'Nâng cấp Plus',
            highlighted: false,
          },
          {
            name: 'VIP Pro',
            price: '199.000',
            period: '/tháng',
            description: 'Trải nghiệm đỉnh cao',
            features: [
              'Đa phương thức đầy đủ',
              'AI playlist không giới hạn',
              'Giao diện song ngữ',
              'Đồng bộ đa thiết bị',
              'Chủ đề âm thanh cao cấp',
              'Cá nhân hóa nâng cao',
              'Ưu tiên đề xuất',
            ],
            cta: 'Bắt đầu VIP Pro',
            highlighted: true,
          },
        ],
      },
      testimonials: {
        title: 'Được yêu thích bởi',
        subtitle: 'Hàng triệu người dùng trên toàn thế giới',
        items: [
          {
            content: 'MoodSync AI hiểu tôi hơn cả playlist Spotify của tôi. Mỗi bài hát đều đúng tâm trạng!',
            author: 'Ngọc Anh',
            role: 'Content Creator',
            rating: 5,
          },
          {
            content: 'Công nghệ nhận diện cảm xúc thực sự ấn tượng. Giúp tôi tập trung làm việc hiệu quả hơn.',
            author: 'Minh Tuấn',
            role: 'Software Engineer',
            rating: 5,
          },
          {
            content: 'Giao diện đẹp, trải nghiệm mượt mà. Tính năng đa phương thức thực sự game-changer.',
            author: 'Thu Hà',
            role: 'UX Designer',
            rating: 5,
          },
        ],
      },
      cta: {
        title: 'Sẵn sàng trải nghiệm?',
        description: 'Tham gia cùng hàng triệu người dùng đang khám phá âm nhạc theo cách mới',
        button: 'Bắt đầu miễn phí',
      },
      footer: {
        description: 'AI cảm xúc thế hệ mới cho trải nghiệm âm nhạc cá nhân hóa.',
        product: 'Sản phẩm',
        company: 'Công ty',
        legal: 'Pháp lý',
        links: {
          features: 'Tính năng',
          pricing: 'Bảng giá',
          api: 'API',
          about: 'Về chúng tôi',
          careers: 'Tuyển dụng',
          blog: 'Blog',
          privacy: 'Quyền riêng tư',
          terms: 'Điều khoản',
        },
        copyright: '© 2026 MoodSync AI. Bảo lưu mọi quyền.',
      },
    },
    en: {
      nav: {
        features: 'Features',
        howItWorks: 'How It Works',
        pricing: 'Pricing',
        testimonials: 'Testimonials',
        login: 'Login',
        getStarted: 'Get Started',
      },
      hero: {
        badge: 'Next-Gen Emotion AI',
        title: 'Music that',
        titleHighlight: 'feels you',
        description: 'AI detects your emotions from face, voice, and text to recommend the perfect music for you. Experience music like never before.',
        cta: 'Try for free',
        secondaryCta: 'Watch demo',
        stats: [
          { value: '10M+', label: 'Songs' },
          { value: '98%', label: 'Accuracy' },
          { value: '2M+', label: 'Users' },
        ],
      },
      features: {
        title: 'Breakthrough AI Technology',
        subtitle: 'Discover how MoodSync AI understands and connects with you',
        items: [
          {
            icon: Scan,
            title: 'Face Recognition',
            description: 'AI analyzes your facial expressions in real-time to understand your emotions',
          },
          {
            icon: Mic,
            title: 'Voice Analysis',
            description: 'Advanced audio processing technology recognizes emotions through your voice',
          },
          {
            icon: FileText,
            title: 'Text Analysis',
            description: 'NLP understands context and emotions from what you write',
          },
          {
            icon: Brain,
            title: 'Multimodal Fusion',
            description: 'Late-fusion algorithm combines all sources for the most accurate results',
          },
          {
            icon: Sparkles,
            title: 'Smart AI Recommendations',
            description: 'Suggest songs and playlists that perfectly match your mood',
          },
          {
            icon: Zap,
            title: 'Instant Response',
            description: 'Process and recommend in seconds, smooth and uninterrupted experience',
          },
        ],
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Just 3 simple steps to get started',
        steps: [
          {
            number: '01',
            title: 'Grant Access',
            description: 'Enable camera or microphone, or type text describing your feelings',
          },
          {
            number: '02',
            title: 'AI Analyzes',
            description: 'MoodSync AI analyzes and identifies your emotions in real-time',
          },
          {
            number: '03',
            title: 'Enjoy Music',
            description: 'Receive playlist and song recommendations perfectly matching your mood',
          },
        ],
      },
      pricing: {
        title: 'Choose Your Plan',
        subtitle: 'Start free, upgrade when needed',
        plans: [
          {
            name: 'Free',
            price: '0',
            period: 'Forever',
            description: 'Basic experience',
            features: [
              'Basic emotion detection',
              '10 songs/day',
              'Text mode',
              'Limited playlists',
            ],
            cta: 'Start Free',
            highlighted: false,
          },
          {
            name: 'Plus',
            price: '$3.99',
            period: '/month',
            description: 'For music lovers',
            features: [
              'Face + text detection',
              'Unlimited songs',
              'Personalized playlists',
              'Ad-free',
              'High quality',
            ],
            cta: 'Upgrade to Plus',
            highlighted: false,
          },
          {
            name: 'VIP Pro',
            price: '$9.99',
            period: '/month',
            description: 'Premium experience',
            features: [
              'Full multimodal',
              'Unlimited AI playlists',
              'Bilingual interface',
              'Cross-device sync',
              'Premium sound themes',
              'Advanced personalization',
              'Priority recommendations',
            ],
            cta: 'Start VIP Pro',
            highlighted: true,
          },
        ],
      },
      testimonials: {
        title: 'Loved by',
        subtitle: 'Millions of users worldwide',
        items: [
          {
            content: 'MoodSync AI understands me better than my Spotify playlist. Every song hits the mood!',
            author: 'Sarah Chen',
            role: 'Content Creator',
            rating: 5,
          },
          {
            content: 'The emotion recognition technology is truly impressive. Helps me focus and work more efficiently.',
            author: 'Mike Johnson',
            role: 'Software Engineer',
            rating: 5,
          },
          {
            content: 'Beautiful interface, smooth experience. The multimodal feature is a real game-changer.',
            author: 'Emma Wilson',
            role: 'UX Designer',
            rating: 5,
          },
        ],
      },
      cta: {
        title: 'Ready to experience?',
        description: 'Join millions of users discovering music in a new way',
        button: 'Start for free',
      },
      footer: {
        description: 'Next-gen emotion AI for personalized music experience.',
        product: 'Product',
        company: 'Company',
        legal: 'Legal',
        links: {
          features: 'Features',
          pricing: 'Pricing',
          api: 'API',
          about: 'About Us',
          careers: 'Careers',
          blog: 'Blog',
          privacy: 'Privacy',
          terms: 'Terms',
        },
        copyright: '© 2026 MoodSync AI. All rights reserved.',
      },
    },
  };

  const c = content[language];

  return (
    <div className="min-h-screen bg-background ambient-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)] flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:block">MoodSync AI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {c.nav.features}
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {c.nav.howItWorks}
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {c.nav.pricing}
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {c.nav.testimonials}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="compact" />
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                {c.nav.login}
              </Button>
              <Link href="/bangDieuKhien">
                <Button size="sm" className="bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white">
                  {c.nav.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--song-primary)]/10 border border-[var(--song-primary)]/30 mb-8">
              <Sparkles className="w-4 h-4 text-[var(--song-primary)]" />
              <span className="text-sm font-medium text-[var(--song-primary)]">{c.hero.badge}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              {c.hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--song-primary)] to-[var(--song-accent)]">
                {c.hero.titleHighlight}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {c.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/bangDieuKhien">
                <Button size="lg" className="bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white px-8 h-12">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  {c.hero.cta}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 border-border/50 hover:bg-secondary/50">
                {c.hero.secondaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {c.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass rounded-3xl p-4 md:p-8 mx-auto max-w-5xl">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[var(--song-primary)]/20 via-[var(--song-secondary)]/10 to-card overflow-hidden relative">
                {/* Mock Player Interface */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[var(--song-primary)] to-[var(--song-secondary)] mx-auto mb-6 flex items-center justify-center shadow-2xl glow-primary">
                      <Radio className="w-16 h-16 md:w-24 md:h-24 text-white" />
                    </div>
                    <p className="text-lg md:text-2xl font-semibold text-foreground">Pink Sunset Rush</p>
                    <p className="text-muted-foreground mt-1">Luna Nova</p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center">
                        <Play className="w-7 h-7 text-background fill-current ml-1" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Mood indicator */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                  {language === 'vi' ? 'Vui vẻ' : 'Happy'} • 92%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {c.features.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {c.features.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.features.items.map((feature, i) => (
              <div 
                key={i}
                className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--song-primary)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[var(--song-primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {c.howItWorks.title}
            </h2>
            <p className="text-muted-foreground">
              {c.howItWorks.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {c.howItWorks.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold text-[var(--song-primary)]/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {c.pricing.title}
            </h2>
            <p className="text-muted-foreground">
              {c.pricing.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {c.pricing.plans.map((plan, i) => (
              <div 
                key={i}
                className={cn(
                  'glass rounded-3xl p-6 transition-all duration-300',
                  plan.highlighted 
                    ? 'ring-2 ring-[var(--song-primary)] scale-105 bg-gradient-to-b from-[var(--song-primary)]/10 to-transparent' 
                    : 'hover:scale-[1.02]'
                )}
              >
                {plan.highlighted && (
                  <div className="text-xs font-medium text-[var(--song-primary)] mb-4 uppercase tracking-wide">
                    {language === 'vi' ? 'Phổ biến nhất' : 'Most Popular'}
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[var(--song-primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={cn(
                    'w-full',
                    plan.highlighted 
                      ? 'bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white'
                      : 'bg-secondary hover:bg-secondary/80'
                  )}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {c.testimonials.title}
            </h2>
            <p className="text-muted-foreground">
              {c.testimonials.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {c.testimonials.items.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">{`"${item.content}"`}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--song-primary)] to-[var(--song-secondary)]" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.author}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-[var(--song-primary)]/20 via-[var(--song-secondary)]/10 to-transparent">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {c.cta.title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {c.cta.description}
            </p>
            <Link href="/bangDieuKhien">
              <Button size="lg" className="bg-[var(--song-primary)] hover:bg-[var(--song-primary)]/90 text-white px-8 h-12">
                {c.cta.button}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--song-primary)] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground">MoodSync AI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {c.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{c.footer.product}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.features}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.pricing}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.api}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{c.footer.company}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.about}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.careers}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.blog}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{c.footer.legal}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.privacy}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{c.footer.links.terms}</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">{c.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
}
