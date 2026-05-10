import { Suspense } from 'react'

import { AuthForm } from '@/components/auth/formXacThuc'

export default function DangNhapPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
