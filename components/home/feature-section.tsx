import { SectionHeading } from '@/components/common/section-heading'
import { landingFeatures } from '@/lib/khoaLisa-data'

export function FeatureSection() {
  return (
    <section id="features" className="px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Core value"
          title="Chi ba diem, nhung moi diem deu xung dang xuat hien."
          description="Landing page chi giu lai nhung thong diep can thiet nhat de tone san pham sang, tre va de nho."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {landingFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="rounded-[30px] border border-white/8 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
