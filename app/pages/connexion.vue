<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/compte'
    router.push(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Connexion impossible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <h1>Connexion</h1>
    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" required autocomplete="email" />
      </label>
      <label class="field">
        <span>Mot de passe</span>
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
    <p class="switch">
      Pas encore de compte ?
      <NuxtLink to="/inscription">Créer un compte</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.auth-page {
  max-width: 360px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-muted);
}

input {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-text);
}

.submit {
  margin-top: 0.5rem;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-size: 1rem;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.6;
  cursor: default;
}

.error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.switch {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-muted);
  text-align: center;
}
</style>
