<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

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
    <section class="section">
      <div class="container">
        <div class="content-intro" data-reveal>
          <span class="eyebrow">Ce qui est à l'intérieur</span>
          <h2 class="section-title">Un planner complet, page après page.</h2>
        </div>
        <div class="features-grid" data-stagger>
          <div class="feature-card">
            <div class="feature-card__num">01</div>
            <h3>Plan journalier</h3>
            <p>Chaque jour dispose d'un espace structuré : intentions du matin, tâches prioritaires, espace de prière et réflexion du soir.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__num">02</div>
            <h3>Verset de la semaine</h3>
            <p>Un verset biblique guide chaque semaine — à méditer, copier, mémoriser. Une invitation à laisser la Parole infuser votre quotidien.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__num">03</div>
            <h3>Plan mensuel</h3>
            <p>Vue d'ensemble du mois avec objectifs, intentions et espace de bilan. Pour ne jamais perdre le fil de ce qui compte vraiment.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__num">04</div>
            <h3>Tracker de prière</h3>
            <p>Notez vos sujets de prière, vos demandes et les réponses que vous avez reçues. Un témoin de la fidélité de Dieu dans votre vie.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__num">05</div>
            <h3>Pages d'écriture libres</h3>
            <p>Des espaces blancs pour écrire, dessiner, coller — votre foi s'exprime comme elle le souhaite, sans règle ni format imposé.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__num">06</div>
            <h3>Bilan annuel</h3>
            <p>En début et fin d'année, des pages dédiées pour contempler le chemin parcouru et poser des intentions pour la saison à venir.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ VERSE ══ -->
    <section class="section section--alt" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <p class="verse-text">« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »</p>
        <p class="verse-ref">Psaume 119 : 105</p>
      </div>
    </section>

    <!-- ══ POUR QUI ══ -->
    <section class="section">
      <div class="container">
        <div class="for-who-grid" data-reveal>
          <div class="for-who-content">
            <span class="eyebrow">Pour qui ?</span>
            <h2 class="section-title">Fait pour vous, quel que soit votre chemin.</h2>
            <div class="divider" />
            <p class="section-subtitle">mannaeden n'exige rien de particulier. Pas besoin de connaître la Bible par cœur ou de prier depuis des années. Le planner est conçu pour accompagner toutes les étapes — la curiosité, le doute, la foi active, la redécouverte.</p>
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.feature-card__num {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  color: var(--color-green-mid);
  margin-bottom: 0.75rem;
  line-height: 1;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.feature-card p {
  font-size: 0.92rem;
  color: var(--color-muted);
  line-height: 1.72;
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
  background: var(--color-gold);
  margin-top: 0.45rem;
}

.for-who-item span {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.65;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .planner-hero__inner { grid-template-columns: 1fr; gap: 3rem; }
  .planner-hero { padding-top: 8rem; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .for-who-grid { grid-template-columns: 1fr; gap: 3rem; }
}

@media (max-width: 600px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
