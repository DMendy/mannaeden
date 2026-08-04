<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context

// Split "Planifiez avec intention," into chars for animation
const LINE1 = 'Planifiez avec intention,'
const line1Chars = [...LINE1].map(c => (c === ' ' ? ' ' : c))

onMounted(() => {
  ctx = gsap.context(() => {
    setupHeroEntrance()
    setupHeroParallax()
    setupBook()
    setupScrollReveals()
  }, root.value!)
})

onUnmounted(() => ctx?.revert())

function setupHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.2 })
  tl
    .from('.hero__eyebrow', { opacity: 0, y: 10, duration: 0.5 })
    .from('.char', {
      yPercent: 110,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.02
    }, '-=0.1')
    .from('.title-em', {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out'
    }, '-=0.5')
    .from('.hero__sub', { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
    .from('.hero__actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.hero__scroll', { opacity: 0, duration: 0.8 }, '-=0.2')
}

function setupHeroParallax() {
  // Left branch — slow
  gsap.to('.hero__branch--left', {
    y: -90,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.5
    }
  })

  // Right branch — faster
  gsap.to('.hero__branch--right', {
    y: -150,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  })

  // Content — subtle drift
  gsap.to('.hero__content', {
    y: -55,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 3
    }
  })

  // Glow drift
  gsap.to('.hero__glow', {
    y: -40,
    x: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 4
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

  // 0–3 : Covers split open
  tl
    .to('.book-cover--left', {
      xPercent: -100,
      rotateY: -22,
      ease: 'power1.inOut',
      duration: 3
    }, 0)
    .to('.book-cover--right', {
      xPercent: 100,
      rotateY: 22,
      ease: 'power1.inOut',
      duration: 3
    }, 0)

  // 2.5–3 : Pages reveal
  tl.fromTo('.book-pages',
    { opacity: 0, scale: 0.97 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
    2.4
  )

  // 3.2–5.5 : Spread 1 content staggers in
  tl.from('.spread--1 .p-item', {
    opacity: 0,
    y: 14,
    stagger: 0.55,
    duration: 0.5,
    ease: 'power2.out'
  }, 3.2)

  // 6–6.5 : Transition — spread 1 out
  tl.to('.spread--1', { opacity: 0, x: -20, duration: 0.4 }, 6)

  // 6.4–7 : Spread 2 in
  tl.fromTo('.spread--2',
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
    6.4
  )

  // 7–9 : Spread 2 content staggers in
  tl.from('.spread--2 .p-item', {
    opacity: 0,
    y: 14,
    stagger: 0.55,
    duration: 0.5,
    ease: 'power2.out'
  }, 7)
}

function setupScrollReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 45,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%' }
    })
  })

  // Verse section: parallax scale
  gsap.from('.verse-huge', {
    scale: 0.92,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.verse-section', start: 'top 75%' }
  })
}
</script>

