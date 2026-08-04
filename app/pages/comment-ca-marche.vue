<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: 'full' })

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.timeline({ delay: 0.15 })
      .from('.ccm-hero__eyebrow', { opacity: 0, y: 12, duration: 0.55 })
      .from('.ccm-hero__title', { opacity: 0, y: 55, duration: 1.1, ease: 'power4.out' }, '-=0.25')
      .from('.ccm-hero__sub', { opacity: 0, y: 22, duration: 0.7 }, '-=0.5')

    // Steps with stagger
    gsap.utils.toArray<HTMLElement>('.step').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        x: i % 2 === 0 ? -40 : 40,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      })
    })
  }, root.value!)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="root">

    <!-- ══ HERO ══ -->
    <section class="ccm-hero section--alt">
      <div class="container ccm-hero__inner">
        <span class="ccm-hero__eyebrow eyebrow">Comment ça marche</span>
        <h1 class="ccm-hero__title">Votre journée,<br><em>réinventée.</em></h1>
        <p class="ccm-hero__sub">Pas de règle rigide. Pas de performance spirituelle. Juste un cadre bienveillant pour vous aider à vous retrouver chaque matin.</p>
      </div>
    </section>

    <!-- ══ STEPS ══ -->
    <section class="section">
      <div class="container">
        <div class="steps-intro" data-reveal>
          <span class="eyebrow">Le chemin, étape par étape</span>
          <h2 class="section-title">Un rythme simple, tous les jours.</h2>
        </div>

        <div class="steps">
          <div class="step step--left">
            <div class="step__num">01</div>
            <div class="step__content">
              <h3>Ancrez votre matin</h3>
              <p>Avant même de regarder votre téléphone, ouvrez mannaeden. Une page du matin vous attend — un espace pour poser vos intentions, noter ce pour quoi vous êtes reconnaissant·e, et accueillir la journée avec paix.</p>
              <div class="step__verse">
                <span class="verse-text" style="font-size: 1rem">« Dès l'aurore, je te cherche. »</span>
                <span class="verse-ref">Psaume 63 : 2</span>
              </div>
            </div>
            <div class="step__visual">
              <div class="step__mock step__mock--light">
                <div class="mock-line" />
                <div class="mock-line mock-line--short" />
                <div class="mock-line" />
                <div class="mock-block" />
              </div>
            </div>
          </div>

          <div class="step step--right">
            <div class="step__visual">
              <div class="step__mock step__mock--green">
                <div class="mock-verse">
                  <span>« Ta parole est</span>
                  <span>une lampe à mes pieds »</span>
                </div>
              </div>
            </div>
            <div class="step__num">02</div>
            <div class="step__content">
              <h3>Méditez le verset de la semaine</h3>
              <p>Chaque semaine, un verset vous est proposé. Vous pouvez le recopier, le mémoriser, griffonner vos réflexions autour. La Parole s'installe doucement, sans effort forcé.</p>
            </div>
          </div>

          <div class="step step--left">
            <div class="step__num">03</div>
            <div class="step__content">
              <h3>Planifiez avec intention</h3>
              <p>Vos tâches, rendez-vous et priorités trouvent leur place dans un format clair. Pas une liste oppressante — une invitation à choisir ce qui compte vraiment, à la lumière de votre chemin intérieur.</p>
            </div>
            <div class="step__visual">
              <div class="step__mock step__mock--light">
                <div class="mock-tasks">
                  <div class="mock-task"><div class="mock-check" /><div class="mock-line" /></div>
                  <div class="mock-task"><div class="mock-check" /><div class="mock-line mock-line--short" /></div>
                  <div class="mock-task"><div class="mock-check" /><div class="mock-line" /></div>
                </div>
              </div>
            </div>
          </div>

          <div class="step step--right">
            <div class="step__visual">
              <div class="step__mock step__mock--alt">
                <div class="mock-grid">
                  <div v-for="n in 12" :key="n" class="mock-cell" :class="{ 'mock-cell--filled': n <= 7 }" />
                </div>
              </div>
            </div>
            <div class="step__num">04</div>
            <div class="step__content">
              <h3>Tracez votre mois et votre année</h3>
              <p>Les trackers mensuels et le bilan annuel vous permettent de prendre du recul. Vous observez votre chemin, vous célébrez les réponses à vos prières, vous identifiez ce qui vous fait grandir.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ VERSE ══ -->
    <section class="section section--alt" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <p class="verse-text">« Remets ton sort à l'Éternel, mets en lui ta confiance, et il agira. »</p>
        <p class="verse-ref">Psaume 37 : 5</p>
      </div>
    </section>

    <!-- ══ FAQ ══ -->
    <section class="section">
      <div class="container">
        <div class="faq-intro" data-reveal>
          <span class="eyebrow">Questions fréquentes</span>
          <h2 class="section-title">Ce qu'on nous demande souvent.</h2>
        </div>
        <div class="faq-list" data-stagger>
          <div class="faq-item">
            <h4>Est-ce que je dois être chrétien·ne pour utiliser mannaeden ?</h4>
            <p>Non. Le planner est pensé pour accompagner toutes les personnes qui souhaitent explorer une vie plus intentionnelle et spirituelle, quel que soit leur niveau de proximité avec la foi.</p>
          </div>
          <div class="faq-item">
            <h4>Combien de temps faut-il y consacrer chaque jour ?</h4>
            <p>15 à 20 minutes le matin suffisent pour une utilisation complète. Mais vous pouvez y passer autant de temps que vous le souhaitez — il n'y a pas de mauvaise façon de l'utiliser.</p>
          </div>
          <div class="faq-item">
            <h4>Et si je rate des jours ?</h4>
            <p>Le planner n'est pas daté. Vous pouvez reprendre à n'importe quel moment, sans culpabilité. La grâce s'applique aussi à vos habitudes.</p>
          </div>
          <div class="faq-item">
            <h4>Quelle est la taille du planner ?</h4>
            <p>Format A5 (148 × 210 mm) — compact pour le transporter, suffisamment grand pour écrire confortablement. Les détails complets sont disponibles sur la page boutique.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="section section--deep" style="text-align: center">
      <div class="container--narrow" data-reveal>
        <h2 class="section-title" style="color: var(--color-accent-contrast)">Prêt à essayer ?</h2>
        <p style="color: rgba(245,240,232,0.6); margin-top: 1rem">Un seul planner. Une année entière. Un chemin qui commence ici.</p>
        <div style="display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; margin-top: 2.5rem">
          <NuxtLink to="/boutique" class="btn btn-outline-light">Commander mannaeden</NuxtLink>
          <NuxtLink to="/planner" class="btn" style="background: transparent; color: rgba(245,240,232,0.45); padding: 0.85rem 1.5rem">
            Voir le planner →
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.ccm-hero {
  padding-block: 10rem 7rem;
  text-align: center;
}

