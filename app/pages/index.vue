<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

const LINE1 = 'Planifiez avec intention,'
const line1Chars = [...LINE1]

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    setupHeroEntrance()
    setupHeroParallax()
    setupBook()
    setupReveals()
  }, root.value!)
})

onUnmounted(() => ctx?.revert())

function setupHeroEntrance() {
  gsap.timeline({ delay: 0.15 })
    .from('.hero__eyebrow', { opacity: 0, y: 10, duration: 0.5 })
    .from('.char', { yPercent: 110, duration: 0.72, ease: 'power3.out', stagger: 0.018 }, '-=0.1')
    .from('.title-em', { yPercent: 110, duration: 0.85, ease: 'power4.out' }, '-=0.45')
    .from('.hero__sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero__actions', { opacity: 0, y: 14, duration: 0.5 }, '-=0.35')
    .from('.hero__photo', { opacity: 0, scale: 1.04, duration: 1.1, ease: 'power2.out' }, 0)
}

function setupHeroParallax() {
  gsap.to('.hero__photo img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  })
}

function setupBook() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.book-section',
      start: 'top top',
      end: '+=280%',
      pin: true,
      pinSpacing: true,
      scrub: 1.5,
      anticipatePin: 1
    }
  })

  tl
    .to('.book-cover--left',  { xPercent: -100, rotateY: -22, ease: 'power1.inOut', duration: 3 }, 0)
    .to('.book-cover--right', { xPercent: 100,  rotateY:  22, ease: 'power1.inOut', duration: 3 }, 0)
    .fromTo('.book-pages', { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 2.4)
    .from('.spread--1 .p-item', { opacity: 0, y: 14, stagger: 0.5, duration: 0.5 }, 3.2)
    .to('.spread--1', { opacity: 0, x: -20, duration: 0.4 }, 6)
    .fromTo('.spread--2', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5 }, 6.4)
    .from('.spread--2 .p-item', { opacity: 0, y: 14, stagger: 0.5, duration: 0.5 }, 7)
}

function setupReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%' }
    })
  })
}
</script>