<template>
  <div ref="root">

    <!-- ══════════════════════════════════════
         HERO — 3 couches de profondeur
    ══════════════════════════════════════ -->
    <section class="hero">

      <!-- Couche 1 : lueur radiale ambrée -->
      <div class="hero__glow" aria-hidden="true" />

      <!-- Couche 2 : branche gauche (grande, lente) -->
      <div class="hero__branch hero__branch--left" aria-hidden="true">
        <svg viewBox="0 0 120 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M60 700 L60 0" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
          <ellipse cx="28" cy="100" rx="36" ry="13" transform="rotate(-42 28 100)" fill="currentColor" opacity="0.22"/>
          <ellipse cx="92" cy="190" rx="36" ry="13" transform="rotate(40 92 190)" fill="currentColor" opacity="0.2"/>
          <ellipse cx="26" cy="290" rx="36" ry="13" transform="rotate(-38 26 290)" fill="currentColor" opacity="0.18"/>
          <ellipse cx="94" cy="390" rx="36" ry="13" transform="rotate(42 94 390)" fill="currentColor" opacity="0.16"/>
          <ellipse cx="28" cy="490" rx="36" ry="13" transform="rotate(-40 28 490)" fill="currentColor" opacity="0.13"/>
          <ellipse cx="92" cy="590" rx="36" ry="13" transform="rotate(38 92 590)" fill="currentColor" opacity="0.10"/>
        </svg>
      </div>

      <!-- Couche 3 : grain texture -->
      <div class="hero__grain" aria-hidden="true" />

      <!-- Couche 4 : contenu -->
      <div class="hero__content container">
        <span class="hero__eyebrow eyebrow">Chaque jour, une nouvelle grâce</span>

        <h1 class="hero__title">
          <span class="title-row">
            <span class="title-row__inner">
              <span v-for="(char, i) in line1Chars" :key="i" class="char">{{ char }}</span>
            </span>
          </span>
          <span class="title-row title-row--italic">
            <span class="title-row__inner">
              <em class="title-em">vivez avec foi.</em>
            </span>
          </span>
        </h1>

        <p class="hero__sub">
          Le planner qui accompagne votre chemin spirituel —<br>
          au quotidien, au fil des mois, pour toute une année.
        </p>

        <div class="hero__actions">
          <NuxtLink to="/boutique" class="btn btn-outline-light">Commander mannaeden</NuxtLink>
          <NuxtLink to="/planner" class="hero__ghost">
            Découvrir le planner <span class="ghost-arrow">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Couche 5 : branche droite (petite, rapide) -->
      <div class="hero__branch hero__branch--right" aria-hidden="true">
        <svg viewBox="0 0 80 420" fill="none">
          <path d="M40 420 L40 0" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
          <ellipse cx="18" cy="60" rx="22" ry="8" transform="rotate(-38 18 60)" fill="currentColor" opacity="0.14"/>
          <ellipse cx="62" cy="130" rx="22" ry="8" transform="rotate(36 62 130)" fill="currentColor" opacity="0.12"/>
          <ellipse cx="18" cy="210" rx="22" ry="8" transform="rotate(-40 18 210)" fill="currentColor" opacity="0.10"/>
          <ellipse cx="62" cy="290" rx="22" ry="8" transform="rotate(38 62 290)" fill="currentColor" opacity="0.08"/>
          <ellipse cx="18" cy="370" rx="22" ry="8" transform="rotate(-35 18 370)" fill="currentColor" opacity="0.06"/>
        </svg>
      </div>

      <!-- Scroll indicator -->
      <div class="hero__scroll" aria-hidden="true">
        <span>Défiler</span>
        <div class="hero__scroll-line" />
      </div>
    </section>


    <!-- ══════════════════════════════════════
         BOOK — La couverture s'ouvre
    ══════════════════════════════════════ -->
    <section class="book-section">

      <!-- Cover gauche -->
      <div class="book-cover book-cover--left">
        <div class="cover-botanical" aria-hidden="true">
          <svg viewBox="0 0 100 500" fill="none">
            <path d="M50 500 L50 0" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
            <ellipse cx="26" cy="80" rx="28" ry="10" transform="rotate(-40 26 80)" fill="currentColor" opacity="0.2"/>
            <ellipse cx="74" cy="160" rx="28" ry="10" transform="rotate(38 74 160)" fill="currentColor" opacity="0.18"/>
            <ellipse cx="26" cy="250" rx="28" ry="10" transform="rotate(-36 26 250)" fill="currentColor" opacity="0.15"/>
            <ellipse cx="74" cy="340" rx="28" ry="10" transform="rotate(40 74 340)" fill="currentColor" opacity="0.12"/>
            <ellipse cx="26" cy="430" rx="28" ry="10" transform="rotate(-38 26 430)" fill="currentColor" opacity="0.09"/>
          </svg>
        </div>
        <div class="cover-label">
          <span class="cover-brand">mannaeden</span>
          <span class="cover-year">le planner · 2025</span>
        </div>
      </div>

      <!-- Cover droite -->
      <div class="book-cover book-cover--right">
        <div class="cover-botanical cover-botanical--flip" aria-hidden="true">
          <svg viewBox="0 0 100 500" fill="none">
            <path d="M50 500 L50 0" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
            <ellipse cx="74" cy="80" rx="28" ry="10" transform="rotate(40 74 80)" fill="currentColor" opacity="0.2"/>
            <ellipse cx="26" cy="160" rx="28" ry="10" transform="rotate(-38 26 160)" fill="currentColor" opacity="0.18"/>
            <ellipse cx="74" cy="250" rx="28" ry="10" transform="rotate(36 74 250)" fill="currentColor" opacity="0.15"/>
            <ellipse cx="26" cy="340" rx="28" ry="10" transform="rotate(-40 26 340)" fill="currentColor" opacity="0.12"/>
            <ellipse cx="74" cy="430" rx="28" ry="10" transform="rotate(38 74 430)" fill="currentColor" opacity="0.09"/>
          </svg>
        </div>
        <div class="cover-label cover-label--right">
          <span class="cover-subtitle">Un planner pour votre vie intérieure</span>
        </div>
      </div>

      <!-- Pages intérieures (révélées sous les couvertures) -->
      <div class="book-pages">
        <div class="book-spine" />

        <!-- Spread 1 : La vision -->
        <div class="spread spread--1">
          <div class="book-page book-page--left">
            <span class="page-num">1</span>
            <span class="page-chapter">Chapitre I</span>
            <h2 class="page-title p-item">La vision</h2>
            <hr class="page-rule p-item">
            <p class="page-body p-item">
              Dans l'Exode, la manne tombait chaque matin — fraîche, suffisante, renouvelée.
              <em>mannaeden</em> s'inspire de cette image&nbsp;: nourrir votre vie intérieure,
              un jour à la fois.
            </p>
            <p class="page-body p-item">
              Un planner ancré dans la foi, mais ouvert à tous — croyants de longue date,
              curieux de la foi, ou simplement en chemin vers quelque chose de plus grand.
            </p>
          </div>
          <div class="book-page book-page--right">
            <span class="page-num">2</span>
            <div class="page-verse-wrap">
              <div class="page-verse-deco" aria-hidden="true">✦</div>
              <p class="page-verse p-item">
                « Les bontés de l'Éternel ne sont pas épuisées,
                ses compassions ne sont pas à leur terme.
                Elles se renouvellent chaque matin. »
              </p>
              <span class="page-verse-ref p-item">Lamentations 3 : 22-23</span>
            </div>
          </div>
        </div>

        <!-- Spread 2 : Ce qui vous attend -->
        <div class="spread spread--2">
          <div class="book-page book-page--left">
            <span class="page-num">3</span>
            <span class="page-chapter">Chapitre II</span>
            <h2 class="page-title p-item">Ce qui vous attend</h2>
            <hr class="page-rule p-item">
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
            <hr class="page-rule p-item">
            <p class="page-body p-item">
              Pas de jargon. Pas de performance spirituelle. Juste de l'espace
              pour grandir, un jour à la fois.
            </p>
            <NuxtLink to="/boutique" class="btn btn-primary page-cta p-item">
              Commander mannaeden →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Hint de scroll -->
      <div class="book-hint" aria-hidden="true">
        <span>Faites défiler pour découvrir</span>
        <div class="book-hint__line" />
      </div>
    </section>


    <!-- ══════════════════════════════════════
         VERSE — Plein écran, verset massif
    ══════════════════════════════════════ -->
    <section class="verse-section section--deep">
      <div class="container--narrow verse-inner">
        <p class="verse-huge">
          « Remets ton sort<br>à l'Éternel,
          mets en lui<br><em>ta confiance,</em>
          et il agira. »
        </p>
        <p class="verse-ref verse-ref--light">Psaume 37 : 5</p>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         PREVIEW — Éditorial
    ══════════════════════════════════════ -->
    <section class="section preview-editorial">
      <div class="container">
        <div class="editorial-grid" data-reveal>

          <div class="editorial-img">
            <div class="editorial-placeholder">
              <svg class="editorial-leaf" viewBox="0 0 180 300" fill="none">
                <path d="M90 300 L90 0" stroke="currentColor" stroke-width="0.6" opacity="0.35"/>
                <ellipse cx="48" cy="65" rx="46" ry="16" transform="rotate(-37 48 65)" fill="currentColor" opacity="0.16"/>
                <ellipse cx="132" cy="135" rx="46" ry="16" transform="rotate(37 132 135)" fill="currentColor" opacity="0.14"/>
                <ellipse cx="48" cy="210" rx="46" ry="16" transform="rotate(-34 48 210)" fill="currentColor" opacity="0.11"/>
                <ellipse cx="132" cy="275" rx="46" ry="16" transform="rotate(35 132 275)" fill="currentColor" opacity="0.09"/>
              </svg>
              <div class="editorial-placeholder__text">
                <span>mannaeden</span>
                <span class="editorial-placeholder__sub">le planner</span>
              </div>
            </div>
          </div>

          <div class="editorial-text">
            <span class="eyebrow">Le planner physique</span>
            <h2 class="editorial-title">Un objet fait pour durer toute une année.</h2>
            <div class="divider" />
            <p class="editorial-body">
              Papier épais, reliure solide, couverture soignée — chaque détail est pensé
              pour que mannaeden devienne le compagnon de votre bureau, de votre table de nuit,
              de votre sac.
            </p>
            <p class="editorial-body editorial-body--verse">
              <em>« Là où est votre trésor, là aussi sera votre cœur. »</em><br>
              <span class="verse-ref" style="display: inline-block; margin-top: 0.3rem">Matthieu 6 : 21</span>
            </p>
            <div class="editorial-actions">
              <NuxtLink to="/boutique" class="btn btn-primary">Commander</NuxtLink>
              <NuxtLink to="/planner" class="editorial-link">Tout voir sur le planner →</NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         CTA FINAL
    ══════════════════════════════════════ -->
    <section class="cta-final section--deep">
      <div class="container--narrow" data-reveal>
        <span class="eyebrow cta-eyebrow">Prêt à commencer ?</span>
        <h2 class="cta-title">Un nouveau chapitre commence ici.</h2>
        <p class="cta-verse">
          « Je suis venu afin que vous ayez la vie, et que vous l'ayez en abondance. »
          <br><span class="verse-ref" style="display: inline-block; margin-top: 0.4rem">Jean 10 : 10</span>
        </p>
        <div class="cta-actions">
          <NuxtLink to="/boutique" class="btn btn-outline-light">Commander mannaeden</NuxtLink>
          <NuxtLink to="/planner" class="cta-ghost">Découvrir le planner →</NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 100dvh;
  background-color: #1a2e1a;
  background-image:
    radial-gradient(ellipse 72% 62% at 36% 48%, rgba(184, 150, 46, 0.13) 0%, transparent 65%),
    radial-gradient(ellipse 50% 45% at 82% 78%, rgba(20, 40, 20, 0.7) 0%, transparent 60%);
  color: var(--color-accent-contrast);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Lueur ambrée */
