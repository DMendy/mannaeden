<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

const THEMES = [
  'Aimer et être aimé',
  'Avoir confiance en soi et en Dieu',
  'Place à la paix et à la joie',
  'Apprendre à être fidèle',
  'L\'importance du temps',
  'Tes projets méritent d\'être vécus',
  'Avoir de bonnes relations',
  'Entre bonté, bénignité et douceur',
  'Devenir patient',
  'Abandonner les mauvaises habitudes',
  'La persévérance amène au salut',
  'Voir Dieu achever son œuvre',
]

const FEATURES = [
  {
    num: '01',
    title: 'Plan journalier',
    body: 'Chaque jour dispose d\'un espace structuré : un verset à méditer, une prière liée au verset et un espace pour exprimer votre gratitude.',
  },
  {
    num: '02',
    title: 'Bilan de la semaine',
    body: 'À la fin de chaque semaine, vous pouvez revenir sur le bilan — pour une introspection personnelle et donner chaque semaine le meilleur de vous-même.',
  },
  {
    num: '03',
    title: 'Plan mensuel',
    body: 'Vue d\'ensemble concernant un thème précis donné chaque mois.',
  },
  {
    num: '04',
    title: 'Tracker de prière',
    body: 'Notez vos sujets de prière, vos demandes et les réponses que vous avez reçues.',
  },
  {
    num: '05',
    title: 'Pages d\'écriture libres',
    body: 'Des espaces blancs pour écrire, dessiner, coller… Votre foi s\'exprime comme elle le souhaite, sans règle ni format imposé.',
  },
]

