import { Suspense } from 'react'

import { AuthForm } from '@/components/auth/formXacThuc'

export default function DangKyPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