.hero__glow {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    ellipse 55% 45% at 38% 50%,
    rgba(184, 150, 46, 0.09) 0%,
    transparent 70%
  );
  pointer-events: none;
  will-change: transform;
}

/* Grain texture */
.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 10;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.07;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* Branches */
.hero__branch {
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  will-change: transform;
}

.hero__branch--left {
  left: -2%;
  width: 200px;
  z-index: 2;
  color: rgba(245, 240, 232, 0.95);
}

.hero__branch--right {
  right: 4%;
  width: 130px;
  z-index: 6;
  color: rgba(245, 240, 232, 0.7);
}

.hero__branch svg {
  width: 100%;
  height: 100%;
}

/* Content */
.hero__content {
  position: relative;
  z-index: 5;
  padding-top: 8rem;
  padding-bottom: 5rem;
}

.hero__eyebrow {
  color: rgba(184, 150, 46, 0.8);
}

/* Title split-text */
.hero__title {
  font-size: clamp(2.4rem, 5.2vw, 5.8rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin-top: 1.2rem;
  font-weight: 600;
}

.title-row {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}

.title-row__inner {
  display: block;
}

.char {
  display: inline-block;
  will-change: transform;
}

.title-row--italic {
  margin-top: 0.04em;
}

.title-em {
  display: inline-block;
  font-style: italic;
  color: rgba(245, 240, 232, 0.52);
  will-change: transform;
}

.hero__sub {
  margin-top: 1.8rem;
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  color: rgba(245, 240, 232, 0.52);
  line-height: 1.8;
  max-width: 480px;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 2.25rem;
  margin-top: 2.75rem;
  flex-wrap: wrap;
}

.hero__ghost {
  font-size: 0.875rem;
  color: rgba(245, 240, 232, 0.42);
  transition: color 0.2s;
}

.hero__ghost:hover { color: rgba(245, 240, 232, 0.85); }

.ghost-arrow {
  display: inline-block;
  transition: transform 0.2s;
}

.hero__ghost:hover .ghost-arrow { transform: translateX(5px); }

/* Scroll indicator */
.hero__scroll {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.25);
  z-index: 5;
}

