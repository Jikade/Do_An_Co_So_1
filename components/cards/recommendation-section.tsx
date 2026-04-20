import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { MediaCard } from '@/components/cards/media-card'
import { SectionHeading } from '@/components/common/section-heading'
import type { Song } from '@/lib/duLieuGiaLap'

interface RecommendationSectionProps {
  eyebrow?: string
  title: string
  description?: string
  songs: Song[]
  href?: string
}

export function RecommendationSection({ eyebrow, title, description, songs, href }: RecommendationSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {href ? (
          <Link href={href} className="inline-flex items-center gap-2 text-sm text-cyan-200/85 transition hover:text-cyan-100">
            Xem them
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {songs.map((song) => (
          <MediaCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  )
}
