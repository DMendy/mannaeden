<script setup lang="ts">
import type { Civilite, Order, StatutLivraison } from '~/types/auth'

definePageMeta({ middleware: 'auth' })
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { user, updateMe, api } = useAuth()

// Changement de mot de passe
const showPwdForm = ref(false)
const pwdCurrent = ref('')
const pwdNew = ref('')
const pwdConfirm = ref('')
const pwdLoading = ref(false)
const pwdError = ref('')
const pwdSuccess = ref(false)

async function onChangePwd() {
  pwdError.value = ''
  if (pwdNew.value !== pwdConfirm.value) { pwdError.value = 'Les mots de passe ne correspondent pas.'; return }
  if (pwdNew.value.length < 8) { pwdError.value = 'Le nouveau mot de passe doit faire au moins 8 caractères.'; return }
  pwdLoading.value = true
  try {
    await api('/auth/change-password', { method: 'PATCH', body: { currentPassword: pwdCurrent.value, newPassword: pwdNew.value } })
    pwdSuccess.value = true
    pwdCurrent.value = ''; pwdNew.value = ''; pwdConfirm.value = ''
    setTimeout(() => { pwdSuccess.value = false; showPwdForm.value = false }, 2500)
  } catch (e: any) {
    pwdError.value = e.message || 'Mot de passe actuel incorrect.'
  } finally {
    pwdLoading.value = false
  }
}

const orders = ref<Order[]>([])
const ordersLoading = ref(true)

const STATUTS: { value: StatutLivraison; label: string }[] = [
  { value: 'COMMANDEE',             label: 'Commandée' },
  { value: 'EXPEDIEE',              label: 'Expédiée' },
  { value: 'EN_COURS_DE_LIVRAISON', label: 'En livraison' },
  { value: 'LIVREE',                label: 'Livrée' },
]

