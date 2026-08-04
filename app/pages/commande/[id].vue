<script setup lang="ts">
import { gsap } from 'gsap'
import type { Order, StatutLivraison } from '~/types/auth'

definePageMeta({ layout: 'full', middleware: 'auth' })

const route = useRoute()
const { fetchMyOrders } = useOrders()

const order = ref<Order | null>(null)
const loading = ref(true)
const notFound = ref(false)

const STATUTS: { key: StatutLivraison; label: string; desc: string }[] = [
  { key: 'COMMANDEE', label: 'Commande reçue', desc: 'Votre commande a été confirmée et est en cours de préparation.' },
  { key: 'EXPEDIEE', label: 'Expédiée', desc: 'Votre planner a quitté notre entrepôt et est en route vers vous.' },
  { key: 'EN_COURS_DE_LIVRAISON', label: 'En cours de livraison', desc: 'Le transporteur est sur le chemin. La livraison est imminente.' },
  { key: 'LIVREE', label: 'Livrée', desc: 'Votre planner est arrivé. Que ce soit le début d\'un beau chemin.' }
]

onMounted(async () => {
  try {
    const orders = await fetchMyOrders()
    const found = orders.find(o => o.id === route.params.id)
    if (found) {
      order.value = found
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }

  gsap.timeline({ delay: 0.15 })
    .from('.tracking-header', { opacity: 0, y: 30, duration: 0.7 })
    .from('.tracking-timeline', { opacity: 0, y: 25, duration: 0.6 }, '-=0.3')
    .from('.tracking-details', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
})

const currentStatutIndex = computed(() => {
  if (!order.value) return -1
  return STATUTS.findIndex(s => s.key === order.value!.statutLivraison)
})

const total = computed(() => {
  if (!order.value) return ''
  return (order.value.montantTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})

const dateCommande = computed(() => {
  if (!order.value) return ''
  return new Date(order.value.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
})
</script>

<template>
  <div class="tracking-root">

    <!-- HEADER -->
    <section class="tracking-hero section--alt">
      <div class="container">
        <NuxtLink to="/compte" class="back-link">← Mon compte</NuxtLink>
        <h1 class="tracking-hero__title">Suivi de commande</h1>
      </div>
    </section>

    <section class="section--sm">
      <div class="container tracking-layout">

        <div v-if="loading" class="tracking-loading">
          <div class="skeleton skeleton--block" />
          <div class="skeleton skeleton--block" />
        </div>

        <div v-else-if="notFound" class="tracking-notfound">
          <p>Commande introuvable.</p>
          <NuxtLink to="/compte" class="btn btn-outline" style="margin-top: 1.5rem">Retour au compte</NuxtLink>
        </div>

        <template v-else-if="order">

          <!-- TIMELINE -->
          <div class="tracking-timeline tracking-header">
            <div class="timeline-top">
              <div>
                <span class="eyebrow">Commande #{{ order.id.slice(0, 8).toUpperCase() }}</span>
                <h2 class="timeline-title">{{ STATUTS[currentStatutIndex]?.label }}</h2>
                <p class="timeline-desc">{{ STATUTS[currentStatutIndex]?.desc }}</p>
              </div>
              <div class="timeline-date">
                <span class="timeline-date__label">Commandé le</span>
                <span class="timeline-date__value">{{ dateCommande }}</span>
              </div>
            </div>

            <div class="timeline-steps">
              <div
                v-for="(statut, i) in STATUTS"
                :key="statut.key"
                class="timeline-step"
                :class="{
                  'timeline-step--done': i < currentStatutIndex,
                  'timeline-step--active': i === currentStatutIndex,
                  'timeline-step--pending': i > currentStatutIndex
                }"
              >
                <div class="timeline-step__track">
                  <div class="timeline-step__dot">
                    <svg v-if="i < currentStatutIndex" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10 L8.5 13.5 L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div v-else-if="i === currentStatutIndex" class="timeline-step__pulse" />
                  </div>
                  <div v-if="i < STATUTS.length - 1" class="timeline-step__line" :class="{ 'timeline-step__line--done': i < currentStatutIndex }" />
                </div>
                <div class="timeline-step__content">
                  <span class="timeline-step__label">{{ statut.label }}</span>
                </div>
              </div>
            </div>

            <div class="timeline-verse">
              <p class="verse-text" style="font-size: 1rem">« L'Éternel lui-même marchera devant toi. »</p>
              <p class="verse-ref">Deutéronome 31 : 8</p>
            </div>
          </div>

          <!-- DETAILS -->
          <div class="tracking-details">
            <div class="detail-card">
              <h3 class="detail-card__title">Votre commande</h3>
              <div class="detail-product">
                <div class="detail-product__img">
                  <div v-if="order.product?.imageUrl">
                    <img :src="order.product.imageUrl" :alt="order.product.nom">
                  </div>
                  <div v-else class="detail-product__placeholder">
                    <span>me</span>
                  </div>
                </div>
                <div class="detail-product__info">
                  <p class="detail-product__name">{{ order.product?.nom ?? 'mannaeden' }}</p>
                  <p class="detail-product__qty">Quantité : {{ order.quantite }}</p>
                  <p class="detail-product__price">{{ total }}</p>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <h3 class="detail-card__title">Adresse de livraison</h3>
              <address class="detail-address">
                <span>{{ order.civilite === 'MME' ? 'Mme' : 'M.' }} {{ order.prenom }} {{ order.nom }}</span>
                <span>{{ order.adresseLigne1 }}</span>
                <span v-if="order.adresseLigne2">{{ order.adresseLigne2 }}</span>
                <span>{{ order.codePostal }} {{ order.ville }}</span>
                <span>{{ order.pays }}</span>
              </address>
            </div>
          </div>

        </template>

      </div>
    </section>

  </div>
</template>

<style scoped>
.tracking-root { background: var(--color-bg); }

.tracking-hero {
  padding-top: 9rem;
  padding-bottom: 2.5rem;
}

.back-link {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 1.25rem;
  transition: color 0.2s;
}

.back-link:hover { color: var(--color-text); }

.tracking-hero__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
}

.tracking-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2.5rem;
  align-items: start;
  padding-block: 3rem;
}

.tracking-loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skeleton {
  background: var(--color-bg-alt);
  border-radius: 12px;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton--block { height: 200px; }

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.tracking-notfound {
  grid-column: 1 / -1;
  text-align: center;
  padding-block: 5rem;
  color: var(--color-muted);
}

/* TIMELINE */
.tracking-timeline {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.timeline-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.timeline-title {
  font-size: 1.6rem;
  margin-top: 0.5rem;
}

.timeline-desc {
  font-size: 0.92rem;
  color: var(--color-muted);
  margin-top: 0.5rem;
  max-width: 400px;
  line-height: 1.65;
}

.timeline-date {
  text-align: right;
  flex-shrink: 0;
}

.timeline-date__label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-muted);
  letter-spacing: 0.04em;
}

.timeline-date__value {
  display: block;
  font-weight: 500;
  margin-top: 0.2rem;
}

/* STEPS */
.timeline-steps {
  display: flex;
  gap: 0;
}

.timeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.timeline-step__track {
  display: flex;
  align-items: center;
  width: 100%;
}

.timeline-step__dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
  color: var(--color-green);
}

