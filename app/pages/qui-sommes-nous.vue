<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    gsap.timeline({ delay: 0.1 })
      .from('.hero-eyebrow', { opacity: 0, y: 10, duration: 0.5 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 1, ease: 'power4.out' }, '-=0.2')

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 35, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      })
    })
  }, root.value!)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="page-root">

    <!-- HERO — Camille sitting -->
    <section class="hero">
      <div class="hero__photo">
        <img src="/DSC03471.jpg" alt="Camille Gicquiaud, fondatrice de mannaeden" />
        <div class="hero__overlay" />
      </div>
      <div class="container hero__content">
        <span class="hero-eyebrow eyebrow" style="color: rgba(255,255,255,0.5)">Fondatrice</span>
        <h1 class="hero-title">Qui suis-je ?</h1>
      </div>
    </section>

    <!-- INTRO -->
    <section class="section">
      <div class="container">
        <div class="camille-layout" data-reveal>
          <div class="camille-text">
            <span class="eyebrow">Camille Gicquiaud</span>
            <h2 class="camille-title">À l'origine de mannaeden</h2>
            <div class="divider" />
            <p class="camille-body">
              Je suis Camille Gicquiaud, fondatrice de mannaeden. Depuis des années, la foi occupe une place centrale dans ma vie — mais j'ai longtemps cherché un outil qui m'aide à l'incarner concrètement, au quotidien.
            </p>
            <p class="camille-body">
              C'est de ce besoin qu'est né <em>Graines de Foi</em> : un planner pensé pour aller au-delà de la simple organisation. Un espace où la prière, la méditation, la gratitude et la planification se rejoignent — chaque matin, chaque semaine, toute l'année.
            </p>
            <p class="camille-body">
              mannaeden s'inspire de la manne dans l'Exode — cette nourriture fraîche, quotidienne, suffisante. Un rappel que la foi se nourrit elle aussi, jour après jour, d'attention et d'intentionnalité.
            </p>
            <p class="camille-verse">
              <em>« L'homme ne vivra pas de pain seulement, mais de toute parole qui sort de la bouche de Dieu. »</em>
              <span>Matthieu 4 : 4</span>
            </p>
          </div>
          <div class="camille-photo">
            <img src="/DSC03983.jpg" alt="Camille Gicquiaud tenant le planner Graines de Foi" />
          </div>
        </div>
      </div>
    </section>

    <!-- CONVICTION -->
    <section class="section section--alt" data-reveal>
      <div class="container--narrow" style="text-align: center">
        <span class="eyebrow">Ma conviction</span>
        <h2 class="conviction-title">La foi mérite un espace concret dans nos vies.</h2>
        <p class="conviction-body">
          Pas seulement dans nos cœurs — mais sur nos bureaux, dans nos sacs, dans nos routines.
          C'est pourquoi chaque page de <em>Graines de Foi</em> a été pensée avec soin,
          pour que votre vie spirituelle trouve une place réelle dans votre quotidien.
        </p>
        <NuxtLink to="/boutique" class="btn btn-primary" style="margin-top: 2rem">
          Découvrir le planner →
        </NuxtLink>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="section" data-reveal>
      <div class="container--narrow" style="text-align: center">
        <p class="contact-invite">
          Une question ? Une envie d'échanger ?
          <NuxtLink to="/contact" class="contact-link">Écrivez-moi directement.</NuxtLink>
        </p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.page-root { background: var(--color-bg); }

/* HERO */
.hero {
  position: relative;
  height: 65vh;
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero__photo {
  position: absolute;
  inset: 0;
}

.hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(32,44,23,0.15) 0%, rgba(32,44,23,0.72) 100%);
}

.hero__content {
  position: relative;
  z-index: 2;
  padding-bottom: 4rem;
  color: #fff;
}

.hero-title {
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 700;
  color: #fff;
  margin-top: 0.75rem;
}

/* CAMILLE SECTION */
.camille-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 6rem;
  align-items: start;
}

.camille-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--color-green-deep);
}

.camille-body {
  font-size: 1.02rem;
  color: var(--color-muted);
  line-height: 1.85;
  margin-bottom: 1.25rem;
}

.camille-body em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--color-green);
}

.camille-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--color-green);
  line-height: 1.65;
  padding: 1.5rem 2rem;
  border-left: 2px solid var(--color-border);
  margin-top: 1.25rem;
}

.camille-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-top: 0.5rem;
}

.camille-photo {
  position: sticky;
  top: 100px;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
}

.camille-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* CONVICTION */
.conviction-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.75rem;
  line-height: 1.15;
}

.conviction-body {
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.8;
  margin-top: 1.25rem;
  max-width: 600px;
  margin-inline: auto;
}

.conviction-body em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--color-green);
}

/* CONTACT */
.contact-invite {
  font-size: 1rem;
  color: var(--color-muted);
}

.contact-link {
  color: var(--color-green);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-left: 0.25rem;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .camille-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .camille-photo {
    position: static;
    aspect-ratio: 4 / 3;
    max-width: 420px;
    margin-inline: auto;
  }
}
</style>
