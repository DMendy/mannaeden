<script setup lang="ts">
definePageMeta({ layout: 'full' })
</script>

<template>
  <div class="page-root">
    <section class="page-hero">
      <div class="page-hero__photo">
        <img src="/IMG_1922.jpg" alt="Feuilles vertes" />
        <div class="page-hero__overlay" />
      </div>
      <div class="container page-hero__content">
        <span class="eyebrow" style="color: rgba(255,255,255,0.5)">Notre histoire</span>
        <h1 class="page-hero__title">Qui sommes-nous ?</h1>
      </div>
    </section>

    <section class="section">
      <div class="container--narrow">
        <div class="about-content">
          <span class="eyebrow">mannaeden</span>
          <h2 class="about-title">Camille, fondatrice</h2>
          <div class="divider" />
          <p class="about-body">
            mannaeden est né d'une conviction simple : la foi mérite un espace concret dans nos vies.
            Pas seulement dans nos cœurs, mais sur nos bureaux, dans nos sacs, dans nos routines.
          </p>
          <p class="about-body">
            Inspiré de la manne dans l'Exode — cette nourriture quotidienne, fraîche et suffisante —
            le planner mannaeden invite chacun à nourrir sa vie intérieure, un jour à la fois.
          </p>
          <p class="about-verse">
            <em>« L'homme ne vivra pas de pain seulement, mais de toute parole qui sort de la bouche de Dieu. »</em>
            <span>Matthieu 4 : 4</span>
          </p>
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
  object-fit: cover; object-position: center 60%;
}

.page-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(32,44,23,0.3) 0%, rgba(32,44,23,0.7) 100%);
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

.about-content { display: flex; flex-direction: column; }

.about-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--color-green-deep);
}

.about-body {
  font-size: 1.05rem;
  color: var(--color-muted);
  line-height: 1.85;
  margin-bottom: 1.25rem;
}

.about-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--color-green);
  line-height: 1.65;
  padding: 1.5rem 2rem;
  border-left: 2px solid var(--color-border);
  margin-top: 1rem;
}

.about-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-top: 0.5rem;
}
</style>