.timeline-step--done .timeline-step__dot {
  background: var(--color-green);
  border-color: var(--color-green);
  color: var(--color-accent-contrast);
}

.timeline-step--active .timeline-step__dot {
  border-color: var(--color-green);
  box-shadow: 0 0 0 4px rgba(61, 92, 61, 0.12);
}

.timeline-step--done .timeline-step__dot svg,
.timeline-step--active .timeline-step__dot svg {
  width: 14px;
  height: 14px;
}

.timeline-step__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-green);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.timeline-step__line {
  flex: 1;
  height: 2px;
  background: var(--color-border);
  transition: background 0.3s;
}

.timeline-step__line--done { background: var(--color-green); }

.timeline-step__content {
  text-align: center;
}

.timeline-step__label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-muted);
}

.timeline-step--active .timeline-step__label,
.timeline-step--done .timeline-step__label {
  color: var(--color-text);
}

.timeline-verse {
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

/* DETAIL CARDS */
.tracking-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-card {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.75rem;
}

.detail-card__title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.detail-product {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.detail-product__img {
  width: 56px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.detail-product__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-product__placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 0.7rem;
  color: rgba(245, 240, 232, 0.6);
  letter-spacing: 0.05em;
}

.detail-product__name {
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-product__qty {
  font-size: 0.82rem;
  color: var(--color-muted);
  margin-top: 0.2rem;
}

.detail-product__price {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.3rem;
}

.detail-address {
  font-style: normal;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.6;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .tracking-layout { grid-template-columns: 1fr; }

  .timeline-steps {
    flex-direction: column;
    gap: 0;
  }

  .timeline-step { flex-direction: row; align-items: flex-start; gap: 1rem; }

  .timeline-step__track {
    flex-direction: column;
    width: auto;
    align-items: center;
  }

  .timeline-step__line {
    width: 2px;
    height: 30px;
    flex: none;
  }

  .timeline-step__content { padding-top: 0.25rem; }

  .timeline-top { flex-direction: column; gap: 1rem; }
  .timeline-date { text-align: left; }
}
</style>
