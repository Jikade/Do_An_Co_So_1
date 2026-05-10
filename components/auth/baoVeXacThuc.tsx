'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'

import { useAuth } from '@/lib/nguCanhXacThuc'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = encodeURIComponent(pathname || '/bangDieuKhien')
      router.replace(`/dangNhap?next=${next}`)
    }
  }, [isLoading, isAuthenticated, pathname, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070711] px-6 text-white">
        <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            {isLoading ? <Loader2 className="size-6 animate-spin" /> : <ShieldCheck className="size-6" />}
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/45">
            MoodSync AI
          </p>
          <h1 className="mt-2 text-2xl font-bold">Đang kiểm tra phiên đăng nhập</h1>
          <p className="mt-2 text-sm text-white/55">Vui lòng đăng nhập để tiếp tục vào không gian nghe.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