.hero__scroll-line {
  width: 1px;
  height: 44px;
  background: rgba(245, 240, 232, 0.18);
  animation: scroll-pulse 2.4s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.18; transform: scaleY(1); }
  50% { opacity: 0.55; transform: scaleY(0.6); }
}


/* ══════════════════════════════════════
   BOOK SECTION
══════════════════════════════════════ */
.book-section {
  position: relative;
  height: 100vh;
  background: #f0e9d8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1600px;
}

/* Covers */
.book-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background: #1e3220;
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
  box-shadow: 12px 0 50px rgba(0, 0, 0, 0.35), 4px 0 12px rgba(0, 0, 0, 0.2);
}

.book-cover--right {
  right: 0;
  transform-origin: left center;
  box-shadow: -12px 0 50px rgba(0, 0, 0, 0.35), -4px 0 12px rgba(0, 0, 0, 0.2);
}

.cover-botanical {
  position: absolute;
  inset: 0;
  color: rgba(245, 240, 232, 0.9);
}

.cover-botanical svg { width: 100%; height: 100%; }

.cover-botanical--flip { transform: scaleX(-1); }

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
  color: rgba(245, 240, 232, 0.82);
}

.cover-year {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.35);
}

.cover-label--right { align-items: center; }

.cover-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.85rem, 1.5vw, 1.1rem);
  color: rgba(245, 240, 232, 0.4);
  max-width: 180px;
  text-align: center;
  line-height: 1.5;
}

