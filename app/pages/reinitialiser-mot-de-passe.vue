<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const config = useRuntimeConfig()
const route = useRoute()

const token = computed(() => route.query.token as string | undefined)

// Étape 1 — demande d'email
const email = ref('')
const sentEmail = ref(false)
const loadingForgot = ref(false)
const errorForgot = ref<string | null>(null)

async function handleForgot() {
  errorForgot.value = null
  loadingForgot.value = true
  try {
    await $fetch('/auth/forgot-password', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { email: email.value },
    })
    sentEmail.value = true
  } catch (err) {
    errorForgot.value = err instanceof Error ? err.message : 'Une erreur est survenue.'
  } finally {
    loadingForgot.value = false
  }
}

// Étape 2 — nouveau mot de passe
const newPassword = ref('')
const confirmPassword = ref('')
const resetDone = ref(false)
const loadingReset = ref(false)
const errorReset = ref<string | null>(null)

async function handleReset() {
  errorReset.value = null
  if (newPassword.value !== confirmPassword.value) {
    errorReset.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loadingReset.value = true
  try {
    await $fetch('/auth/reset-password', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { token: token.value, newPassword: newPassword.value },
    })
    resetDone.value = true
  } catch (err) {
    errorReset.value = err instanceof Error ? err.message : 'Lien invalide ou expiré.'
  } finally {
    loadingReset.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-page">

      <!-- ══ ÉTAPE 2 : nouveau mot de passe ══ -->
      <template v-if="token">
        <div class="auth-header">
          <span class="eyebrow">Sécurité</span>
          <h1 class="auth-title">Nouveau mot de passe</h1>
        </div>

        <div v-if="resetDone" class="done-state">
          <p class="done-title">Mot de passe mis à jour.</p>
          <p class="done-sub">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <NuxtLink to="/connexion" class="btn btn-primary" style="margin-top: 1.5rem; width: 100%; justify-content: center">
            Se connecter →
          </NuxtLink>
        </div>

        <form v-else class="auth-form" @submit.prevent="handleReset">
          <div class="field">
            <label class="field-label" for="new-password">Nouveau mot de passe</label>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              class="field-input"
              required
              minlength="8"
              maxlength="128"
              autocomplete="new-password"
              placeholder="8 caractères minimum"
            />
          </div>
          <div class="field">
            <label class="field-label" for="confirm-password">Confirmer le mot de passe</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              class="field-input"
              required
              minlength="8"
              maxlength="128"
              autocomplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <p v-if="errorReset" class="form-error">{{ errorReset }}</p>

          <button type="submit" class="btn btn-primary auth-submit" :disabled="loadingReset">
            {{ loadingReset ? 'Mise à jour...' : 'Enregistrer le mot de passe' }}
          </button>
        </form>
      </template>

      <!-- ══ ÉTAPE 1 : demande de réinitialisation ══ -->
      <template v-else>
        <div class="auth-header">
          <span class="eyebrow">Mot de passe oublié</span>
          <h1 class="auth-title">Réinitialisation</h1>
        </div>

        <div v-if="sentEmail" class="done-state">
          <p class="done-title">E-mail envoyé.</p>
          <p class="done-sub">Si un compte existe pour <strong>{{ email }}</strong>, vous recevrez un lien dans les prochaines minutes.</p>
          <p class="done-verse">
            <em>« Je connais les projets que j'ai formés sur vous. »</em>
            <span>Jérémie 29 : 11</span>
          </p>
        </div>

        <form v-else class="auth-form" @submit.prevent="handleForgot">
          <p class="auth-hint">Entrez votre adresse e-mail. Si un compte existe, vous recevrez un lien pour réinitialiser votre mot de passe.</p>

          <div class="field">
            <label class="field-label" for="email">Adresse e-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="field-input"
              required
              maxlength="254"
              autocomplete="email"
              placeholder="votre@email.com"
            />
          </div>

          <p v-if="errorForgot" class="form-error">{{ errorForgot }}</p>

          <button type="submit" class="btn btn-primary auth-submit" :disabled="loadingForgot">
            {{ loadingForgot ? 'Envoi...' : 'Envoyer le lien →' }}
          </button>
        </form>

        <div class="auth-footer">
          <NuxtLink to="/connexion" class="auth-link auth-link--muted">← Retour à la connexion</NuxtLink>
        </div>
      </template>

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

.auth-header { margin-bottom: 2.5rem; }

.auth-title {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.auth-hint {
  font-size: 0.92rem;
  color: var(--color-muted);
  line-height: 1.7;
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
  font-size: 0.88rem;
}

.auth-link { color: var(--color-green); font-weight: 500; }
.auth-link--muted { color: var(--color-muted); font-weight: 400; }

.done-state {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.done-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-green-deep);
}

.done-sub {
  font-size: 0.97rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.done-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-green);
  line-height: 1.65;
  margin-top: 0.5rem;
}

.done-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-top: 0.3rem;
}
</style>
