<script setup lang="ts">
definePageMeta({ layout: 'full' })

const valeurs = [
  {
    num: '01',
    titre: 'La foi au quotidien',
    corps: 'Nous croyons que la vie spirituelle n\'est pas réservée aux moments extraordinaires. Elle se vit dans le quotidien — une prière le matin, un verset dans la journée, un bilan le soir.',
    verset: '« Sois fort et courageux. »',
    ref: 'Josué 1 : 9'
  },
  {
    num: '02',
    titre: 'L\'intentionnalité',
    corps: 'Un planner n\'est pas un agenda comme les autres. Chaque page est pensée pour inviter à la réflexion, à la gratitude, à la prière — avec structure mais sans rigidité.',
    verset: '« Commets tes œuvres à l\'Éternel, et tes projets s\'affermiront. »',
    ref: 'Proverbes 16 : 3'
  },
  {
    num: '03',
    titre: 'L\'accessibilité',
    corps: 'mannaeden s\'adresse à tous — croyants de longue date, curieux de la foi, ou simplement en chemin. Pas de jargon, pas de performance. Juste de l\'espace.',
    verset: '« Venez à moi, vous tous qui êtes fatigués. »',
    ref: 'Matthieu 11 : 28'
  },
  {
    num: '04',
    titre: 'La beauté',
    corps: 'Nous pensons que le soin apporté à l\'objet reflète le soin apporté à ce qu\'il contient. Un beau planner invite à l\'ouvrir, chaque jour.',
    verset: '« Tout ce qui est vrai, honnête, juste — pensez à ces choses. »',
    ref: 'Philippiens 4 : 8'
  }
]
</script>

<template>
  <div class="page-root">
    <section class="page-hero">
      <div class="page-hero__photo">
        <img src="/IMG_2484.JPG" alt="Plantes, lumière naturelle" />
        <div class="page-hero__overlay" />
      </div>
      <div class="container page-hero__content">
        <span class="eyebrow" style="color: rgba(255,255,255,0.5)">Ce qui nous guide</span>
        <h1 class="page-hero__title">Nos valeurs</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="valeurs-grid">
          <div v-for="v in valeurs" :key="v.num" class="valeur-card">
            <span class="valeur-num">{{ v.num }}</span>
            <h2 class="valeur-titre">{{ v.titre }}</h2>
            <div class="divider" />
            <p class="valeur-corps">{{ v.corps }}</p>
            <p class="valeur-verset">
              <em>{{ v.verset }}</em>
              <span>{{ v.ref }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-root { background: var(--color-bg); }

.page-hero {
  position: relative;
  height: 55vh;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.page-hero__photo {
  position: absolute;
  inset: 0;
}

.page-hero__photo img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 20%;
}

.page-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(32,44,23,0.2) 0%, rgba(32,44,23,0.65) 100%);
}

.page-hero__content {
  position: relative;
  z-index: 2;
  padding-bottom: 3.5rem;
  color: #fff;
}

.page-hero__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  margin-top: 0.75rem;
}

.valeurs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem 5rem;
}

.valeur-card { display: flex; flex-direction: column; }

.valeur-num {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-border);
}

.valeur-titre {
  font-size: clamp(1.3rem, 2.2vw, 1.9rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.valeur-corps {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.8;
}

.valeur-verset {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--color-green);
  line-height: 1.6;
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-border);
}

.valeur-verset span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  color: var(--color-muted);
  margin-top: 0.3rem;
}

@media (max-width: 768px) {
  .valeurs-grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>
