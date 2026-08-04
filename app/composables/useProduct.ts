import type { Product } from '~/types/auth'

export function useProduct() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string

  function fetchAll() {
    return $fetch<Product[]>('/products', { baseURL: base })
  }

  function fetchOne(id: string) {
    return $fetch<Product>(`/products/${id}`, { baseURL: base })
  }

  return { fetchAll, fetchOne }
}
