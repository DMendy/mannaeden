<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({ layout: 'full' })

onMounted(() => {
  gsap.timeline({ delay: 0.2 })
    .from('.annulee-icon', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
    .from('.annulee-title', { opacity: 0, y: 30, duration: 0.7 }, '-=0.2')
    .from('.annulee-verse', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.annulee-body', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
})
</script>

<template>
  <div class="annulee-root">

    <section class="annulee-section">
      <div class="container--narrow annulee-inner">

        <div class="annulee-icon">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5"/>
            <path d="M32 20 L32 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="32" cy="42" r="1.5" fill="currentColor"/>
          </svg>
        </div>

        <h1 class="annulee-title">Paiement non complété.</h1>

        <div class="annulee-verse">
          <p class="verse-text">
            « Ne soyez pas anxieux de quoi que ce soit ; mais en toutes choses, faites connaître vos requêtes à Dieu. »
          </p>
          <p class="verse-ref">Philippiens 4 : 6</p>
        </div>

        <div class="annulee-body">
          <p class="annulee-message">
            Votre commande n'a pas été finalisée. Rien n'a été débité. Vous pouvez réessayer à tout moment — mannaeden vous attend.
          </p>

          <div class="annulee-actions">
            <NuxtLink to="/panier" class="btn btn-primary">Réessayer →</NuxtLink>
            <NuxtLink to="/boutique" class="btn btn-outline">Retour à la boutique</NuxtLink>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.annulee-root {
  background: var(--color-bg-alt);
  min-height: 100dvh;
  display: flex;
  align-items: center;
}

.annulee-section {
  width: 100%;
  padding-block: 8rem;
}

.annulee-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.annulee-icon {
  width: 64px;
  height: 64px;
  color: var(--color-muted);
}

.annulee-icon svg { width: 100%; height: 100%; }

.annulee-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
}

.annulee-verse {
  padding: 1.5rem 2rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  max-width: 480px;
}

.annulee-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.annulee-message {
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.75;
  max-width: 440px;
}

.annulee-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
