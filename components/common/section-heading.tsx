import { cn } from '@/lib/tienIch'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? <p className="mb-3 text-[0.72rem] uppercase tracking-[0.28em] text-cyan-200/75">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 md:text-base">{description}</p> : null}
    </div>
  )
}
