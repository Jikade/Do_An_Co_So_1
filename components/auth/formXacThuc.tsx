'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Music2, ShieldCheck, Sparkles, UserRound } from 'lucide-react'

import { useAuth } from '@/lib/nguCanhXacThuc'
import { cn } from '@/lib/tienIch'

type AuthMode = 'login' | 'register'

type AuthFormProps = {
  mode: AuthMode
}

function safeRedirect(value: string | null) {
  if (!value) return '/bangDieuKhien'
  if (!value.startsWith('/') || value.startsWith('//')) return '/bangDieuKhien'
  if (value.startsWith('/dangNhap') || value.startsWith('/dangKy')) return '/bangDieuKhien'
  return value
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, loginGoogle } = useAuth()

  const isRegister = mode === 'register'
  const redirectTo = useMemo(() => safeRedirect(searchParams.get('next')), [searchParams])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await register({ name, email, password })
      } else {
        await login({ email, password })
      }
      router.replace(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleCredential(credential?: string) {
    if (!credential) {
      setError('Google không trả về credential. Vui lòng thử lại.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await loginGoogle(credential)
      router.replace(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070711] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(52,211,153,0.22),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(168,85,247,0.22),transparent_30%),linear-gradient(135deg,#070711_0%,#0b1020_52%,#050508_100%)]" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex">
          <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur">
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-400 text-black">
              <Music2 className="size-4" />
            </span>
            MoodSync AI
          </Link>

          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              <Sparkles className="size-4" />
              Premium mood music
            </div>
            <h1 className="text-5xl font-black leading-[0.96] tracking-tight xl:text-7xl">
              Mở khóa không gian nghe dành riêng cho cảm xúc của bạn.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
              Đăng nhập để lưu thư viện, lịch sử nghe, trạng thái cảm xúc và đề xuất nhạc cá nhân hóa trên PostgreSQL.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3 text-sm text-white/65">
            {['JWT bảo mật', 'Google OAuth', 'PostgreSQL users'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <ShieldCheck className="mb-3 size-5 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-emerald-500/20">
                <LockKeyhole className="size-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200/80">
                {isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {isRegister ? 'Đăng ký MoodSync' : 'Đăng nhập MoodSync'}
              </h2>
              <p className="mt-2 text-sm text-white/55">
                {isRegister
                  ? 'Tạo hồ sơ để đồng bộ thư viện và đề xuất cảm xúc.'
                  : 'Tiếp tục vào không gian nghe của bạn.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/70">Tên hiển thị</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 focus-within:border-emerald-300/50">
                    <UserRound className="size-5 text-white/35" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      minLength={2}
                      placeholder="Ví dụ: Khoa Lisa"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/70">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 focus-within:border-emerald-300/50">
                  <Mail className="size-5 text-white/35" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/70">Mật khẩu</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 focus-within:border-emerald-300/50">
                  <LockKeyhole className="size-5 text-white/35" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={isRegister ? 8 : 1}
                    maxLength={72}
                    placeholder={isRegister ? 'Tối thiểu 8 ký tự' : 'Nhập mật khẩu'}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-white/40 transition hover:text-white"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3.5 text-sm font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/35">
              <div className="h-px flex-1 bg-white/10" />
              hoặc
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-white px-3 py-2">
              {googleClientId ? (
                <GoogleLogin
                  onSuccess={(credentialResponse) => handleGoogleCredential(credentialResponse.credential)}
                  onError={() => setError('Không thể mở đăng nhập Google. Vui lòng thử lại.')}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text={isRegister ? 'signup_with' : 'signin_with'}
                  shape="pill"
                  width="360"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-full px-4 py-2 text-sm font-semibold text-black/55"
                >
                  Cần cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID
                </button>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-white/55">
              {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
              <Link
                href={isRegister ? `/dangNhap?next=${encodeURIComponent(redirectTo)}` : `/dangKy?next=${encodeURIComponent(redirectTo)}`}
                className="font-bold text-emerald-200 transition hover:text-emerald-100"
              >
                {isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
