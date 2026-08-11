<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '~/types/auth'

definePageMeta({ layout: 'full' })

useSeoMeta({
  title: 'Commander le planner Graines de Foi — mannaeden',
  description: 'Commandez le planner chrétien mannaeden : un outil de planification spirituelle et quotidienne pour toute une année, ancré dans la foi.',
  ogTitle: 'Commander le planner Graines de Foi — mannaeden',
  ogDescription: 'Commandez le planner chrétien mannaeden : un outil de planification spirituelle et quotidienne pour toute une année, ancré dans la foi.',
  ogUrl: 'https://mannaeden.com/boutique',
})

const LAUNCH_DATE = new Date('2026-08-17T00:00:00')

function getTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

const timeLeft = ref(getTimeLeft())
let ticker: ReturnType<typeof setInterval>

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context
const { user } = useAuth()
const { fetchAll } = useProduct()

const product = ref<Product | null>(null)
const loading = ref(true)

const GALLERY_IMAGES = [
  { src: '/7FCFADDB-776F-42F0-A48A-CEDCA69D4E22.PNG', alt: 'Graines de Foi — couverture' },
  { src: '/AE054CF9-9FB6-4FE6-97AB-2DC88E876BAA.PNG', alt: 'Pages intérieures — méditation quotidienne' },
]
const activeImage = ref(GALLERY_IMAGES[0])

const contents = [
  'Un espace de méditation pour chaque jour de l\'année',
  'Bilans hebdomadaires',
  'Journal de rêves, de prières et de gratitude',
  'Des témoignages & des défis spirituels',
  'Une section pour écrire vos notes',
  'Un espace pour dessiner',
]

onMounted(async () => {
  ticker = setInterval(() => { timeLeft.value = getTimeLeft() }, 1000)
  gsap.registerPlugin(ScrollTrigger)

  try {
    const products = await fetchAll()
    product.value = products[0] ?? null
  } catch {
    // silently fail, show fallback
  } finally {
    loading.value = false
  }

  await nextTick()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    if (!prefersReducedMotion) {
    gsap.timeline({ delay: 0.1 })
      .from('.gallery', { opacity: 0, x: -30, duration: 0.9, ease: 'power3.out' })
      .from('.product-info > *', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5')

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 35, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach(container => {
      gsap.from(Array.from(container.children) as HTMLElement[], {
        opacity: 0, y: 25, duration: 0.65, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 85%' }
      })
    })
    } // end prefersReducedMotion check
  }, root.value!)
})

onUnmounted(() => { ctx?.revert(); clearInterval(ticker) })

const isPrecommande = computed(() => {
  if (!product.value?.precommandeActive) return false
  const fin = product.value.precommandeFin
  if (!fin) return true
  return new Date(fin) > new Date()
})

