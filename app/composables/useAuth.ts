import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, UpdateProfilePayload } from '~/types/auth'

interface ApiErrorBody {
  message?: string | string[]
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  })
  const config = useRuntimeConfig()

  function api<T>(path: string, opts: Parameters<typeof $fetch>[1] = {}) {
    return $fetch<T>(path, {
      baseURL: config.public.apiBase as string,
      ...opts,
      headers: {
        ...(opts.headers as Record<string, string> | undefined),
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      }
    }).catch((error) => {
      const body = error?.data as ApiErrorBody | undefined
      const message = Array.isArray(body?.message) ? body.message[0] : body?.message
      throw new Error(message || 'Une erreur est survenue.')
    })
  }

  async function login(payload: LoginPayload) {
    const res = await api<AuthResponse>('/auth/login', { method: 'POST', body: payload })
    token.value = res.accessToken
    user.value = res.user
  }

  async function register(payload: RegisterPayload) {
    const res = await api<AuthResponse>('/auth/register', { method: 'POST', body: payload })
    token.value = res.accessToken
    user.value = res.user
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null
      return
    }
    try {
      user.value = await api<AuthUser>('/auth/me')
    } catch {
      token.value = null
      user.value = null
    }
  }

  async function updateMe(payload: UpdateProfilePayload) {
    const updated = await api<AuthUser>('/auth/me', { method: 'PATCH', body: payload })
    user.value = updated
    return updated
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { user, token, api, login, register, fetchMe, updateMe, logout }
}
