import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/tienIch'

interface LogoProps {
  href?: string
  className?: string
  compact?: boolean
}

export function Logo({ href = '/', className, compact = false }: LogoProps) {
  return (
    <Link href={href} className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#090b10] shadow-[0_0_30px_rgba(70,213,255,0.12)] backdrop-blur p-1">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <Image
            src="/img/logo/logo.jpg"
            alt="KhoaLisa Logo"
            fill
            className="object-contain"
            sizes="44px"
            priority
          />
        </div>
      </div>
      {!compact && (
        <div className="flex flex-col justify-center">
          <p className="text-[0.7rem] uppercase leading-none tracking-[0.28em] text-white/45 mb-1.5">immersive music</p>
          <p className="text-lg font-semibold leading-none text-white">KhoaLisa</p>
        </div>
      )}
    </Link>
  )
}
