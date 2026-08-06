<script setup lang="ts">
import type { Order, StatutLivraison } from '~/types/auth'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { api } = useAuth()

const orders = ref<(Order & { user: { email: string } })[]>([])
const loading = ref(true)
const filterStatut = ref<StatutLivraison | ''>('')

async function fetchOrders() {
  loading.value = true
  try {
    const query = filterStatut.value ? `?statut=${filterStatut.value}` : ''
    orders.value = await api(`/orders${query}`)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
watch(filterStatut, fetchOrders)

const STATUT_LABELS: Record<StatutLivraison, string> = {
  COMMANDEE: 'Commandée',
  EXPEDIEE: 'Expédiée',
  EN_COURS_DE_LIVRAISON: 'En livraison',
  LIVREE: 'Livrée',
}

const STATUT_COLORS: Record<StatutLivraison, string> = {
  COMMANDEE: 'badge--new',
  EXPEDIEE: 'badge--sent',
  EN_COURS_DE_LIVRAISON: 'badge--transit',
  LIVREE: 'badge--done',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Commandes</h1>
        <p class="page-sub">{{ orders.length }} commande{{ orders.length > 1 ? 's' : '' }}</p>
      </div>

      <select v-model="filterStatut" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="COMMANDEE">Commandée</option>
        <option value="EXPEDIEE">Expédiée</option>
        <option value="EN_COURS_DE_LIVRAISON">En livraison</option>
        <option value="LIVREE">Livrée</option>
      </select>
    </div>

    <div v-if="loading" class="loading-state">
      <div v-for="i in 5" :key="i" class="skeleton-row" />
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <p>Aucune commande pour le moment.</p>
    </div>

    <div v-else class="orders-table">
      <div class="table-head">
        <span>Client</span>
        <span>Adresse</span>
        <span>Date</span>
        <span>Montant</span>
        <span>Statut</span>
        <span />
      </div>

      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/admin/commandes/${order.id}`"
        class="table-row"
      >
        <span class="row-client">
          <span class="row-name">{{ order.prenom }} {{ order.nom }}</span>
          <span class="row-email">{{ order.user?.email }}</span>
        </span>
        <span class="row-adresse">
          <span class="row-adresse-ligne">{{ order.adresseLigne1 }}</span>
          <span class="row-adresse-cp">{{ order.codePostal }} {{ order.ville }}</span>
        </span>
        <span class="row-date">{{ formatDate(order.createdAt) }}</span>
        <span class="row-price">{{ formatPrice(order.montantTotal) }}</span>
        <span>
          <span class="badge" :class="STATUT_COLORS[order.statutLivraison]">
            {{ STATUT_LABELS[order.statutLivraison] }}
          </span>
        </span>
        <span class="row-arrow">→</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

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

.filter-select {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  font-size: 0.85rem;
  background: #fff;
  color: var(--color-text);
  cursor: pointer;
}

/* TABLE */
.orders-table {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 32px;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: #fafafa;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 32px;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: background 0.12s;
  color: var(--color-text);
}

.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #fafafa; }

.row-client { display: flex; flex-direction: column; gap: 0.15rem; }
.row-name { font-size: 0.88rem; font-weight: 500; }
.row-email { font-size: 0.75rem; color: var(--color-muted); }
.row-adresse { display: flex; flex-direction: column; gap: 0.1rem; }
.row-adresse-ligne { font-size: 0.85rem; color: var(--color-text); }
.row-adresse-cp { font-size: 0.75rem; color: var(--color-muted); }
.row-date { font-size: 0.85rem; }
.row-price { font-size: 0.88rem; font-weight: 500; font-family: var(--font-serif); }
.row-arrow { color: var(--color-muted); font-size: 0.85rem; }

/* BADGES */
.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  white-space: nowrap;
}

.badge--new { background: rgba(53,64,40,0.08); color: var(--color-green); }
.badge--sent { background: rgba(59,130,246,0.1); color: #2563eb; }
.badge--transit { background: rgba(234,179,8,0.12); color: #a16207; }
.badge--done { background: rgba(34,197,94,0.1); color: #15803d; }

/* LOADING */
.loading-state { display: flex; flex-direction: column; gap: 0.5rem; }
.skeleton-row {
  height: 60px;
  border-radius: 8px;
  background: var(--color-border);
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 5rem;
  color: var(--color-muted);
  font-size: 0.95rem;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

@media (max-width: 700px) {
  .table-head { display: none; }
  .table-row {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }
  .row-adresse, .row-date, .row-price { display: none; }
  .row-arrow { grid-row: 1 / 3; justify-self: end; align-self: center; }
}
</style>
