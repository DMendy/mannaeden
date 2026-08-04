<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '~/types/auth'

definePageMeta({ layout: 'full' })

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context
const { user } = useAuth()
const { fetchAll } = useProduct()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const products = await fetchAll()
    product.value = products[0] ?? null
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }

  ctx = gsap.context(() => {
    gsap.timeline({ delay: 0.1 })
      .from('.shop-hero__eyebrow', { opacity: 0, y: 10, duration: 0.5 })
      .from('.shop-hero__title', { opacity: 0, y: 45, duration: 1, ease: 'power4.out' }, '-=0.2')

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 35, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      })
    })
  }, root.value!)
})

onUnmounted(() => ctx?.revert())

const prix = computed(() => {
  if (!product.value) return ''
  return (product.value.prixUnitaire / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})

const stockLabel = computed(() => {
  if (!product.value) return ''
  if (product.value.stock === 0) return 'Rupture de stock'
  if (product.value.stock <= 5) return `Plus que ${product.value.stock} exemplaire${product.value.stock > 1 ? 's' : ''}`
  return 'En stock'
})

const stockClass = computed(() => {
  if (!product.value || product.value.stock === 0) return 'stock--out'
  if (product.value.stock <= 5) return 'stock--low'
  return 'stock--ok'
})

function handleOrder() {
  if (!user.value) {
    navigateTo('/connexion?redirect=/panier')
    return
  }
  navigateTo('/panier')
}
</script>

<template>
  <div ref="root">

    <!-- ══ HERO ══ -->
    <section class="shop-hero section--alt">
      <div class="container">
        <span class="shop-hero__eyebrow eyebrow">La boutique</span>
        <h1 class="shop-hero__title">mannaeden,<br><em>le planner.</em></h1>
      </div>
    </section>

    <!-- ══ PRODUCT ══ -->
    <section class="section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="skeleton skeleton--img" />
          <div class="skeleton-text">
            <div class="skeleton skeleton--line" />
            <div class="skeleton skeleton--line skeleton--short" />
            <div class="skeleton skeleton--line" />
          </div>
        </div>

        <div v-else-if="error" class="error-state" data-reveal>
          <p>Impossible de charger le produit. Veuillez réessayer.</p>
          <button class="btn btn-outline" style="margin-top: 1rem" @click="$router.go(0)">Réessayer</button>
        </div>

        <div v-else-if="product" class="product-layout" data-reveal>
          <!-- Image -->
          <div class="product-img">
            <div v-if="product.imageUrl" class="product-img__real">
              <img :src="product.imageUrl" :alt="product.nom">
            </div>
            <div v-else class="product-img__placeholder">
              <svg class="product-deco" viewBox="0 0 160 260" fill="none" aria-hidden="true">
                <path d="M80 260 L80 0" stroke="currentColor" stroke-width="0.6" opacity="0.35"/>
                <ellipse cx="43" cy="55" rx="40" ry="14" transform="rotate(-38 43 55)" fill="currentColor" opacity="0.15"/>
                <ellipse cx="117" cy="110" rx="40" ry="14" transform="rotate(36 117 110)" fill="currentColor" opacity="0.13"/>
                <ellipse cx="43" cy="170" rx="40" ry="14" transform="rotate(-35 43 170)" fill="currentColor" opacity="0.11"/>
                <ellipse cx="117" cy="225" rx="40" ry="14" transform="rotate(38 117 225)" fill="currentColor" opacity="0.09"/>
              </svg>
              <div class="product-img__label">
                <span class="product-img__name">mannaeden</span>
                <span class="product-img__sub">le planner</span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <span class="eyebrow">Planner physique · Format A5</span>
            <h2 class="product-title">{{ product.nom }}</h2>
            <div class="divider" />

            <p class="product-desc">
              {{ product.description ?? 'Un planner annuel pensé pour accompagner votre vie spirituelle — versets bibliques, plans journaliers, mensuels et annuels, trackers de prière et espaces d\'écriture libres.' }}
            </p>

            <!-- What's inside -->
            <ul class="product-includes">
              <li>✦ Verset guidant chaque semaine de l'année</li>
              <li>✦ Plans journaliers structurés</li>
              <li>✦ Trackers mensuels et annuels</li>
              <li>✦ Espaces de prière et de réflexion</li>
              <li>✦ Pages d'écriture libre</li>
              <li>✦ Bilan de fin d'année</li>
            </ul>

            <div class="product-bottom">
              <div class="product-price-row">
                <span class="product-price">{{ prix }}</span>
                <span class="product-stock" :class="stockClass">{{ stockLabel }}</span>
              </div>

              <button
                class="btn btn-primary product-cta"
                :disabled="!product || product.stock === 0"
                @click="handleOrder"
              >
                {{ product.stock === 0 ? 'Rupture de stock' : user ? 'Commander' : 'Commander — créer un compte' }}
              </button>

              <p v-if="!user" class="product-auth-hint">
                Un compte est nécessaire pour commander.
                <NuxtLink to="/inscription">Créer un compte gratuitement →</NuxtLink>
              </p>
            </div>
          </div>
        </div>

        <div v-else class="error-state" data-reveal>
          <p>Aucun produit disponible pour le moment.</p>
        </div>
      </div>
    </section>

    <!-- ══ VERSE ══ -->
    <section class="section section--alt" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <p class="verse-text">« Cherchez premièrement le royaume et la justice de Dieu, et toutes ces choses vous seront données par-dessus. »</p>
        <p class="verse-ref">Matthieu 6 : 33</p>
      </div>
    </section>

    <!-- ══ GARANTIES ══ -->
    <section class="section">
      <div class="container">
        <div class="garanties" data-stagger>
          <div class="garantie">
            <div class="garantie__icon">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M4 8l12 8 12-8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" stroke-width="1.4"/>
              </svg>
            </div>
            <h4>Livraison soignée</h4>
            <p>Chaque planner est emballé avec soin pour arriver entre vos mains en parfait état.</p>
          </div>
          <div class="garantie">
            <div class="garantie__icon">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 4 L20 12 L28 13 L22 19 L24 28 L16 24 L8 28 L10 19 L4 13 L12 12 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4>Qualité premium</h4>
            <p>Papier épais, reliure solide, couverture soignée — fait pour durer toute une année.</p>
          </div>
          <div class="garantie">
            <div class="garantie__icon">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 4 C10 4 6 8 6 14 C6 20 10 24 16 28 C22 24 26 20 26 14 C26 8 22 4 16 4Z" stroke="currentColor" stroke-width="1.4"/>
                <path d="M12 15 L15 18 L20 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4>Pensé avec intention</h4>
            <p>Créé par Camille, chaque page est le fruit de mois de réflexion spirituelle et pratique.</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.shop-hero {
  padding-top: 10rem;
  padding-bottom: 4rem;
}

.shop-hero__eyebrow { color: var(--color-gold); }

.shop-hero__title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 600;
  margin-top: 0.75rem;
  line-height: 1.07;
}