<template>
  <div ref="root">

    <!-- ══ HERO — blanc / split ══════════════════════ -->
    <section class="hero">
      <div class="hero__text">
        <span class="hero__eyebrow eyebrow">Le planner biblique</span>

        <h1 class="hero__title">
          <span class="title-row">
            <span class="title-row__inner">
              <span v-for="(char, i) in line1Chars" :key="i" class="char">{{ char }}</span>
            </span>
          </span>
          <span class="title-row title-row--em">
            <span class="title-row__inner">
              <em class="title-em">vivez avec foi.</em>
            </span>
          </span>
        </h1>

        <p class="hero__sub">
          Un compagnon pour votre vie intérieure — structuré,
          ancré dans la foi, conçu pour toute une année.
        </p>

        <div class="hero__actions">
          <NuxtLink to="/boutique" class="btn btn-primary">Commander</NuxtLink>
          <NuxtLink to="/planner" class="hero__link">Découvrir le planner →</NuxtLink>
        </div>
      </div>

      <div class="hero__photo">
        <img src="/IMG_2484.JPG" alt="Plantes vertes, lumière naturelle" />
      </div>
    </section>

    <!-- ══ BOOK — couverture qui s'ouvre ════════════ -->
    <section class="book-section">
      <div class="book-cover book-cover--left">
        <div class="cover-leaves" aria-hidden="true">
          <img src="/IMG_2483.JPG" alt="" />
        </div>
        <div class="cover-label">
          <span class="cover-brand">mannaeden</span>
          <span class="cover-year">le planner · 2025</span>
        </div>
      </div>

      <div class="book-cover book-cover--right">
        <div class="cover-leaves cover-leaves--flip" aria-hidden="true">
          <img src="/IMG_2483.JPG" alt="" />
        </div>
        <div class="cover-label cover-label--right">
          <span class="cover-subtitle">Un planner pour votre vie intérieure</span>
        </div>
      </div>

      <div class="book-pages">
        <div class="book-spine" />

        <div class="spread spread--1">
          <div class="book-page book-page--left">
            <span class="page-num">1</span>
            <span class="page-chapter">Chapitre I</span>
            <h2 class="page-title p-item">La vision</h2>
            <hr class="page-rule p-item" />
            <p class="page-body p-item">
              Dans l'Exode, la manne tombait chaque matin — fraîche, suffisante, renouvelée.
              <em>mannaeden</em> s'inspire de cette image : nourrir votre vie intérieure,
              un jour à la fois.
            </p>
            <p class="page-body p-item">
              Un planner ancré dans la foi, ouvert à tous — croyants de longue date,
              curieux, ou simplement en chemin vers quelque chose de plus grand.
            </p>
          </div>
          <div class="book-page book-page--right">
            <span class="page-num">2</span>
            <div class="page-verse-wrap">
              <p class="page-verse p-item">
                « Les bontés de l'Éternel ne sont pas épuisées,
                ses compassions ne sont pas à leur terme.
                Elles se renouvellent chaque matin. »
              </p>
              <span class="page-verse-ref p-item">Lamentations 3 : 22-23</span>
            </div>
          </div>
        </div>

        <div class="spread spread--2">
          <div class="book-page book-page--left">
            <span class="page-num">3</span>
            <span class="page-chapter">Chapitre II</span>
            <h2 class="page-title p-item">Ce qui vous attend</h2>
            <hr class="page-rule p-item" />
            <ul class="page-features">
              <li class="p-item">✦&ensp;Verset guidant chaque semaine</li>
              <li class="p-item">✦&ensp;Plans journaliers structurés</li>
              <li class="p-item">✦&ensp;Trackers de prière mensuel &amp; annuel</li>
              <li class="p-item">✦&ensp;Espaces d'écriture libres</li>
              <li class="p-item">✦&ensp;Bilan de fin d'année</li>
            </ul>
          </div>
          <div class="book-page book-page--right">
            <span class="page-num">4</span>
            <span class="page-chapter p-item">Pour vous</span>
            <h2 class="page-title-sm p-item">Quel que soit votre chemin.</h2>
            <hr class="page-rule p-item" />
            <p class="page-body p-item">
              Pas de jargon, pas de performance spirituelle.
              Juste de l'espace pour grandir, un jour à la fois.
            </p>
            <NuxtLink to="/boutique" class="btn btn-primary page-cta p-item">
              Commander →
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="book-hint" aria-hidden="true">
        <span>Défiler pour découvrir</span>
        <div class="book-hint__line" />
      </div>
    </section>

    <!-- ══ PHOTO BREAK ═══════════════════════════════ -->
    <div class="photo-break">
      <img src="/IMG_1922.jpg" alt="Feuilles de monstera, vert profond" />
      <div class="photo-break__overlay">
        <p class="photo-break__quote">
          « Remets ton sort à l'Éternel,<br>mets en lui ta confiance. »
        </p>
        <span class="photo-break__ref">Psaume 37 : 5</span>
      </div>
    </div>

    <!-- ══ EDITORIAL ══════════════════════════════════ -->
    <section class="section editorial">
      <div class="container">
        <div class="editorial-grid" data-reveal>
          <div class="editorial-text">
            <span class="eyebrow">Le planner physique</span>
            <h2 class="editorial-title">Un objet fait pour durer toute une année.</h2>
            <div class="divider" />
            <p class="editorial-body">
              Papier épais, reliure solide, couverture soignée — chaque détail est pensé
              pour que mannaeden devienne le compagnon de votre bureau,
              de votre table de nuit, de votre sac.
            </p>
            <p class="editorial-verse">
              « Là où est votre trésor,<br>là aussi sera votre cœur. »
              <span>Matthieu 6 : 21</span>
            </p>
            <div class="editorial-actions">
              <NuxtLink to="/boutique" class="btn btn-primary">Commander</NuxtLink>
              <NuxtLink to="/planner" class="editorial-link">Tout voir sur le planner →</NuxtLink>
            </div>
          </div>

          <div class="editorial-img">
            <img src="/IMG_2483.JPG" alt="Feuilles sombres, texture naturelle" />
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA ════════════════════════════════════════ -->
    <section class="cta-section section--deep">
      <div class="container--narrow cta-inner" data-reveal>
        <span class="eyebrow" style="color: rgba(255,255,255,0.45)">Prêt à commencer ?</span>
        <h2 class="cta-title">Un nouveau chapitre commence ici.</h2>
        <p class="cta-verse">
          « Je suis venu afin que vous ayez la vie, et que vous l'ayez en abondance. »
          <span>Jean 10 : 10</span>
        </p>
        <NuxtLink to="/boutique" class="btn btn-outline-light">Commander mannaeden</NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ══ HERO ════════════════════════════════════════════ */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100dvh;
  background: var(--color-bg);
}

