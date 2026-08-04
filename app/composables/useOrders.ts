import type { Order } from '~/types/auth'

export function useOrders() {
  const { api } = useAuth()
  const orders = useState<Order[]>('orders', () => [])

  async function fetchMyOrders() {
    orders.value = await api<Order[]>('/orders/me')
    return orders.value
  }

  return { orders, fetchMyOrders }
}
