'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/lib/nguCanhXacThuc'

export default function DangXuatPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    logout().finally(() => router.replace('/dangNhap'))
  }, [logout, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070711] text-white">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-2xl">
        <Loader2 className="mx-auto mb-4 size-8 animate-spin text-emerald-300" />
        <h1 className="text-2xl font-bold">Đang đăng xuất...</h1>
      </div>
    </main>
  )
}
