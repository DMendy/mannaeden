<script setup lang="ts">
import { gsap } from 'gsap'
import type { Order } from '~/types/auth'

definePageMeta({ layout: 'full', middleware: 'auth' })

const { fetchMyOrders } = useOrders()

const order = ref<Order | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const orders = await fetchMyOrders()
    // Most recent order
    order.value = orders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0] ?? null
  } finally {
    loading.value = false
  }

  const tl = gsap.timeline({ delay: 0.2 })
  tl.from('.succes-icon', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
    .from('.succes-title', { opacity: 0, y: 30, duration: 0.7 }, '-=0.2')
    .from('.succes-verse', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.succes-body', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
})

const total = computed(() => {
  if (!order.value) return ''
  return (order.value.montantTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})
</script>

<template>
  <div class="succes-root">

    <div class="succes-bg" aria-hidden="true">
      <svg class="succes-bg__branch" viewBox="0 0 100 520" fill="none">
        <path d="M50 520 L50 0" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
        <ellipse cx="26" cy="90" rx="28" ry="10" transform="rotate(-40 26 90)" fill="currentColor" opacity="0.2"/>
        <ellipse cx="74" cy="160" rx="28" ry="10" transform="rotate(38 74 160)" fill="currentColor" opacity="0.18"/>
        <ellipse cx="26" cy="240" rx="28" ry="10" transform="rotate(-35 26 240)" fill="currentColor" opacity="0.15"/>
        <ellipse cx="74" cy="320" rx="28" ry="10" transform="rotate(36 74 320)" fill="currentColor" opacity="0.13"/>
      </svg>
    </div>

    <section class="succes-section">
      <div class="container--narrow succes-inner">

        <div class="succes-icon">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5"/>
            <path d="M20 32 L28 40 L44 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="succes-title">Votre commande est confirmée.</h1>

        <div class="succes-verse">
          <p class="verse-text">&laquo;&nbsp;Je connais les projets que j'ai formés sur vous — des projets de paix et non de malheur.&nbsp;&raquo;</p>
          <p class="verse-ref">Jérémie 29 : 11</p>
        </div>

        <div class="succes-body">
          <p class="succes-message">Merci pour votre confiance. Votre planner mannaeden sera expédié sous quelques jours. Vous recevrez un e-mail de confirmation avec les détails de livraison.</p>

          <div v-if="loading" class="succes-recap succes-recap--loading">
            <div class="skeleton skeleton--line" style="height: 80px" />
          </div>

          <div v-else-if="order" class="succes-recap">
            <div class="recap-row">
              <span class="recap-label">Commande</span>
              <span class="recap-value recap-id">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
            </div>
            <div class="recap-row">
              <span class="recap-label">Produit</span>
              <span class="recap-value">{{ order.product?.nom ?? 'mannaeden' }}</span>
            </div>
            <div class="recap-row">
              <span class="recap-label">Livraison</span>
              <span class="recap-value">{{ order.adresseLigne1 }}, {{ order.codePostal }} {{ order.ville }}</span>
            </div>
            <div class="recap-row recap-row--total">
              <span class="recap-label">Total payé</span>
              <span class="recap-value recap-total">{{ total }}</span>
            </div>
          </div>

          <div class="succes-actions">
            <NuxtLink v-if="order" :to="`/commande/${order.id}`" class="btn btn-primary">
              Suivre ma commande →
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-outline">Retour à l'accueil</NuxtLink>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.succes-root {
  position: relative;
  background: var(--color-green-deep);
  min-height: 100dvh;
  color: var(--color-accent-contrast);
}

.succes-bg {
  position: fixed;
  right: 8%;
  top: 0;
  bottom: 0;
  width: 120px;
  color: rgba(245, 240, 232, 0.8);
  pointer-events: none;
  z-index: 0;
}

.succes-bg__branch {
  width: 100%;
  height: 100%;
}

.succes-section {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 100dvh;
  padding-block: 8rem 5rem;
}

.succes-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.succes-icon {
  width: 72px;
  height: 72px;
  color: rgba(245, 240, 232, 0.7);
}

.succes-icon svg {
  width: 100%;
  height: 100%;
}

.succes-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 600;
  max-width: 560px;
}

.succes-verse {
  padding: 1.5rem 2rem;
  border: 1px solid rgba(184, 150, 46, 0.3);
  border-radius: 12px;
  background: rgba(184, 150, 46, 0.05);
  max-width: 520px;
  width: 100%;
}

.succes-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.succes-message {
  font-size: 1rem;
  color: rgba(245, 240, 232, 0.65);
  line-height: 1.75;
  max-width: 480px;
}

.succes-recap {
  width: 100%;
  max-width: 480px;
  background: rgba(245, 240, 232, 0.06);
  border: 1px solid rgba(245, 240, 232, 0.12);
  border-radius: 12px;
  overflow: hidden;
}

.succes-recap--loading {
  padding: 1.5rem;
}

.recap-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(245, 240, 232, 0.08);
}

.recap-row:last-child { border-bottom: none; }

.recap-label {
  font-size: 0.82rem;
  color: rgba(245, 240, 232, 0.45);
  letter-spacing: 0.03em;
}

.recap-value {
  font-size: 0.9rem;
  color: rgba(245, 240, 232, 0.85);
  text-align: right;
  max-width: 280px;
}

.recap-id {
  font-family: var(--font-serif);
  letter-spacing: 0.08em;
  color: rgba(245, 240, 232, 0.85);
}

.recap-row--total {
  background: rgba(245, 240, 232, 0.04);
}

.recap-total {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 600;
}

.succes-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.succes-actions .btn-outline {
  border-color: rgba(245, 240, 232, 0.25);
  color: rgba(245, 240, 232, 0.55);
}

.succes-actions .btn-outline:hover {
  background: rgba(245, 240, 232, 0.08);
  border-color: rgba(245, 240, 232, 0.5);
  color: var(--color-accent-contrast);
}

.skeleton {
  background: rgba(245, 240, 232, 0.08);
  border-radius: 6px;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
