import type { CheckoutPayload } from '~/types/auth'

export function useCheckout() {
  const { api } = useAuth()

  async function createSession(payload: CheckoutPayload) {
    const { url } = await api<{ url: string }>('/stripe/checkout-session', {
      method: 'POST',
      body: payload
    })
    return url as string
  }

  return { createSession }
}