/* Book pages */
.book-pages {
  position: relative;
  width: min(820px, 88vw);
  height: min(520px, 58vh);
  background: #faf4e8;
  border-radius: 1px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 24px 64px rgba(0, 0, 0, 0.12),
    0 48px 100px rgba(0, 0, 0, 0.08);
  z-index: 5;
  overflow: hidden;
}

.book-spine {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  transform: translateX(-50%);
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.12),
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.05) 60%,
    rgba(0, 0, 0, 0.12)
  );
  z-index: 2;
}

/* Spreads */
.spread {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.book-page {
  padding: clamp(1.5rem, 3vw, 2.75rem);
  position: relative;
  overflow: hidden;
}

.book-page--left {
  box-shadow: inset -10px 0 20px -10px rgba(0, 0, 0, 0.08);
}

.book-page--right {
  box-shadow: inset 10px 0 20px -10px rgba(0, 0, 0, 0.08);
}

.page-num {
  position: absolute;
  bottom: 1.25rem;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: rgba(107, 99, 85, 0.35);
  letter-spacing: 0.06em;
}

.book-page--left .page-num { left: clamp(1.5rem, 3vw, 2.75rem); }
.book-page--right .page-num { right: clamp(1.5rem, 3vw, 2.75rem); }

.page-chapter {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.page-title {
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 2.5vw, 1.9rem);
  font-weight: 600;
  color: #1c1a14;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.page-title-sm {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 600;
  color: #1c1a14;
  line-height: 1.15;
  margin: 0.5rem 0 1rem;
}

.page-rule {
  border: none;
  border-top: 1px solid rgba(184, 150, 46, 0.35);
  margin-bottom: 1.1rem;
}

.page-body {
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  color: #5a5448;
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

.page-body em {
  font-family: var(--font-serif);
  font-style: italic;
  color: #3d5c3d;
}

/* Verse right page */
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

.page-verse-deco {
  font-size: 1.5rem;
  color: rgba(184, 150, 46, 0.4);
}

.page-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: #3d5030;
  line-height: 1.65;
}

.page-verse-ref {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #8a7e6a;
}

/* Features list */
.page-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.5rem;
}

