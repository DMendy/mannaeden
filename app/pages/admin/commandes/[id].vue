<script setup lang="ts">
import type { Order, StatutLivraison } from '~/types/auth'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const { api } = useAuth()

const order = ref<Order | null>(null)
const loading = ref(true)
const updating = ref(false)
const success = ref(false)
const updateError = ref<string | null>(null)

async function fetchOrder() {
  loading.value = true
  try {
    order.value = await api(`/orders/${route.params.id}`)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)

const STATUTS: { value: StatutLivraison; label: string; desc: string }[] = [
  { value: 'COMMANDEE',           label: 'Commandée',     desc: 'Paiement reçu, commande en attente de traitement' },
  { value: 'EXPEDIEE',            label: 'Expédiée',      desc: 'Colis remis au transporteur' },
  { value: 'EN_COURS_DE_LIVRAISON', label: 'En livraison', desc: 'Colis en route vers le client' },
  { value: 'LIVREE',              label: 'Livrée',        desc: 'Commande reçue par le client' },
]

const statutIndex = computed(() => {
  if (!order.value) return 0
  return STATUTS.findIndex(s => s.value === order.value!.statutLivraison)
})

async function setStatut(statut: StatutLivraison) {
  if (!order.value || order.value.statutLivraison === statut) return
  updating.value = true
  updateError.value = null
  try {
    await api(`/orders/${order.value.id}/status`, { method: 'PATCH', body: { statut } })
    order.value = { ...order.value, statutLivraison: statut }
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch (err) {
    updateError.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour.'
  } finally {
    updating.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/commandes" class="back-link">← Retour aux commandes</NuxtLink>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="skeleton-block" style="height: 200px" />
      <div class="skeleton-block" style="height: 300px" />
    </div>

    <div v-else-if="order" class="order-layout">

      <!-- Infos client + commande -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Commande #{{ order.id.slice(0, 8).toUpperCase() }}</h2>
          <span class="order-date">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <span class="info-label">Client</span>
            <span class="info-value">{{ order.civilite === 'MME' ? 'Mme' : 'M.' }} {{ order.prenom }} {{ order.nom }}</span>
          </div>
          <div class="info-block">
            <span class="info-label">Téléphone</span>
            <span class="info-value">{{ order.telephone || '—' }}</span>
          </div>
          <div class="info-block info-block--full">
            <span class="info-label">Adresse de livraison</span>
            <span class="info-value">
              {{ order.adresseLigne1 }}<span v-if="order.adresseLigne2">, {{ order.adresseLigne2 }}</span><br>
              {{ order.codePostal }} {{ order.ville }}<br>
              {{ order.pays }}
            </span>
          </div>
          <div class="info-block">
            <span class="info-label">Produit</span>
            <span class="info-value">{{ order.product?.nom }} × {{ order.quantite }}</span>
          </div>
          <div class="info-block">
            <span class="info-label">Montant</span>
            <span class="info-value info-value--price">{{ formatPrice(order.montantTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Statut livraison -->
      <div class="card">
        <h2 class="card-title" style="margin-bottom: 1.5rem">Statut de livraison</h2>

        <!-- Progress bar -->
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${(statutIndex / (STATUTS.length - 1)) * 100}%` }" />
        </div>

        <!-- Steps -->
        <div class="statut-steps">
          <button
            v-for="(s, i) in STATUTS"
            :key="s.value"
            class="statut-step"
            :class="{
              'statut-step--done': i < statutIndex,
              'statut-step--active': i === statutIndex,
              'statut-step--future': i > statutIndex,
            }"
            :disabled="updating"
            @click="setStatut(s.value)"
          >
            <div class="step-dot">
              <svg v-if="i < statutIndex" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-else class="step-num">{{ i + 1 }}</span>
            </div>
            <span class="step-label">{{ s.label }}</span>
            <span class="step-desc">{{ s.desc }}</span>
          </button>
        </div>

        <p v-if="updateError" class="statut-error">{{ updateError }}</p>

        <p class="statut-hint">
          Cliquez sur un statut pour le mettre à jour. Le client reçoit un email automatiquement.
        </p>
      </div>

    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="success" class="toast">Statut mis à jour — email envoyé au client.</div>
    </Transition>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 1.5rem; }

.back-link {
  font-size: 0.85rem;
  color: var(--color-muted);
  transition: color 0.15s;
}
.back-link:hover { color: var(--color-text); }

/* LAYOUT */
.order-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 720px;
}

/* CARD */
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.75rem;
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-green-deep);
}

.order-date {
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 2rem;
}

.info-block--full { grid-column: 1 / -1; }

.info-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  margin-bottom: 0.3rem;
}

.info-value {
  font-size: 0.92rem;
  color: var(--color-text);
  line-height: 1.6;
}

.info-value--price {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

/* PROGRESS */
.progress-track {
  height: 3px;
  background: var(--color-border);
  border-radius: 100px;
  margin-bottom: 2rem;
  position: relative;
}

.progress-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--color-green);
  border-radius: 100px;
  transition: width 0.4s ease;
}

/* STEPS */
.statut-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.statut-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  text-align: center;
}

.statut-step:hover:not(:disabled) {
  border-color: var(--color-green);
  background: rgba(53,64,40,0.04);
}

.statut-step--active {
  border-color: var(--color-green);
  background: rgba(53,64,40,0.06);
}

.statut-step--done {
  border-color: rgba(53,64,40,0.3);
  background: rgba(53,64,40,0.03);
}

.statut-step:disabled { cursor: not-allowed; opacity: 0.6; }

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-shrink: 0;
}

.statut-step--done .step-dot {
  background: var(--color-green);
  border-color: var(--color-green);
  color: #fff;
}

.statut-step--active .step-dot {
  border-color: var(--color-green);
  color: var(--color-green);
}

.step-dot svg { width: 14px; height: 14px; }

.step-num {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
}

.statut-step--active .step-num { color: var(--color-green); }

.step-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
}

.step-desc {
  font-size: 0.72rem;
  color: var(--color-muted);
  line-height: 1.4;
}

.statut-error {
  margin-top: 1rem;
  font-size: 0.82rem;
  color: var(--color-danger);
  text-align: center;
  font-weight: 500;
}

.statut-hint {
  margin-top: 1rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
  font-style: italic;
}

/* LOADING */
.loading-state { display: flex; flex-direction: column; gap: 1.5rem; max-width: 720px; }
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
  .statut-steps { grid-template-columns: 1fr 1fr; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
