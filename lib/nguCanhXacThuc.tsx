'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import {
  fetchCurrentUser,
  loginWithEmail,
  loginWithGoogleCredential,
  logoutOnServer,
  registerWithEmail,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  type AuthResponse,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '@/lib/api/auth'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<AuthResponse>
  register: (payload: RegisterPayload) => Promise<AuthResponse>
  loginGoogle: (credential: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function saveAuth(response: AuthResponse) {
  localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

function readSavedUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applyAuth = useCallback((response: AuthResponse) => {
    saveAuth(response)
    setToken(response.access_token)
    setUser(response.user)
    return response
  }, [])

  const clearAuth = useCallback(() => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrapAuth() {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
      const savedUser = readSavedUser()

      if (!savedToken) {
        if (!cancelled) setIsLoading(false)
        return
      }

      if (!cancelled) {
        setToken(savedToken)
        setUser(savedUser)
      }

      try {
        const freshUser = await fetchCurrentUser(savedToken)
        if (!cancelled) {
          setUser(freshUser)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser))
        }
      } catch {
        if (!cancelled) clearAuth()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrapAuth()
    return () => {
      cancelled = true
    }
  }, [clearAuth])

  const login = useCallback(
    async (payload: LoginPayload) => applyAuth(await loginWithEmail(payload)),
    [applyAuth],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => applyAuth(await registerWithEmail(payload)),
    [applyAuth],
  )

  const loginGoogle = useCallback(
    async (credential: string) => applyAuth(await loginWithGoogleCredential(credential)),
    [applyAuth],
  )

  const refreshUser = useCallback(async () => {
    const activeToken = token ?? localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!activeToken) return

    const freshUser = await fetchCurrentUser(activeToken)
    setUser(freshUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser))
  }, [token])

  const logout = useCallback(async () => {
    const activeToken = token ?? localStorage.getItem(TOKEN_STORAGE_KEY)
    if (activeToken) {
      try {
        await logoutOnServer(activeToken)
      } catch {
        // Token có thể đã hết hạn; vẫn xóa ở client để đăng xuất dứt điểm.
      }
    }
    clearAuth()
  }, [clearAuth, token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      loginGoogle,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, register, loginGoogle, logout, refreshUser],
  )

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