.page-features li {
  font-size: clamp(0.78rem, 1.2vw, 0.88rem);
  color: #4a4438;
  line-height: 1.5;
}

/* CTA in page */
.page-cta {
  margin-top: 1.5rem;
  font-size: 0.82rem;
  padding: 0.65rem 1.25rem;
}

/* Book hint */
.book-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(107, 99, 85, 0.45);
  z-index: 20;
}

.book-hint__line {
  width: 1px;
  height: 36px;
  background: rgba(107, 99, 85, 0.25);
  animation: scroll-pulse 2.2s ease-in-out infinite;
}


/* ══════════════════════════════════════
   VERSE SECTION
══════════════════════════════════════ */
.verse-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.verse-inner {
  text-align: center;
  padding-block: 5rem;
}

.verse-huge {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.8rem, 4.5vw, 3.8rem);
  line-height: 1.4;
  color: rgba(184, 150, 46, 0.85);
  will-change: transform, opacity;
}

.verse-huge em {
  font-style: italic;
  color: rgba(184, 150, 46, 0.55);
}

.verse-ref--light {
  color: rgba(245, 240, 232, 0.3);
  margin-top: 1.25rem;
  letter-spacing: 0.1em;
}


/* ══════════════════════════════════════
   EDITORIAL PREVIEW
══════════════════════════════════════ */
.preview-editorial {
  background: var(--color-bg);
}

.editorial-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 5.5rem;
  align-items: center;
}

.editorial-img {
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  position: sticky;
  top: 100px;
}

.editorial-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-green);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  position: relative;
}

.editorial-leaf {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: rgba(245, 240, 232, 0.85);
}

.editorial-placeholder__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.editorial-placeholder__text span:first-child {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(245, 240, 232, 0.78);
}

.editorial-placeholder__sub {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.35);
}

.editorial-title {
  font-size: clamp(1.7rem, 3vw, 2.6rem);
  font-weight: 600;
  margin-top: 0.75rem;
  line-height: 1.1;
}

.editorial-body {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.78;
  margin-top: 1rem;
}

.editorial-body--verse {
  padding-left: 1.25rem;
  border-left: 2px solid rgba(184, 150, 46, 0.35);
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--color-text);
  margin-top: 1.5rem;
}

.editorial-actions {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin-top: 2.25rem;
  flex-wrap: wrap;
}

.editorial-link {
  font-size: 0.875rem;
  color: var(--color-green);
  font-weight: 500;
  transition: gap 0.2s;
}

.editorial-link:hover { text-decoration: underline; }


/* ══════════════════════════════════════
   CTA FINAL
══════════════════════════════════════ */
.cta-final {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.cta-final .container--narrow {
  text-align: center;
  padding-block: 5rem;
}

.cta-eyebrow { color: rgba(184, 150, 46, 0.7); }

.cta-title {
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  font-weight: 600;
  color: var(--color-accent-contrast);
  margin-top: 0.75rem;
}

.cta-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: rgba(245, 240, 232, 0.38);
  margin-top: 1.75rem;
  line-height: 1.65;
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.75rem;
  flex-wrap: wrap;
}

.cta-ghost {
  font-size: 0.875rem;
  color: rgba(245, 240, 232, 0.35);
  transition: color 0.2s;
}

.cta-ghost:hover { color: rgba(245, 240, 232, 0.7); }


/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */
@media (max-width: 900px) {
  .editorial-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .editorial-img {
    position: static;
    aspect-ratio: 4 / 3;
    max-width: 380px;
    margin-inline: auto;
  }

  .book-pages {
    width: 92vw;
    height: 52vh;
  }

  .page-title { font-size: 1.2rem; }
  .page-body { font-size: 0.78rem; }
}

@media (max-width: 600px) {
  .hero__branch--left { width: 140px; left: -5%; }
  .hero__branch--right { display: none; }

  .book-pages {
    width: 96vw;
    height: auto;
    min-height: 480px;
  }

  .spread {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .book-page--left {
    box-shadow: none;
    border-bottom: 1px solid rgba(184, 150, 46, 0.15);
  }

  .page-verse-wrap { min-height: 220px; }
}
</style>
