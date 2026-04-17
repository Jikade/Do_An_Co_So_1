'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crown, Plus } from 'lucide-react'
import { cn } from '@/lib/tienIch'
import { studioNavItems } from '@/lib/khoaLisa-data'
import { Logo } from '@/components/common/logo'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[280px] flex-col border-r border-white/8 bg-[#090b10]/90 px-5 py-6 backdrop-blur-xl lg:flex">
      <Logo href="/app" />

      <nav className="mt-10 space-y-2">
        {studioNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                isActive
                  ? 'bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(31,36,48,0.95),rgba(11,14,20,0.95))] p-5">
        <div className="flex items-center gap-2 text-cyan-200">
          <Crown className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.22em]">Premium session</span>
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">Khong gian nghe nhac gon, sang va tap trung.</h3>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Sidebar chi giu cac diem vao can thiet, de man hinh chinh co nhieu khoang tho hon.
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]">
          <Plus className="h-4 w-4" />
          New playlist
        </button>
      </div>
    </aside>
  )
}
