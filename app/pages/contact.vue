<script setup lang="ts">
definePageMeta({ layout: 'full' })

useSeoMeta({
  title: 'Contact — mannaeden',
  description: 'Une question sur le planner Graines de Foi ? Contactez-nous, nous répondons avec soin.',
  ogTitle: 'Contact — mannaeden',
  ogDescription: 'Une question sur le planner Graines de Foi ? Contactez-nous, nous répondons avec soin.',
  ogUrl: 'https://mannaeden.com/contact',
})

const config = useRuntimeConfig()
const form = reactive({ nom: '', email: '', message: '' })
const sent = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await $fetch('/contact', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { nom: form.nom, email: form.email, message: form.message },
    })
    sent.value = true
  } catch {
    error.value = 'Une erreur est survenue. Veuillez réessayer ou nous écrire directement.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-root">
    <section class="page-hero">
      <div class="container page-hero__content">
        <span class="eyebrow">Nous écrire</span>
        <h1 class="page-hero__title">Contact</h1>
        <p class="page-hero__sub">
          Une question sur le planner, une commande, un partenariat ?<br>
          Camille vous répond personnellement.
        </p>
      </div>
    </section>

    <section class="section--sm">
      <div class="container--narrow">
        <div v-if="sent" class="sent-state">
          <p class="sent-title">Message envoyé.</p>
          <p class="sent-sub">Merci pour votre message — Camille vous répondra dans les 48h.</p>
          <p class="sent-verse">
            <em>« Que votre parole soit toujours accompagnée de grâce. »</em>
            <span>Colossiens 4 : 6</span>
          </p>
        </div>

        <form v-else class="contact-form" @submit.prevent="handleSubmit">
          <div class="field">
            <label class="field-label" for="nom">Nom</label>
            <input id="nom" v-model="form.nom" class="field-input" type="text" required autocomplete="name" maxlength="100" />
          </div>
          <div class="field">
            <label class="field-label" for="email">E-mail</label>
            <input id="email" v-model="form.email" class="field-input" type="email" required autocomplete="email" maxlength="254" />
          </div>
          <div class="field">
            <label class="field-label" for="message">Message</label>
            <textarea id="message" v-model="form.message" class="field-input field-textarea" rows="6" required minlength="10" maxlength="2000" />
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Envoi...' : 'Envoyer →' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-root { background: var(--color-bg); min-height: 100dvh; }

.page-hero {
  padding-top: 9rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--color-border);
}

.page-hero__title {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.page-hero__sub {
  margin-top: 1rem;
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.75;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 3rem;
}

.field-textarea { resize: vertical; min-height: 140px; }

.sent-state {
  text-align: center;
  padding-block: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.sent-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-green-deep);
}

.sent-sub {
  font-size: 1rem;
  color: var(--color-muted);
}

.sent-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--color-green);
  margin-top: 1rem;
  line-height: 1.65;
  text-align: center;
}

.sent-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-top: 0.4rem;
}
</style>