function statutIndex(statut: StatutLivraison) {
  return STATUTS.findIndex(s => s.value === statut)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

onMounted(async () => {
  try {
    orders.value = await api<Order[]>('/orders/me')
  } catch {
    // silently fail
  } finally {
    ordersLoading.value = false
  }
})

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
              <input id="tel" v-model="telephone" type="tel" class="field-input" autocomplete="tel" maxlength="20" pattern="[0-9\s\+\-\(\)]{7,20}" />
            </div>

            <div class="field">
              <label class="field-label" for="ligne1">Adresse</label>
              <input id="ligne1" v-model="adresseLigne1" type="text" class="field-input" autocomplete="address-line1" maxlength="100" />
            </div>

            <div class="field">
              <label class="field-label" for="ligne2">Complément</label>
              <input id="ligne2" v-model="adresseLigne2" type="text" class="field-input" autocomplete="address-line2" maxlength="100" />
            </div>

            <div class="field-row field-row--ville-cp">
              <div class="field">
                <label class="field-label" for="ville">Ville</label>
                <input id="ville" v-model="ville" type="text" class="field-input" autocomplete="address-level2" maxlength="80" />
              </div>
              <div class="field field--cp">
                <label class="field-label" for="cp">Code postal</label>
                <input id="cp" v-model="codePostal" type="text" class="field-input" autocomplete="postal-code" maxlength="5" minlength="4" pattern="[0-9]{4,5}" />
              </div>
            </div>

            <div class="field">
              <label class="field-label" for="pays">Pays</label>
              <input id="pays" v-model="pays" type="text" class="field-input" autocomplete="country-name" maxlength="60" />
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

      <!-- Mes commandes -->
      <div class="account-card orders-card">
        <div class="card-section">
          <h2 class="card-section__title">Mes commandes</h2>

          <div v-if="ordersLoading" class="orders-loading">
            <div class="skeleton-row" />
            <div class="skeleton-row" />
          </div>

          <div v-else-if="orders.length === 0" class="orders-empty">
            <p>Aucune commande pour le moment.</p>
            <NuxtLink to="/boutique" class="orders-empty-link">Découvrir le planner →</NuxtLink>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-item">
              <div class="order-meta">
                <span class="order-ref">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>

              <div class="order-detail">
                <span class="order-product">{{ order.product?.nom }} × {{ order.quantite }}</span>
                <span class="order-price">{{ formatPrice(order.montantTotal) }}</span>
              </div>

              <!-- Progress -->
              <div class="order-track">
                <div class="track-bar">
                  <div
                    class="track-fill"
                    :style="{ width: `${(statutIndex(order.statutLivraison) / (STATUTS.length - 1)) * 100}%` }"
                  />
                </div>
                <div class="track-steps">
                  <div
                    v-for="(s, i) in STATUTS"
                    :key="s.value"
                    class="track-step"
                    :class="{
                      'track-step--done': i < statutIndex(order.statutLivraison),
                      'track-step--active': i === statutIndex(order.statutLivraison),
                    }"
                  >
                    <div class="track-dot">
                      <svg v-if="i < statutIndex(order.statutLivraison)" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span class="track-label">{{ s.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success toast -->
      <Transition name="toast">
        <div v-if="success" class="toast">Adresse mise à jour.</div>
      </Transition>

      <!-- Changement mot de passe -->
      <div class="pwd-section">
        <button class="link-subtle" @click="showPwdForm = !showPwdForm">
          {{ showPwdForm ? 'Annuler' : 'Changer de mot de passe' }}
        </button>

        <Transition name="toast">
          <div v-if="pwdSuccess" class="toast">Mot de passe mis à jour.</div>
        </Transition>

        <form v-if="showPwdForm" class="pwd-form" @submit.prevent="onChangePwd">
          <label class="field">
            <span class="field-label">Mot de passe actuel</span>
            <input v-model="pwdCurrent" type="password" class="field-input" required autocomplete="current-password" />
          </label>
          <label class="field">
            <span class="field-label">Nouveau mot de passe</span>
            <input v-model="pwdNew" type="password" class="field-input" required autocomplete="new-password" minlength="8" />
          </label>
          <label class="field">
            <span class="field-label">Confirmer le nouveau mot de passe</span>
            <input v-model="pwdConfirm" type="password" class="field-input" required autocomplete="new-password" />
          </label>
          <p v-if="pwdError" class="pwd-error">{{ pwdError }}</p>
          <button type="submit" class="btn btn-primary" :disabled="pwdLoading">
            {{ pwdLoading ? 'Mise à jour...' : 'Mettre à jour' }}
          </button>
        </form>
      </div>

      <!-- Actions -->
      <div class="account-actions">
        <NuxtLink to="/panier" class="btn btn-primary">Commander le planner</NuxtLink>
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
.field-row--ville-cp { grid-template-columns: 1fr 120px; }
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

.pwd-section {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pwd-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.pwd-error {
  font-size: 0.82rem;
  color: var(--color-danger);
}

/* ── COMMANDES ── */
.orders-card {
  margin-top: 1.25rem;
}

.orders-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-row {
  height: 110px;
  border-radius: 10px;
  background: var(--color-border);
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.orders-empty {
  font-size: 0.9rem;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.orders-empty-link {
  color: var(--color-green);
  font-size: 0.85rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.order-item {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.order-ref {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-green-deep);
}

.order-date {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.order-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.order-product {
  font-size: 0.88rem;
  color: var(--color-text);
}

.order-price {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-green-deep);
}

/* Track */
.order-track {
  margin-top: 0.25rem;
}

.track-bar {
  position: relative;
  height: 3px;
  background: var(--color-border);
  border-radius: 100px;
  margin-bottom: 0.75rem;
}

.track-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--color-green);
  border-radius: 100px;
  transition: width 0.4s ease;
}

.track-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
}

.track-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.track-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.track-dot svg { width: 11px; height: 11px; }

.track-step--done .track-dot {
  background: var(--color-green);
  border-color: var(--color-green);
  color: #fff;
}

.track-step--active .track-dot {
  border-color: var(--color-green);
  background: rgba(53,64,40,0.08);
}

.track-label {
  font-size: 0.65rem;
  color: var(--color-muted);
  text-align: center;
  line-height: 1.3;
}

.track-step--active .track-label {
  color: var(--color-green);
  font-weight: 600;
}

.track-step--done .track-label {
  color: var(--color-green-mid);
}

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
