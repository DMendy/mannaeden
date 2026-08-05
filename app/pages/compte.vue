<script setup lang="ts">
import type { Civilite } from '~/types/auth'

definePageMeta({ middleware: 'auth' })

const { user, updateMe } = useAuth()

const editing = ref(false)
const saving = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const civilite = ref<Civilite | null>(null)
const telephone = ref('')
const adresseLigne1 = ref('')
const adresseLigne2 = ref('')
const codePostal = ref('')
const ville = ref('')
const pays = ref('')

function startEdit() {
  civilite.value = user.value?.civilite ?? null
  telephone.value = user.value?.telephone ?? ''
  adresseLigne1.value = user.value?.adresseLigne1 ?? ''
  adresseLigne2.value = user.value?.adresseLigne2 ?? ''
  codePostal.value = user.value?.codePostal ?? ''
  ville.value = user.value?.ville ?? ''
  pays.value = user.value?.pays ?? ''
  error.value = null
  success.value = false
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  error.value = null
}

async function saveProfile() {
  error.value = null
  saving.value = true
  try {
    await updateMe({
      civilite: civilite.value ?? undefined,
      telephone: telephone.value || undefined,
      adresseLigne1: adresseLigne1.value || undefined,
      adresseLigne2: adresseLigne2.value || undefined,
      codePostal: codePostal.value || undefined,
      ville: ville.value || undefined,
      pays: pays.value || undefined,
    })
    editing.value = false
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="account-wrapper">
    <div v-if="user" class="account">

      <div class="account-header">
        <span class="eyebrow">Mon espace</span>
        <h1 class="account-title">Bonjour, {{ user.prenom }}</h1>
      </div>

      <!-- Info section -->
      <div class="account-card">
        <div class="card-section">
          <h2 class="card-section__title">Informations personnelles</h2>
          <dl class="info-list">
            <div class="info-row">
              <dt>Nom</dt>
              <dd>{{ user.civilite === 'MME' ? 'Mme' : user.civilite === 'M' ? 'M.' : '' }} {{ user.prenom }} {{ user.nom }}</dd>
            </div>
            <div class="info-row">
              <dt>E-mail</dt>
              <dd>{{ user.email }}</dd>
            </div>
            <div class="info-row">
              <dt>Téléphone</dt>
              <dd>{{ user.telephone || '—' }}</dd>
            </div>
          </dl>
        </div>

        <div class="card-divider" />

        <!-- Address section — view or edit -->
        <div class="card-section">
          <div class="card-section__header">
            <h2 class="card-section__title">Adresse de livraison</h2>
            <button v-if="!editing" class="edit-btn" @click="startEdit">
              {{ user.adresseLigne1 ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>

          <!-- View mode -->
          <template v-if="!editing">
            <div v-if="user.adresseLigne1" class="address-display">
              <p>{{ user.adresseLigne1 }}</p>
              <p v-if="user.adresseLigne2">{{ user.adresseLigne2 }}</p>
              <p>{{ user.codePostal }} {{ user.ville }}</p>
              <p>{{ user.pays }}</p>
            </div>
            <p v-else class="address-empty">Aucune adresse enregistrée.</p>
          </template>

          <!-- Edit mode -->
          <form v-else class="edit-form" @submit.prevent="saveProfile">
            <div class="field-row">
              <div class="field field--civil">
                <label class="field-label" for="civ">Civilité</label>
                <select id="civ" v-model="civilite" class="field-select">
                  <option :value="null">—</option>
                  <option value="M">M.</option>
                  <option value="MME">Mme</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label class="field-label" for="tel">Téléphone</label>
              <input id="tel" v-model="telephone" type="tel" class="field-input" autocomplete="tel" />
            </div>

            <div class="field">
              <label class="field-label" for="ligne1">Adresse</label>
              <input id="ligne1" v-model="adresseLigne1" type="text" class="field-input" autocomplete="address-line1" />
            </div>

            <div class="field">
              <label class="field-label" for="ligne2">Complément</label>
              <input id="ligne2" v-model="adresseLigne2" type="text" class="field-input" autocomplete="address-line2" />
            </div>

            <div class="field-row field-row--2">
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

            <p v-if="error" class="form-error">{{ error }}</p>

            <div class="edit-actions">
              <button type="button" class="btn-cancel" @click="cancelEdit">Annuler</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success toast -->
      <Transition name="toast">
        <div v-if="success" class="toast">Adresse mise à jour.</div>
      </Transition>

      <!-- Actions -->
      <div class="account-actions">
        <NuxtLink to="/panier" class="btn btn-primary">Commander le planner</NuxtLink>
        <NuxtLink to="/reinitialiser-mot-de-passe" class="link-subtle">Changer de mot de passe</NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.account-wrapper {
  min-height: calc(100dvh - 70px);
  padding: 4rem 1.5rem 5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.account {
  width: 100%;
  max-width: 520px;
}

.account-header {
  margin-bottom: 2.5rem;
}

.account-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  color: var(--color-green-deep);
  margin-top: 0.5rem;
}

.account-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.card-section {
  padding: 2rem;
}

.card-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-section__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-green-deep);
  margin: 0 0 1.25rem;
}

.card-section__header .card-section__title {
  margin: 0;
}

.card-divider {
  height: 1px;
  background: var(--color-border);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 0.5rem;
}

.info-row dt {
  font-size: 0.8rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-top: 0.1rem;
}

.info-row dd {
  margin: 0;
  font-size: 0.95rem;
}

.edit-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  color: var(--color-green);
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
}
.edit-btn:hover { background: var(--color-bg-alt); }

.address-display {
  line-height: 1.7;
  font-size: 0.95rem;
  color: var(--color-text);
}
.address-empty {
  font-size: 0.9rem;
  color: var(--color-muted);
  font-style: italic;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.25rem;
}

.field-row {
  display: grid;
  gap: 0.75rem;
}
.field-row--2 { grid-template-columns: 1fr 1fr; }
.field--civil { max-width: 120px; }

.edit-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  background: none;
  border: none;
  font-size: 0.88rem;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.btn-cancel:hover { color: var(--color-text); }

.account-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.link-subtle {
  font-size: 0.85rem;
  color: var(--color-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.link-subtle:hover { color: var(--color-text); }

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-green-deep);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 500;
  z-index: 200;
  white-space: nowrap;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>
