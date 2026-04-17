import { MoodCard } from '@/components/cards/mood-card'
import { SectionHeading } from '@/components/common/section-heading'
import { landingMoods } from '@/lib/khoaLisa-data'

export function MoodCardsSection() {
  return (
    <section id="moods" className="px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Mood cards"
          title="Vua du de goi tri tuong tuong."
          description="Khong day het playlist len landing. Chi can vai mood card de nguoi dung cam thay app nay co gu va co chon loc."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {landingMoods.map((item) => (
            <MoodCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
