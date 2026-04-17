'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/tienIch'
import { studioNavItems } from '@/lib/khoaLisa-data'

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-24 left-4 right-4 z-40 rounded-[28px] border border-white/8 bg-[#0b0f15]/90 p-2 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:hidden">
      <ul className="grid grid-cols-6 gap-1">
        {studioNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition',
                  isActive ? 'bg-white/[0.08] text-white' : 'text-white/45'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