.hero__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8rem 5vw 5rem clamp(1.5rem, 6vw, 6rem);
}

.hero__title {
  font-size: clamp(2.4rem, 4.5vw, 5.2rem);
  line-height: 1.03;
  letter-spacing: -0.02em;
  margin-top: 1.1rem;
  font-weight: 700;
  color: var(--color-green-deep);
}

.title-row {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}

.title-row__inner { display: block; }

.char { display: inline-block; will-change: transform; }

.title-row--em { margin-top: 0.04em; }

.title-em {
  display: inline-block;
  font-style: italic;
  color: var(--color-green-mid);
  will-change: transform;
}

.hero__sub {
  margin-top: 1.75rem;
  font-size: clamp(0.92rem, 1.3vw, 1.05rem);
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 420px;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.hero__link {
  font-size: 0.875rem;
  color: var(--color-green-mid);
  font-weight: 500;
  transition: color 0.2s;
}

.hero__link:hover { color: var(--color-green-deep); }

.hero__photo {
  overflow: hidden;
  position: relative;
  will-change: transform;
}

.hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

/* ══ BOOK ════════════════════════════════════════════ */
.book-section {
  position: relative;
  height: 100vh;
  background: #DADBD8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1600px;
}

.book-cover {
  position: absolute;
  top: 0; bottom: 0;
  width: 50%;
  background: var(--color-green-deep);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  overflow: hidden;
}

.book-cover--left {
  left: 0;
  transform-origin: right center;
  box-shadow: 12px 0 50px rgba(0,0,0,0.25);
}

.book-cover--right {
  right: 0;
  transform-origin: left center;
  box-shadow: -12px 0 50px rgba(0,0,0,0.25);
}

.cover-leaves {
  position: absolute;
  inset: 0;
  opacity: 0.35;
}

.cover-leaves img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-leaves--flip { transform: scaleX(-1); }

.cover-label {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.cover-brand {
  font-family: var(--font-serif);
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.8);
}

.cover-year {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
}

.cover-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.85rem, 1.4vw, 1.05rem);
  color: rgba(255,255,255,0.35);
  max-width: 180px;
  text-align: center;
  line-height: 1.5;
}

.book-pages {
  position: relative;
  width: min(820px, 88vw);
  height: min(520px, 58vh);
  background: #fafafa;
  border-radius: 1px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.1), 0 32px 80px rgba(0,0,0,0.1);
  z-index: 5;
  overflow: hidden;
}

.book-spine {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 3px;
  transform: translateX(-50%);
  background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.1));
  z-index: 2;
}

.spread {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.book-page {
  padding: clamp(1.4rem, 3vw, 2.5rem);
  position: relative;
  overflow: hidden;
}

.book-page--left { box-shadow: inset -8px 0 18px -8px rgba(0,0,0,0.06); }
.book-page--right { box-shadow: inset 8px 0 18px -8px rgba(0,0,0,0.06); }

.page-num {
  position: absolute;
  bottom: 1.1rem;
  font-size: 0.72rem;
  color: rgba(80, 90, 63, 0.3);
  letter-spacing: 0.05em;
}

.book-page--left  .page-num { left:  clamp(1.4rem, 3vw, 2.5rem); }
.book-page--right .page-num { right: clamp(1.4rem, 3vw, 2.5rem); }

.page-chapter {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-green-mid);
  margin-bottom: 0.7rem;
}