const prixOriginal = computed(() => {
  if (!product.value) return null
  return (product.value.prixUnitaire / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})

const prix = computed(() => {
  if (!product.value) return '33,92 €'
  const p = isPrecommande.value
    ? Math.round(product.value.prixUnitaire * 0.85)
    : product.value.prixUnitaire
  return (p / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})

const stockLabel = computed(() => 'Précommande — lancement le 17 août')
const stockClass = computed(() => 'stock--pre')

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

    <!-- ══ PRODUCT HERO ══ -->
    <section class="shop-hero">
      <div class="container shop-layout">

        <!-- Gallery -->
        <div class="gallery">
          <div class="gallery__main">
            <Transition name="fade-img" mode="out-in">
              <img :key="activeImage.src" :src="activeImage.src" :alt="activeImage.alt" />
            </Transition>
          </div>
          <div class="gallery__thumbs">
            <button
              v-for="img in GALLERY_IMAGES"
              :key="img.src"
              class="gallery__thumb"
              :class="{ 'gallery__thumb--active': img.src === activeImage.src }"
              :aria-label="img.alt"
              @click="activeImage = img"
            >
              <img :src="img.src" :alt="img.alt" />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="product-info">
          <span class="shop-eyebrow eyebrow">Planner physique · Format A5</span>
          <h1 class="shop-title">{{ product?.nom ?? 'Graines de Foi' }}</h1>
          <div class="divider" />

          <p class="product-desc">
            Graines de Foi est un planner chrétien conçu pour vous accompagner tout au long de l'année. À travers 12 thèmes inspirés de la Parole de Dieu, il vous aide à structurer votre quotidien, à cultiver votre vie intérieure et à grandir dans votre foi.
          </p>

          <ul class="product-teaser">
            <li>Un espace de méditation pour chaque jour de l'année</li>
            <li>Bilans hebdomadaires</li>
            <li>Journal de rêves, de prières et de gratitude</li>
            <li>Des témoignages &amp; des défis spirituels</li>
            <li>Une section pour écrire vos notes</li>
            <li>Un espace pour dessiner</li>
          </ul>

          <div v-if="loading" class="product-bottom">
            <div class="skeleton skeleton--price" />
            <div class="skeleton skeleton--btn" />
          </div>

          <div v-else class="product-bottom">
            <div class="product-price-row">
              <div class="price-group">
                <span v-if="isPrecommande" class="price-badge">−15&nbsp;%</span>
                <span class="product-price">{{ prix }}</span>
                <span v-if="isPrecommande && prixOriginal" class="product-price-original">{{ prixOriginal }}</span>
              </div>
              <span class="product-stock" :class="stockClass">{{ stockLabel }}</span>
            </div>

            <!-- Countdown -->
            <div class="countdown">
              <p class="countdown__label">Lancement officiel dans</p>
              <div class="countdown__blocks">
                <div class="countdown__block">
                  <span class="countdown__num">{{ String(timeLeft.days).padStart(2, '0') }}</span>
                  <span class="countdown__unit">jours</span>
                </div>
                <span class="countdown__sep">:</span>
                <div class="countdown__block">
                  <span class="countdown__num">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
                  <span class="countdown__unit">heures</span>
                </div>
                <span class="countdown__sep">:</span>
                <div class="countdown__block">
                  <span class="countdown__num">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
                  <span class="countdown__unit">min</span>
                </div>
                <span class="countdown__sep">:</span>
                <div class="countdown__block">
                  <span class="countdown__num">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
                  <span class="countdown__unit">sec</span>
                </div>
              </div>
            </div>

            <button class="btn btn-primary product-cta" @click="handleOrder">
              Précommander →
            </button>

            <p class="product-preorder-note">
              Votre commande sera expédiée dès le lancement le 17 août.
            </p>

            <p v-if="!user" class="product-auth-hint">
              Un compte est nécessaire pour commander.
              <NuxtLink to="/inscription">Créer un compte gratuitement →</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ LIFESTYLE BANNER ══ -->
    <section class="lifestyle-banner">
      <img src="/E0B8349B-9FE5-4FCF-A489-3D22E65CFF2C.JPG" alt="Planner Graines de Foi avec bougie" />
    </section>

    <!-- ══ CONTENU COMPLET ══ -->
    <section class="section" data-reveal>
      <div class="container">
        <div class="contents-layout">
          <div class="contents-text">
            <span class="eyebrow">Ce qu'il contient</span>
            <h2 class="section-title">365 jours d'intention spirituelle.</h2>
            <div class="divider" />
            <ul class="contents-list" data-stagger>
              <li v-for="item in contents" :key="item">
                <span class="contents-bullet" aria-hidden="true">✦</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="contents-note">
              Une question ? <NuxtLink to="/contact" class="contents-link">Écrivez-nous.</NuxtLink>
            </p>
          </div>
          <div class="contents-img" data-reveal>
            <img src="/AE054CF9-9FB6-4FE6-97AB-2DC88E876BAA.PNG" alt="Pages intérieures du planner Graines de Foi" />
            <div class="contents-img__caption">Pages de méditation quotidienne</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ VERSE ══ -->
    <section class="section section--deep" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <p class="verse-text">« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »</p>
        <p class="verse-ref" style="color: rgba(255,255,255,0.4)">Psaumes 119 : 105</p>
      </div>
    </section>

    <!-- ══ GARANTIES ══ -->
    <section class="section">
      <div class="container">
        <div class="garanties" data-stagger>
          <div class="garantie">
            <div class="garantie__icon">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" stroke-width="1.4"/>
                <path d="M4 8l12 8 12-8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
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
            <p>Papier épais, reliure solide, couverture soignée — conçu pour durer toute une année.</p>
          </div>
          <div class="garantie">
            <div class="garantie__icon">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 4 C10 4 6 8 6 14 C6 20 10 24 16 28 C22 24 26 20 26 14 C26 8 22 4 16 4Z" stroke="currentColor" stroke-width="1.4"/>
                <path d="M12 15 L15 18 L20 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4>Pensé avec intention</h4>
            <p>Créé par Camille Gicquiaud — chaque page est le fruit de mois de réflexion spirituelle.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FAQ ══ -->
    <section class="section" data-reveal>
      <div class="container--narrow">
        <span class="eyebrow" style="text-align:center;display:block">Questions fréquentes</span>
        <h2 class="faq-title">Tout ce que vous voulez savoir</h2>
        <div class="divider divider--center" />

        <div class="faq-list">
          <details class="faq-item">
            <summary class="faq-question">Quand vais-je recevoir mon planner ?</summary>
            <p class="faq-answer">Les commandes sont expédiées sous 2 à 4 jours ouvrés. Une fois expédié, comptez 3 à 5 jours de livraison en France métropolitaine.</p>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Livrez-vous en dehors de la France ?</summary>
            <p class="faq-answer">Oui — nous livrons en France métropolitaine, en DOM-TOM, en Belgique et en Suisse. Pour toute autre destination, contactez-nous.</p>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Le planner est-il adapté aux débutants ?</summary>
            <p class="faq-answer">Absolument. Graines de Foi a été conçu pour être accessible à toute personne souhaitant approfondir sa vie spirituelle, quelle que soit son expérience.</p>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Puis-je offrir ce planner ?</summary>
            <p class="faq-answer">Oui. Lors de votre commande, renseignez l'adresse de livraison de la personne à qui vous l'offrez. Nous préparons les planners avec soin, parfaits à offrir.</p>
          </details>
          <details class="faq-item">
            <summary class="faq-question">Une autre question ?</summary>
            <p class="faq-answer">Écrivez-nous via la <NuxtLink to="/contact" class="faq-link">page contact</NuxtLink> — nous répondons sous 24 h.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- ══ CTA FINAL ══ -->
    <section class="section section--deep cta-final" data-reveal>
      <div class="container--narrow" style="text-align: center">
        <p class="verse-text" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; font-style: normal; letter-spacing: 0.1em; text-transform: uppercase">Lancement officiel · 17 août 2026</p>
        <h2 class="cta-title">Prêt·e à commencer ce chemin ?</h2>
        <button class="btn btn-outline-light cta-btn" @click="handleOrder">
          Précommander Graines de Foi →
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── HERO ── */
.shop-hero {
  padding-top: 10rem;
  padding-bottom: 5rem;
}

.shop-layout {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 5rem;
  align-items: start;
}

/* ── GALLERY ── */
.gallery {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery__main {
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.gallery__thumb {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--color-border);
  background: var(--color-bg-alt);
  padding: 0;
  cursor: pointer;
  transition: border-color 0.18s;
}

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery__thumb:hover { border-color: var(--color-green-mid); }
.gallery__thumb--active { border-color: var(--color-green); }

/* ── PRODUCT INFO ── */
.shop-eyebrow {
  display: block;
  margin-bottom: 0.5rem;
}

.shop-title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 600;
  margin-top: 0.75rem;
  color: var(--color-green-deep);
}

.product-desc {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.78;
}

.product-teaser {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.product-teaser li {
  font-size: 0.88rem;
  color: var(--color-green-mid);
  padding-left: 1rem;
  position: relative;
}

.product-teaser li::before {
  content: '✦';
  position: absolute;
  left: 0;
  font-size: 0.6rem;
  top: 0.2em;
  color: var(--color-green-mid);
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
  flex-wrap: wrap;
}

.price-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.price-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  background: rgba(99, 76, 168, 0.12);
  color: #5b3fa8;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.product-price {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

.product-price-original {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--color-muted);
  text-decoration: line-through;
  opacity: 0.7;
}

.product-stock {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
}

.stock--ok  { background: rgba(53, 64, 40, 0.1); color: var(--color-green); }
.stock--low { background: rgba(184, 150, 46, 0.12); color: #8a6f1a; }
.stock--out { background: rgba(162, 48, 48, 0.1); color: var(--color-danger); }
.stock--pre { background: rgba(99, 76, 168, 0.1); color: #5b3fa8; }

/* ── COUNTDOWN ── */
.countdown {
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.countdown__label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 0.875rem;
}

.countdown__blocks {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.countdown__block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 52px;
}

.countdown__num {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-green-deep);
  line-height: 1;
  letter-spacing: -0.02em;
}

.countdown__unit {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

.countdown__sep {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--color-border);
  margin-bottom: 1rem;
  align-self: flex-start;
  margin-top: 0.25rem;
}

.product-preorder-note {
  margin-top: 0.875rem;
  font-size: 0.8rem;
  color: var(--color-muted);
  text-align: center;
}

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

.product-auth-hint a { color: var(--color-green); }

/* Skeleton */
.skeleton {
  background: var(--color-border);
  border-radius: 8px;
  animation: shimmer 1.5s ease-in-out infinite;
}
.skeleton--price { height: 48px; width: 50%; margin-bottom: 1.5rem; }
.skeleton--btn { height: 52px; }
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ── LIFESTYLE BANNER ── */
.lifestyle-banner {
  height: 520px;
  overflow: hidden;
}

.lifestyle-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}

/* ── CONTENTS ── */
.contents-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 5rem;
  align-items: start;
}

.contents-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 2rem;
}