.shop-hero__title em {
  font-style: italic;
  color: var(--color-muted);
}

/* LOADING */
.loading-state {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 5rem;
}

.skeleton {
  background: var(--color-bg-alt);
  border-radius: 8px;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton--img {
  aspect-ratio: 3 / 4;
}

.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
}

.skeleton--line {
  height: 16px;
  border-radius: 4px;
}

.skeleton--short { width: 50%; }

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* PRODUCT */
.product-layout {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 5rem;
  align-items: start;
}

.product-img {
  position: sticky;
  top: 100px;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
}

.product-img__real img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-img__placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-green);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
}

.product-deco {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: rgba(245, 240, 232, 0.9);
}

.product-img__label {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.product-img__name {
  font-family: var(--font-serif);
  font-size: 1.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(245, 240, 232, 0.82);
}

.product-img__sub {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.38);
}

.product-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-top: 0.75rem;
}

.product-desc {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.75;
}

.product-includes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.75rem;
}

.product-includes li {
  font-size: 0.9rem;
  color: var(--color-text);
  display: flex;
  gap: 0.6rem;
}

.product-bottom {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.product-price-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.product-price {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.product-stock {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
}

.stock--ok { background: rgba(61, 92, 61, 0.1); color: var(--color-green); }
.stock--low { background: rgba(184, 150, 46, 0.12); color: var(--color-gold); }
.stock--out { background: rgba(162, 48, 48, 0.1); color: var(--color-danger); }

.product-cta {
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
}

.product-auth-hint {
  margin-top: 1rem;
  font-size: 0.82rem;
  color: var(--color-muted);
  text-align: center;
}

.product-auth-hint a {
  color: var(--color-green);
}

.error-state {
  text-align: center;
  padding-block: 5rem;
  color: var(--color-muted);
}

/* GARANTIES */
.garanties {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 4rem;
}

.garantie { text-align: center; }

.garantie__icon {
  width: 36px;
  height: 36px;
  color: var(--color-green);
  margin: 0 auto 1.25rem;
}

.garantie__icon svg { width: 100%; height: 100%; }

.garantie h4 {
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
}

.garantie p {
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .loading-state,
  .product-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .product-img {
    position: static;
    aspect-ratio: 4 / 3;
    max-width: 360px;
    margin-inline: auto;
  }

  .garanties { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
}
</style>