.page-title {
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2.3vw, 1.8rem);
  font-weight: 700;
  color: var(--color-green-deep);
  line-height: 1.1;
  margin-bottom: 0.9rem;
}

.page-title-sm {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.8vw, 1.4rem);
  font-weight: 600;
  color: var(--color-green-deep);
  line-height: 1.15;
  margin: 0.4rem 0 0.9rem;
}

.page-rule {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

.page-body {
  font-size: clamp(0.78rem, 1.1vw, 0.88rem);
  color: var(--color-muted);
  line-height: 1.75;
  margin-bottom: 0.7rem;
}

.page-body em { font-family: var(--font-serif); font-style: italic; color: var(--color-green); }

.page-verse-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding-block: 1rem;
}

.page-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.88rem, 1.4vw, 1.05rem);
  color: var(--color-green);
  line-height: 1.65;
}

.page-verse-ref {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

.page-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.page-features li {
  font-size: clamp(0.76rem, 1.1vw, 0.85rem);
  color: var(--color-text);
  line-height: 1.5;
}

.page-cta {
  margin-top: 1.25rem;
  font-size: 0.82rem;
  padding: 0.6rem 1.2rem;
}

.book-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(80, 90, 63, 0.5);
  z-index: 20;
}

.book-hint__line {
  width: 1px;
  height: 36px;
  background: rgba(80, 90, 63, 0.3);
  animation: pulse-line 2.2s ease-in-out infinite;
}

@keyframes pulse-line {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* ══ PHOTO BREAK ════════════════════════════════════ */
.photo-break {
  position: relative;
  height: 55vh;
  overflow: hidden;
}

.photo-break img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.photo-break__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(32, 44, 23, 0.55);
  text-align: center;
  gap: 0.75rem;
  padding: 2rem;
}

.photo-break__quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  max-width: 600px;
}

.photo-break__ref {
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
}

/* ══ EDITORIAL ══════════════════════════════════════ */
.editorial { background: var(--color-bg); }

.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}

.editorial-title {
  font-size: clamp(1.7rem, 2.8vw, 2.4rem);
  font-weight: 700;
  margin-top: 0.75rem;
  color: var(--color-green-deep);
  line-height: 1.1;
}

.editorial-body {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.8;
  margin-top: 1rem;
}

.editorial-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--color-green);
  line-height: 1.65;
  margin-top: 1.5rem;
  padding-left: 1.25rem;
  border-left: 2px solid var(--color-border);
}

.editorial-verse span {
  display: block;
  font-style: normal;
  font-size: 0.75rem;
  letter-spacing: 0.07em;
  color: var(--color-muted);
  margin-top: 0.5rem;
  font-family: var(--font-sans);
}

.editorial-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.editorial-link {
  font-size: 0.875rem;
  color: var(--color-green);
  font-weight: 500;
}

.editorial-link:hover { text-decoration: underline; }

.editorial-img {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
}

.editorial-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ══ CTA ════════════════════════════════════════════ */
.cta-section { min-height: 50vh; display: flex; align-items: center; }

.cta-inner {
  text-align: center;
  padding-block: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: #ffffff;
  font-weight: 700;
}

.cta-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.65;
}

.cta-verse span {
  display: block;
  font-style: normal;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  margin-top: 0.4rem;
  color: rgba(255,255,255,0.25);
}

/* ══ RESPONSIVE ══════════════════════════════════════ */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto 45vw;
  }

  .hero__text {
    padding: 8rem 1.5rem 3rem;
    order: 1;
  }

  .hero__photo { order: 2; }

  .editorial-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .editorial-img { aspect-ratio: 16 / 9; }
}

@media (max-width: 600px) {
  .book-pages {
    width: 96vw;
    height: auto;
    min-height: 460px;
  }

  .spread {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .book-page--left { border-bottom: 1px solid var(--color-border); box-shadow: none; }

  .title-row { white-space: normal; }
}
</style>
