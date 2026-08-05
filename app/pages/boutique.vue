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

const galleryImages = [
  { src: '/7FCFADDB-776F-42F0-A48A-CEDCA69D4E22.PNG', alt: 'Couverture Graines de Foi' },
  { src: '/AE054CF9-9FB6-4FE6-97AB-2DC88E876BAA.PNG', alt: 'Pages intérieures — méditation quotidienne' },
  { src: '/6A964402-0B8C-429D-8601-BF59AB787AFA.PNG', alt: 'Page Dessin' },
  { src: '/5CE7F5F9-E94F-4BD1-A942-AA21679C2DBD.PNG', alt: 'Dos du planner — GICQUIAUD Camille' },
]
const activeImg = ref(0)

const contents = [
  'Une page de couverture',
  'Une page d\'accueil de présentation',
  'Une page expliquant comment bien commencer son utilisation',
  'Un journal de gratitude',
  'Deux pages présentant les thèmes abordés chaque mois',
  'Un bilan spirituel hebdomadaire',
  'Une page mensuelle dédiée à l\'explication du thème du mois',
  'Un espace de méditation pour chaque jour de l\'année',
  '13 témoignages',
  'Des défis répartis tout au long de l\'année — communion, introspection, créativité, confiance en soi, partage et amour',
  'Des pages consacrées à la prière',
  'Une « To Do List » des exaucements de prières',
  'Un journal de rêves — notes, interprétation et prières associées',
  'Une partie « Notes » pour écrire librement',
  'Une partie « Dessin » pour exprimer librement ses ressentis',
]

onMounted(async () => {
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

  ctx = gsap.context(() => {
    gsap.timeline({ delay: 0.1 })
      .from('.shop-eyebrow', { opacity: 0, y: 10, duration: 0.5 })
      .from('.shop-title', { opacity: 0, y: 45, duration: 1, ease: 'power4.out' }, '-=0.2')
      .from('.gallery', { opacity: 0, x: -30, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .from('.product-info > *', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4')

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
  }, root.value!)
})

onUnmounted(() => ctx?.revert())

const prix = computed(() => {
  if (!product.value) return '39,90 €'
  return (product.value.prixUnitaire / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
})

const stockLabel = computed(() => {
  if (!product.value) return 'En stock'
  if (product.value.stock === 0) return 'Rupture de stock'
  if (product.value.stock <= 5) return `Plus que ${product.value.stock} exemplaire${product.value.stock > 1 ? 's' : ''}`
  return 'En stock'
})

const stockClass = computed(() => {
  if (!product.value || product.value.stock > 0) return 'stock--ok'
  return 'stock--out'
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

    <!-- ══ PRODUCT HERO ══ -->
    <section class="shop-hero">
      <div class="container shop-layout">

        <!-- Gallery -->
        <div class="gallery">
          <div class="gallery__main">
            <Transition name="fade-img" mode="out-in">
              <img
                :key="activeImg"
                :src="galleryImages[activeImg].src"
                :alt="galleryImages[activeImg].alt"
              />
            </Transition>
          </div>
          <div class="gallery__thumbs">
            <button
              v-for="(img, i) in galleryImages"
              :key="i"
              class="gallery__thumb"
              :class="{ 'gallery__thumb--active': activeImg === i }"
              @click="activeImg = i"
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
            Un compagnon annuel créé par Camille Gicquiaud pour nourrir votre vie spirituelle, structurer vos journées et vous accompagner dans la foi — chaque matin, chaque semaine, toute l'année.
          </p>

          <ul class="product-teaser">
            <li>Un espace de méditation pour chaque jour de l'année</li>
            <li>Bilans hebdomadaires et mensuels</li>
            <li>Journal de rêves, de prières et de gratitude</li>
            <li>13 témoignages &amp; des défis spirituels</li>
          </ul>

          <div v-if="loading" class="product-bottom">
            <div class="skeleton skeleton--price" />
            <div class="skeleton skeleton--btn" />
          </div>

          <div v-else class="product-bottom">
            <div class="product-price-row">
              <span class="product-price">{{ prix }}</span>
              <span class="product-stock" :class="stockClass">{{ stockLabel }}</span>
            </div>

            <button
              class="btn btn-primary product-cta"
              :disabled="product?.stock === 0"
              @click="handleOrder"
            >
              {{ product?.stock === 0 ? 'Rupture de stock' : user ? 'Commander →' : 'Commander — créer un compte' }}
            </button>

            <p v-if="!user" class="product-auth-hint">
              Un compte est nécessaire pour commander.
              <NuxtLink to="/inscription">Créer un compte gratuitement →</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PHOTOS CAMILLE ══ -->
    <section class="camille-section">
      <div class="camille-grid">
        <div class="camille-img camille-img--main">
          <img src="/DSC03471.jpg" alt="Camille Gicquiaud lisant le planner Graines de Foi" />
        </div>
        <div class="camille-right">
          <div class="camille-img camille-img--secondary">
            <img src="/DSC03983.jpg" alt="Camille Gicquiaud, fondatrice de mannaeden" />
          </div>
          <div class="camille-img camille-img--pages">
            <img src="/E0B8349B-9FE5-4FCF-A489-3D22E65CFF2C.JPG" alt="Planner Graines de Foi avec bougie" />
          </div>
        </div>
      </div>
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

    <!-- ══ CTA FINAL ══ -->
    <section class="section section--deep cta-final" data-reveal>
      <div class="container--narrow" style="text-align: center">
        <p class="verse-text" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; font-style: normal; letter-spacing: 0.1em; text-transform: uppercase">Une seule année. Une vie transformée.</p>
        <h2 class="cta-title">Prêt·e à commencer ce chemin ?</h2>
        <button class="btn btn-outline-light cta-btn" @click="handleOrder">
          Commander Graines de Foi →
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
  margin-top: 0.75rem;
}

.gallery__thumb {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
  background: none;
  padding: 0;
}

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery__thumb--active {
  border-color: var(--color-green);
}

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
}

.product-price {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

.product-stock {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
}

.stock--ok { background: rgba(53, 64, 40, 0.1); color: var(--color-green); }
.stock--low { background: rgba(184, 150, 46, 0.12); color: #8a6f1a; }
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

/* ── CAMILLE PHOTOS ── */
.camille-section {
  padding-block: 0;
}

.camille-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 0.5rem;
  height: 620px;
}

.camille-img {
  overflow: hidden;
}

.camille-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.camille-img:hover img { transform: scale(1.03); }

.camille-right {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;
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

  .camille-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .camille-img--main { height: 420px; }
  .camille-right { grid-template-columns: 1fr 1fr; grid-template-rows: auto; height: 260px; }

  .contents-layout {
    grid-template-columns: 1fr;
  }

  .contents-img { position: static; order: -1; max-width: 360px; margin-inline: auto; }

  .garanties { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
}

@media (max-width: 600px) {
  .camille-right { grid-template-columns: 1fr; height: auto; }
  .camille-img--secondary,
  .camille-img--pages { height: 260px; }
}
</style>
