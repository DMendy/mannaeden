<script setup lang="ts">
import type { Product } from '~/types/auth'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { api } = useAuth()

const products = ref<Product[]>([])
const loading = ref(true)
const saving = ref<string | null>(null)
const success = ref(false)

const stockEdits = ref<Record<string, number>>({})

async function fetchProducts() {
  loading.value = true
  try {
    products.value = await api('/products')
    products.value.forEach(p => {
      stockEdits.value[p.id] = p.stock
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

async function saveStock(productId: string) {
  saving.value = productId
  try {
    await api(`/products/${productId}`, {
      method: 'PATCH',
      body: { stock: stockEdits.value[productId] },
    })
    const product = products.value.find(p => p.id === productId)
    if (product) product.stock = stockEdits.value[productId]
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } finally {
    saving.value = null
  }
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Stock</h1>
        <p class="page-sub">Gérez les quantités disponibles</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="skeleton-block" style="height: 160px" />
    </div>

    <div v-else class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-info">
          <div class="product-img">
            <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.nom" />
            <div v-else class="product-img-placeholder">
              <span>mannaeden</span>
            </div>
          </div>
          <div>
            <h3 class="product-name">{{ product.nom }}</h3>
            <p class="product-price">{{ formatPrice(product.prixUnitaire) }}</p>
          </div>
        </div>

        <div class="stock-control">
          <label class="stock-label">Stock disponible</label>
          <div class="stock-row">
            <button
              class="stock-btn"
              :disabled="stockEdits[product.id] <= 0"
              @click="stockEdits[product.id]--"
            >−</button>
            <input
              v-model.number="stockEdits[product.id]"
              type="number"
              min="0"
              class="stock-input"
            />
            <button class="stock-btn" @click="stockEdits[product.id]++">+</button>
          </div>

          <div class="stock-status" :class="{
            'stock-status--out': product.stock === 0,
            'stock-status--low': product.stock > 0 && product.stock <= 5,
            'stock-status--ok': product.stock > 5,
          }">
            {{ product.stock === 0 ? 'Indisponible — en attente de stock' : product.stock <= 5 ? `${product.stock} restant${product.stock > 1 ? 's' : ''}` : 'En stock' }}
          </div>

          <button
            class="btn btn-primary save-btn"
            :disabled="saving === product.id || stockEdits[product.id] === product.stock"
            @click="saveStock(product.id)"
          >
            {{ saving === product.id ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="success" class="toast">Stock mis à jour.</div>
    </Transition>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 2rem; }

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-green-deep);
}

.page-sub {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-top: 0.2rem;
}

.products-list { display: flex; flex-direction: column; gap: 1.25rem; }

.product-card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.75rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
}

.product-info {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.product-img {
  width: 72px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.1em;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

.product-price {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
}

/* STOCK CONTROL */
.stock-control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  min-width: 180px;
}

.stock-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
}

.stock-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stock-btn {
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: background 0.15s;
}

.stock-btn:hover:not(:disabled) { background: #f5f5f3; }
.stock-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.stock-input {
  width: 64px;
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.45rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

.stock-input:focus { outline: 2px solid var(--color-green); border-color: transparent; }

.stock-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}

.stock-status--ok { background: rgba(53,64,40,0.08); color: var(--color-green); }
.stock-status--low { background: rgba(234,179,8,0.12); color: #a16207; }
.stock-status--out { background: rgba(162,48,48,0.1); color: var(--color-danger); }

.save-btn {
  font-size: 0.85rem;
  padding: 0.55rem 1.25rem;
}

/* LOADING */
.loading-state { display: flex; flex-direction: column; gap: 1rem; }
.skeleton-block {
  border-radius: 12px;
  background: var(--color-border);
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* TOAST */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-green-deep);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 200;
  white-space: nowrap;
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 600px) {
  .product-card { grid-template-columns: 1fr; }
  .stock-control { align-items: flex-start; }
}
</style>
