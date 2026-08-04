<script setup lang="ts">
import type { Civilite } from '~/types/auth'

definePageMeta({ middleware: 'guest' })

const { register } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')
const civilite = ref<Civilite | ''>('')
const telephone = ref('')
const showAdresse = ref(false)
const adresseLigne1 = ref('')
const adresseLigne2 = ref('')
const codePostal = ref('')
const ville = ref('')
const pays = ref('')

const error = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await register({
      email: email.value,
      password: password.value,
      nom: nom.value,
      prenom: prenom.value,
      civilite: civilite.value || undefined,
      telephone: telephone.value || undefined,
      adresseLigne1: adresseLigne1.value || undefined,
      adresseLigne2: adresseLigne2.value || undefined,
      codePostal: codePostal.value || undefined,
      ville: ville.value || undefined,
      pays: pays.value || undefined
    })
    router.push('/compte')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Inscription impossible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <h1>Créer un compte</h1>
    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span>Civilité</span>
        <select v-model="civilite">
          <option value="">—</option>
          <option value="M">M</option>
          <option value="MME">Mme</option>
        </select>
      </label>
      <div class="row">
        <label class="field">
          <span>Prénom</span>
          <input v-model="prenom" type="text" required autocomplete="given-name" />
        </label>
        <label class="field">
          <span>Nom</span>
          <input v-model="nom" type="text" required autocomplete="family-name" />
        </label>
      </div>
      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" required autocomplete="email" />
      </label>
      <label class="field">
        <span>Mot de passe</span>
        <input v-model="password" type="password" required minlength="8" autocomplete="new-password" />
      </label>
      <label class="field">
        <span>Téléphone</span>
        <input v-model="telephone" type="tel" autocomplete="tel" />
      </label>

      <button type="button" class="toggle" @click="showAdresse = !showAdresse">
        {{ showAdresse ? 'Masquer' : 'Ajouter' }} une adresse de livraison
      </button>

      <template v-if="showAdresse">
        <label class="field">
          <span>Adresse</span>
          <input v-model="adresseLigne1" type="text" autocomplete="address-line1" />
        </label>
        <label class="field">
          <span>Complément d'adresse</span>
          <input v-model="adresseLigne2" type="text" autocomplete="address-line2" />
        </label>
        <div class="row">
          <label class="field">
            <span>Code postal</span>
            <input v-model="codePostal" type="text" autocomplete="postal-code" />
          </label>
          <label class="field">
            <span>Ville</span>
            <input v-model="ville" type="text" autocomplete="address-level2" />
          </label>
        </div>
        <label class="field">
          <span>Pays</span>
          <input v-model="pays" type="text" autocomplete="country-name" />
        </label>
      </template>

      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="submit" :disabled="loading">
        {{ loading ? 'Création...' : 'Créer mon compte' }}
      </button>
    </form>
    <p class="switch">
      Déjà un compte ?
      <NuxtLink to="/connexion">Se connecter</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.auth-page {
  max-width: 420px;
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

.row {
  display: flex;
  gap: 1rem;
}

.row .field {
  flex: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-muted);
}

input,
select {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-text);
  background: #fff;
}

.toggle {
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  color: var(--color-accent);
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
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
