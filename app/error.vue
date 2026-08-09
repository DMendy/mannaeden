<script setup lang="ts">
import { gsap } from 'gsap'

const props = defineProps<{ error: { statusCode: number; message?: string } }>()

onMounted(() => {
  gsap.timeline({ delay: 0.1 })
    .from('.err-num', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
    .from('.err-title', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.err-sub', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
    .from('.err-actions', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="err-root">
    <div class="err-bg" aria-hidden="true">
      <svg viewBox="0 0 200 400" fill="none" class="err-branch">
        <path d="M100 400 L100 0" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
        <ellipse cx="60" cy="80"  rx="44" ry="14" transform="rotate(-38 60 80)"  fill="currentColor" opacity="0.12"/>
        <ellipse cx="140" cy="160" rx="44" ry="14" transform="rotate(36 140 160)"  fill="currentColor" opacity="0.1"/>
        <ellipse cx="60" cy="250" rx="44" ry="14" transform="rotate(-34 60 250)"  fill="currentColor" opacity="0.08"/>
        <ellipse cx="140" cy="340" rx="44" ry="14" transform="rotate(32 140 340)"  fill="currentColor" opacity="0.07"/>
      </svg>
    </div>

    <main class="err-inner">
      <span class="err-eyebrow eyebrow">{{ error.statusCode === 404 ? 'Page introuvable' : 'Erreur' }}</span>
      <p class="err-num">{{ error.statusCode }}</p>
      <h1 class="err-title">
        {{ error.statusCode === 404
          ? 'Cette page n\'existe pas.'
          : 'Quelque chose s\'est mal passé.' }}
      </h1>
      <p class="err-sub">
        {{ error.statusCode === 404
          ? 'La page que vous cherchez a peut-être été déplacée ou supprimée.'
          : 'Une erreur inattendue est survenue. Essayez de revenir à l\'accueil.' }}
      </p>

      <p class="err-verse">
        <em>« Je suis le chemin, la vérité et la vie. »</em>
        <span>Jean 14 : 6</span>
      </p>

      <div class="err-actions">
        <button class="btn btn-primary" @click="handleError">Retour à l'accueil</button>
        <NuxtLink to="/contact" class="err-link">Nous contacter →</NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.err-root {
  min-height: 100dvh;
  background: var(--color-green-deep);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: var(--font-sans);
}

.err-bg {
  position: fixed;
  right: 5%;
  top: 0;
  bottom: 0;
  width: 200px;
  color: rgba(245, 240, 232, 0.8);
  pointer-events: none;
}

.err-branch { width: 100%; height: 100%; }

.err-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 4rem 1.5rem;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.err-eyebrow {
  color: rgba(255,255,255,0.4);
}

.err-num {
  font-family: var(--font-serif);
  font-size: clamp(6rem, 18vw, 12rem);
  font-weight: 700;
  line-height: 1;
  color: rgba(255,255,255,0.08);
  margin: -1rem 0;
  letter-spacing: -0.04em;
  user-select: none;
}

.err-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
}

.err-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.75;
  max-width: 420px;
}

.err-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.97rem;
  color: rgba(255,255,255,0.25);
  line-height: 1.65;
  margin-top: 0.5rem;
}

.err-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  margin-top: 0.3rem;
  color: rgba(255,255,255,0.15);
}

.err-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.err-link {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.45);
  transition: color 0.2s;
}

.err-link:hover { color: rgba(255,255,255,0.8); }
</style>
