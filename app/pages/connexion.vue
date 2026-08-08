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
   <div class="auth-wrapper">
    <div class="auth-page">
      <div class="auth-header">
        <span class="eyebrow">Mon compte</span>
        <h1 class="auth-title">Connexion</h1>
      </div>

      <form class="auth-form" @submit.prevent="onSubmit">
        <div class="field">
          <label class="field-label" for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            required
            autocomplete="email"
            placeholder="votre@email.com"
          />
        </div>

        <div class="field">
          <label class="field-label" for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="field-input"
            required
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button type="submit" class="btn btn-primary auth-submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Pas encore de compte ? <NuxtLink to="/inscription" class="auth-link">Créer un compte</NuxtLink></p>
        <NuxtLink to="/reinitialiser-mot-de-passe" class="auth-link auth-link--muted">Mot de passe oublié ?</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: calc(100dvh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.auth-page {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  margin-bottom: 2.5rem;
}

.auth-title {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-submit {
  width: 100%;
  justify-content: center;
  padding: 0.9rem;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.auth-footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: var(--color-muted);
}

.auth-link {
  color: var(--color-green);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-link--muted {
  color: var(--color-muted);
  font-weight: 400;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