.contents-list li {
  display: flex;
  gap: 0.75rem;
  font-size: 0.93rem;
  color: var(--color-text);
  line-height: 1.5;
}

.contents-bullet {
  flex-shrink: 0;
  font-size: 0.6rem;
  color: var(--color-green-mid);
  margin-top: 0.35em;
}

.contents-note {
  margin-top: 2rem;
  font-size: 0.88rem;
  color: var(--color-muted);
}

.contents-link {
  color: var(--color-green);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contents-img {
  position: sticky;
  top: 100px;
  border-radius: 16px;
  overflow: hidden;
}

.contents-img img {
  width: 100%;
  display: block;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(32, 44, 23, 0.1);
}

.contents-img__caption {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
  letter-spacing: 0.03em;
}

/* ── GARANTIES ── */
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
  font-size: 1.05rem;
  margin-bottom: 0.6rem;
  color: var(--color-green-deep);
}

.garantie p {
  font-size: 0.88rem;
  color: var(--color-muted);
  line-height: 1.7;
}

/* ── FAQ ── */
.faq-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.75rem;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.faq-question {
  padding: 1.1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-green-deep);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: background 0.15s;
}

.faq-question::-webkit-details-marker { display: none; }

.faq-question::after {
  content: '+';
  font-size: 1.2rem;
  font-weight: 300;
  color: var(--color-green-mid);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.faq-item[open] .faq-question { background: var(--color-bg-alt); }
.faq-item[open] .faq-question::after { transform: rotate(45deg); }

.faq-answer {
  padding: 0 1.25rem 1.1rem;
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.faq-link {
  color: var(--color-green);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── CTA FINAL ── */
.cta-final {
  padding-block: 6rem;
}

.cta-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 600;
  color: #fff;
  margin-top: 1rem;
  margin-bottom: 2.5rem;
}

.cta-btn {
  padding: 1rem 2.5rem;
  font-size: 1rem;
}

/* ── TRANSITIONS ── */
.fade-img-enter-active,
.fade-img-leave-active { transition: opacity 0.25s; }
.fade-img-enter-from,
.fade-img-leave-to { opacity: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .shop-layout { gap: 3rem; }
  .contents-layout { grid-template-columns: 1fr 340px; gap: 3rem; }
}

@media (max-width: 900px) {
  .shop-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .gallery { position: static; }

  .lifestyle-banner { height: 320px; }

  .contents-layout { grid-template-columns: 1fr; }
  .contents-img { position: static; order: -1; max-width: 360px; margin-inline: auto; }
  .garanties { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
}

@media (max-width: 600px) {
  .lifestyle-banner { height: 240px; }
}
</style>
