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
  <div class="auth-wrapper">
    <div class="auth-page">
      <div class="auth-header">
        <span class="eyebrow">Rejoindre mannaeden</span>
        <h1 class="auth-title">Créer un compte</h1>
      </div>

      <form class="auth-form" @submit.prevent="onSubmit">
        <div class="field-row">
          <div class="field field--civil">
            <label class="field-label" for="civilite">Civilité</label>
            <select id="civilite" v-model="civilite" class="field-select">
              <option value="">—</option>
              <option value="M">M.</option>
              <option value="MME">Mme</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="prenom">Prénom *</label>
            <input id="prenom" v-model="prenom" type="text" class="field-input" required autocomplete="given-name" />
          </div>
          <div class="field">
            <label class="field-label" for="nom">Nom *</label>
            <input id="nom" v-model="nom" type="text" class="field-input" required autocomplete="family-name" />
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="email">E-mail *</label>
          <input id="email" v-model="email" type="email" class="field-input" required autocomplete="email" placeholder="votre@email.com" />
        </div>

        <div class="field">
          <label class="field-label" for="password">Mot de passe * <span class="field-hint">(8 caractères min.)</span></label>
          <input id="password" v-model="password" type="password" class="field-input" required minlength="8" autocomplete="new-password" placeholder="••••••••" />
        </div>

        <div class="field">
          <label class="field-label" for="tel">Téléphone</label>
          <input id="tel" v-model="telephone" type="tel" class="field-input" autocomplete="tel" />
        </div>

        <button type="button" class="addr-toggle" @click="showAdresse = !showAdresse">
          {{ showAdresse ? '— Masquer' : '+ Ajouter' }} une adresse de livraison
        </button>

        <template v-if="showAdresse">
          <div class="field">
            <label class="field-label" for="ligne1">Adresse</label>
            <input id="ligne1" v-model="adresseLigne1" type="text" class="field-input" autocomplete="address-line1" />
          </div>
          <div class="field">
            <label class="field-label" for="ligne2">Complément</label>
            <input id="ligne2" v-model="adresseLigne2" type="text" class="field-input" autocomplete="address-line2" />
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field-label" for="cp">Code postal</label>
              <input id="cp" v-model="codePostal" type="text" class="field-input" autocomplete="postal-code" />
            </div>
            <div class="field">
              <label class="field-label" for="ville">Ville</label>
              <input id="ville" v-model="ville" type="text" class="field-input" autocomplete="address-level2" />
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="pays">Pays</label>
            <input id="pays" v-model="pays" type="text" class="field-input" autocomplete="country-name" />
          </div>
        </template>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button type="submit" class="btn btn-primary auth-submit" :disabled="loading">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Déjà un compte ? <NuxtLink to="/connexion" class="auth-link">Se connecter</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: calc(100dvh - 70px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem 5rem;
}

.auth-page {
  width: 100%;
  max-width: 480px;
}

.auth-header { margin-bottom: 2.5rem; }

.auth-title {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-row {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 0.75rem;
}

.field--civil { min-width: 80px; }

.field-hint {
  font-weight: 400;
  color: var(--color-muted);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: none;
}

.addr-toggle {
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  color: var(--color-green);
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-submit {
  width: 100%;
  justify-content: center;
  padding: 0.9rem;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  background: #354028 !important;
  color: #ffffff !important;
}

.auth-footer {
  margin-top: 2rem;
  font-size: 0.88rem;
  color: var(--color-muted);
}

.auth-link {
  color: var(--color-green);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 480px) {
  .field-row { grid-template-columns: 1fr 1fr; }
  .field--civil { grid-column: 1 / -1; }
}
</style>