const activeFeature = ref(0)

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.timeline({ delay: 0.15 })
      .from('.planner-hero__eyebrow', { opacity: 0, y: 12, duration: 0.55 })
      .from('.planner-hero__title', { opacity: 0, y: 55, duration: 1.1, ease: 'power4.out' }, '-=0.25')
      .from('.planner-hero__sub', { opacity: 0, y: 22, duration: 0.7 }, '-=0.5')

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach(container => {
      gsap.from(Array.from(container.children) as HTMLElement[], {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 85%' }
      })
    })
  }, root.value!)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="root">

    <!-- ══ HERO ══ -->
    <section class="planner-hero section--deep">
      <div class="container planner-hero__inner">
        <div class="planner-hero__text">
          <span class="planner-hero__eyebrow eyebrow">Le planner mannaeden</span>
          <h1 class="planner-hero__title">Un compagnon de vie,<br><em>pas un simple agenda.</em></h1>
          <p class="planner-hero__sub">Versets, prière, écriture, planification — tout ce dont votre vie spirituelle a besoin, réuni dans un seul objet pensé avec soin.</p>
          <NuxtLink to="/boutique" class="btn btn-outline-light" style="margin-top: 2rem">Commander →</NuxtLink>
        </div>
        <div class="planner-hero__img">
          <div class="planner-mock">
            <img src="/DSC03471.jpg" alt="Camille Gicquiaud avec le planner Graines de Foi" />
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CONTENU ══ -->
    <section class="section features-section">
      <div class="container">
        <div class="content-intro" data-reveal>
          <span class="eyebrow">Ce qui est à l'intérieur</span>
          <h2 class="section-title">Un planner complet, page après page.</h2>
        </div>

        <div class="features-interactive" data-reveal>
          <!-- Liste cliquable -->
          <ul class="features-nav" role="tablist">
            <li
              v-for="(f, i) in FEATURES"
              :key="f.num"
              class="features-nav-item"
              :class="{ 'features-nav-item--active': activeFeature === i }"
              role="tab"
              :aria-selected="activeFeature === i"
              tabindex="0"
              @click="activeFeature = i"
              @keydown.enter="activeFeature = i"
              @keydown.space.prevent="activeFeature = i"
            >
              <span class="features-nav-num">{{ f.num }}</span>
              <span class="features-nav-title">{{ f.title }}</span>
              <span class="features-nav-arrow" aria-hidden="true">→</span>
            </li>
          </ul>

          <!-- Panneau de contenu -->
          <div class="features-panel" role="tabpanel">
            <Transition name="feature-fade" mode="out-in">
              <div :key="activeFeature" class="features-panel-inner">
                <span class="features-panel-num">{{ FEATURES[activeFeature].num }}</span>
                <h3 class="features-panel-title">{{ FEATURES[activeFeature].title }}</h3>
                <div class="features-panel-divider" />
                <p class="features-panel-body">{{ FEATURES[activeFeature].body }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ VERSE ══ -->
    <section class="section section--deep" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <p class="verse-text">« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »</p>
        <p class="verse-ref" style="color: rgba(255,255,255,0.4)">Psaume 119 : 105</p>
      </div>
    </section>

    <!-- ══ 12 THÈMES ══ -->
    <section class="section" data-reveal>
      <div class="container">
        <div class="themes-intro">
          <span class="eyebrow" style="display:block;text-align:center">Les 12 thèmes du planner</span>
          <h2 class="section-title" style="text-align:center">Un programme, mois après mois.</h2>
          <p class="section-subtitle" style="text-align:center;max-width:560px;margin-inline:auto">Chaque mois explore un thème spirituel profond, accompagné de versets, de réflexions et d'exercices pratiques pour avancer concrètement.</p>
        </div>

        <div class="themes-grid" data-stagger>
          <div v-for="(theme, i) in THEMES" :key="i" class="theme-card">
            <span class="theme-card__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="theme-card__label">{{ theme }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ POUR QUI ══ -->
    <section class="section section--alt">
      <div class="container">
        <div class="for-who-grid" data-reveal>
          <div class="for-who-content">
            <span class="eyebrow">Pour qui ?</span>
            <h2 class="section-title">Fait pour vous, quel que soit votre chemin.</h2>
            <div class="divider" />
            <p class="section-subtitle">mannaeden n'exige rien de particulier. Pas besoin de connaître la Bible par cœur ou de prier depuis des années. Le planner est conçu pour accompagner toutes les étapes — la curiosité, le doute, la foi active ou la redécouverte.</p>
          </div>
          <div class="for-who-list" data-stagger>
            <div class="for-who-item">
              <div class="for-who-dot" />
              <span>Vous êtes chrétien·ne pratiquant·e et cherchez à structurer votre vie spirituelle.</span>
            </div>
            <div class="for-who-item">
              <div class="for-who-dot" />
              <span>Vous êtes curieux·se de la foi et souhaitez explorer sans pression.</span>
            </div>
            <div class="for-who-item">
              <div class="for-who-dot" />
              <span>Vous avez grandi dans la foi et cherchez à la raviver.</span>
            </div>
            <div class="for-who-item">
              <div class="for-who-dot" />
              <span>Vous planifiez déjà votre vie et souhaitez y intégrer une dimension spirituelle.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="section section--green" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <h2 class="section-title" style="color: var(--color-accent-contrast)">Prêt à commencer ce chemin ?</h2>
        <p style="color: rgba(245,240,232,0.6); margin-top: 1rem; font-size: 1rem">Un seul exemplaire. Une seule année. Une vie transformée, un jour à la fois.</p>
        <NuxtLink to="/boutique" class="btn btn-outline-light" style="margin-top: 2.5rem">Commander mannaeden</NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* HERO */
.planner-hero {
  background: var(--color-green-deep);
  color: var(--color-accent-contrast);
  padding-block: 9rem 7rem;
  padding-top: 10rem;
}

.planner-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.planner-hero__eyebrow { color: rgba(255,255,255,0.5); }

.planner-hero__title {
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  font-weight: 600;
  margin-top: 1rem;
  line-height: 1.08;
}

.planner-hero__title em {
  font-style: italic;
  color: rgba(245, 240, 232, 0.6);
}

.planner-hero__sub {
  margin-top: 1.5rem;
  font-size: 1.05rem;
  color: rgba(245, 240, 232, 0.6);
  line-height: 1.75;
}

.planner-mock {
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.planner-mock img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* FEATURES */
.content-intro {
  text-align: center;
  margin-bottom: 4rem;
}

.features-interactive {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

/* Nav list */
.features-nav {
  list-style: none;
  border-right: 1px solid var(--color-border);
}

.features-nav-item {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.4rem 1.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.18s;
  outline: none;
}

.features-nav-item:last-child { border-bottom: none; }

.features-nav-item:hover {
  background: rgba(53, 64, 40, 0.04);
}

.features-nav-item--active {
  background: var(--color-green-deep);
}

.features-nav-item--active:hover {
  background: var(--color-green-deep);
}

.features-nav-num {
  font-family: var(--font-serif);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  flex-shrink: 0;
  transition: color 0.18s;
}

.features-nav-item--active .features-nav-num {
  color: rgba(255,255,255,0.4);
}

.features-nav-title {
  flex: 1;
  font-size: 0.97rem;
  font-weight: 500;
  color: var(--color-text);
  transition: color 0.18s;
}

.features-nav-item--active .features-nav-title {
  color: #fff;
}

.features-nav-arrow {
  font-size: 0.9rem;
  color: var(--color-border);
  transition: color 0.18s, transform 0.2s;
}

.features-nav-item:hover .features-nav-arrow,
.features-nav-item--active .features-nav-arrow {
  color: rgba(255,255,255,0.5);
  transform: translateX(3px);
}

.features-nav-item:not(.features-nav-item--active) .features-nav-arrow {
  color: var(--color-border);
}

/* Panel */
.features-panel {
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
  min-height: 280px;
}

.features-panel-inner {
  width: 100%;
}

.features-panel-num {
  font-family: var(--font-serif);
  font-size: 3.5rem;
  font-weight: 300;
  color: var(--color-green-mid);
  line-height: 1;
  opacity: 0.4;
}

.features-panel-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.75rem;
  line-height: 1.2;
}

.features-panel-divider {
  width: 40px;
  height: 2px;
  background: var(--color-green-mid);
  margin: 1.25rem 0;
}

.features-panel-body {
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.85;
  max-width: 420px;
}

/* Transition */
.feature-fade-enter-active,
.feature-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.feature-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.feature-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* FOR WHO */
.for-who-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.for-who-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.for-who-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.for-who-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-green-mid);
  margin-top: 0.45rem;
}

.for-who-item span {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.65;
}

/* 12 THÈMES */
.themes-intro {
  margin-bottom: 3rem;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.theme-card {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.18s, box-shadow 0.18s;
}

.theme-card:hover {
  border-color: var(--color-green-mid);
  box-shadow: 0 4px 16px rgba(32, 44, 23, 0.08);
}

.theme-card__num {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--color-green-mid);
  line-height: 1;
}

.theme-card__label {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-text);
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .planner-hero__inner { grid-template-columns: 1fr; gap: 3rem; }
  .planner-hero { padding-top: 8rem; }
  .features-interactive { grid-template-columns: 1fr; }
  .features-nav { border-right: none; border-bottom: 1px solid var(--color-border); }
  .features-panel { min-height: auto; padding: 2rem 1.75rem; }
  .for-who-grid { grid-template-columns: 1fr; gap: 3rem; }
  .themes-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 600px) {
  .themes-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
