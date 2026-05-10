'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UserRound } from 'lucide-react'

import { LogoutButton } from '@/components/auth/nutDangXuat'
import { useAuth } from '@/lib/nguCanhXacThuc'

export function AuthStatus() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-10 w-28 animate-pulse rounded-full bg-white/10" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dangNhap"
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06] hover:text-white"
        >
          Đăng nhập
        </Link>
        <Link
          href="/dangKy"
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-emerald-300"
        >
          Đăng ký
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.name}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <UserRound className="size-4 text-emerald-300" />
        )}
        <div className="max-w-32 truncate text-sm font-semibold text-white">{user.name}</div>
      </div>
      <LogoutButton />
    </div>
  )
}