.ccm-hero__eyebrow { color: var(--color-gold); }

.ccm-hero__title {
  font-size: clamp(2.8rem, 5.5vw, 4.8rem);
  font-weight: 600;
  margin-top: 1rem;
  line-height: 1.07;
}

.ccm-hero__title em {
  font-style: italic;
  color: var(--color-muted);
}

.ccm-hero__sub {
  font-size: 1.05rem;
  color: var(--color-muted);
  margin-top: 1.5rem;
  max-width: 520px;
  margin-inline: auto;
  line-height: 1.75;
}

/* STEPS */
.steps-intro {
  text-align: center;
  margin-bottom: 5rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.step {
  display: grid;
  align-items: center;
  gap: 4rem;
}

.step--left { grid-template-columns: auto 1fr auto; }
.step--right { grid-template-columns: auto auto 1fr; }

.step__num {
  font-family: var(--font-serif);
  font-size: 5rem;
  font-weight: 300;
  color: var(--color-border);
  line-height: 1;
  width: 80px;
  flex-shrink: 0;
}

.step__content h3 {
  font-size: 1.65rem;
  margin-bottom: 1rem;
}

.step__content p {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.75;
  max-width: 440px;
}

.step__verse {
  margin-top: 1.25rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-gold);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.step__visual { flex-shrink: 0; }

.step__mock {
  width: 180px;
  height: 220px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.5rem;
}

.step__mock--light {
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow);
}

.step__mock--green {
  background: var(--color-green);
  color: var(--color-accent-contrast);
}

.step__mock--alt {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.mock-line {
  height: 2px;
  width: 100%;
  background: var(--color-border);
  border-radius: 2px;
}

.mock-line--short { width: 65%; }

.mock-block {
  height: 40px;
  width: 100%;
  background: var(--color-bg-alt);
  border-radius: 6px;
  margin-top: 0.5rem;
}

.mock-verse {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.8rem;
  color: rgba(245, 240, 232, 0.75);
  line-height: 1.5;
}

.mock-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.mock-task {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.mock-check {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid var(--color-border);
  flex-shrink: 0;
}

.mock-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
}

.mock-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  background: var(--color-border);
}

.mock-cell--filled {
  background: var(--color-green);
  opacity: 0.6;
}

/* FAQ */
.faq-intro {
  text-align: center;
  margin-bottom: 3.5rem;
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  padding-block: 1.75rem;
  border-bottom: 1px solid var(--color-border);
}

.faq-item:first-child {
  border-top: 1px solid var(--color-border);
}

.faq-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.faq-item p {
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 1.72;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .step--left,
  .step--right {
    grid-template-columns: 1fr;
  }

  .step--right .step__visual { order: -1; }

  .step__num {
    font-size: 3.5rem;
    width: auto;
  }

  .step__mock { width: 100%; max-width: 260px; margin-inline: auto; }
}
</style>
