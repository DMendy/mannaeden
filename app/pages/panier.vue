<script setup lang="ts">
import type { Product, Civilite } from '~/types/auth'

definePageMeta({ layout: 'full', middleware: 'auth' })
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { user } = useAuth()
const { fetchAll } = useProduct()
const { createSession } = useCheckout()

const SHIPPING_OPTIONS = [
  { id: 'relais-classique',  label: 'Point relais — Classique', delay: '3–5 jours ouvrés',  price: 599  },
  { id: 'relais-rapide',     label: 'Point relais — Rapide',    delay: '1–2 jours ouvrés',  price: 799  },
  { id: 'domicile-classique',label: 'À domicile — Classique',   delay: '3–5 jours ouvrés',  price: 949  },
  { id: 'domicile-rapide',   label: 'À domicile — Rapide',      delay: '1–2 jours ouvrés',  price: 1249 },
]

const product = ref<Product | null>(null)
const loadingProduct = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)

// Livraison sélectionnée (défaut : point relais classique)
const selectedShipping = ref(SHIPPING_OPTIONS[0])

// Form — pre-filled from user profile
const civilite = ref<Civilite>(user.value?.civilite ?? 'M')
const nom = ref(user.value?.nom ?? '')
const prenom = ref(user.value?.prenom ?? '')
const telephone = ref(user.value?.telephone ?? '')
const adresseLigne1 = ref(user.value?.adresseLigne1 ?? '')
const adresseLigne2 = ref(user.value?.adresseLigne2 ?? '')
const codePostal = ref(user.value?.codePostal ?? '')
const ville = ref(user.value?.ville ?? '')
const pays = ref(user.value?.pays ?? 'France')

onMounted(async () => {
  try {
    const products = await fetchAll()
    product.value = products[0] ?? null
  } finally {
    loadingProduct.value = false
  }
})

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

const prixProduit = computed(() => product.value?.prixUnitaire ?? 0)
const prixTotal = computed(() => prixProduit.value + selectedShipping.value.price)

async function onSubmit() {
  if (!product.value) return
  error.value = null
  submitting.value = true
  try {
    const url = await createSession({
      productId: product.value.id,
      quantite: 1,
      civilite: civilite.value,
      nom: nom.value,
      prenom: prenom.value,
      telephone: telephone.value || undefined,
      adresseLigne1: adresseLigne1.value,
      adresseLigne2: adresseLigne2.value || undefined,
      codePostal: codePostal.value,
      ville: ville.value,
      pays: pays.value,
      modeLivraison: selectedShipping.value.label,
      fraisLivraison: selectedShipping.value.price,
    })
    window.location.href = url
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue.'
    submitting.value = false
  }
}
</script>

<template>
  <div class="panier-root">

    <div class="panier-bg" aria-hidden="true">
      <p class="panier-bg__verse">« Je suis venu afin que vous ayez la vie, et que vous l'ayez en abondance. »</p>
    </div>

    <section class="panier-hero section--alt">
      <div class="container">
        <h1 class="panier-title">Votre commande</h1>
        <p class="panier-sub">Vérifiez votre adresse de livraison avant de procéder au paiement.</p>
      </div>
    </section>

    <section class="section--sm">
      <div class="container panier-layout">

        <!-- FORM -->
        <div class="panier-form-wrap">
          <div class="form-section">
            <div class="form-section__header">
              <span class="form-section__num">01</span>
              <div>
                <h2 class="form-section__title">Adresse de livraison</h2>
                <p class="form-section__hint">
                  <span class="verse-text" style="font-size: 0.9rem; color: var(--color-green-mid)">
                    « Là où tu iras, j'irai. »
                  </span>
                  <span class="verse-ref" style="display: block; margin-top: 0.2rem">Ruth 1:16</span>
                </p>
              </div>
            </div>

            <form class="panier-form" @submit.prevent="onSubmit">
              <div class="field-row">
                <label class="field">
                  <span class="field-label">Civilité</span>
                  <select v-model="civilite" class="field-select">
                    <option value="M">M.</option>
                    <option value="MME">Mme</option>
                  </select>
                </label>
                <label class="field">
                  <span class="field-label">Prénom *</span>
                  <input v-model="prenom" type="text" class="field-input" required autocomplete="given-name" maxlength="50">
                </label>
                <label class="field">
                  <span class="field-label">Nom *</span>
                  <input v-model="nom" type="text" class="field-input" required autocomplete="family-name" maxlength="50">
                </label>
              </div>

              <label class="field">
                <span class="field-label">Téléphone</span>
                <input v-model="telephone" type="tel" class="field-input" autocomplete="tel" maxlength="20" pattern="[0-9\s\+\-\(\)]{7,20}">
              </label>

              <div class="form-section__divider">
                <span class="eyebrow" style="color: var(--color-green-mid)">Adresse</span>
              </div>

              <label class="field">
                <span class="field-label">Adresse *</span>
                <input v-model="adresseLigne1" type="text" class="field-input" required autocomplete="address-line1" maxlength="100">
              </label>

              <label class="field">
                <span class="field-label">Complément</span>
                <input v-model="adresseLigne2" type="text" class="field-input" autocomplete="address-line2" maxlength="100">
              </label>

              <div class="field-row field-row--ville-cp">
                <label class="field">
                  <span class="field-label">Ville *</span>
                  <input v-model="ville" type="text" class="field-input" required autocomplete="address-level2" maxlength="80">
                </label>
                <label class="field">
                  <span class="field-label">Code postal *</span>
                  <input v-model="codePostal" type="text" class="field-input" required autocomplete="postal-code" maxlength="5" minlength="4" pattern="[0-9]{4,5}">
                </label>
              </div>

              <label class="field">
                <span class="field-label">Pays *</span>
                <input v-model="pays" type="text" class="field-input" required autocomplete="country-name" maxlength="60">
              </label>

              <!-- LIVRAISON -->
              <div class="form-section__divider shipping-divider">
                <span class="eyebrow" style="color: var(--color-green-mid)">Mode de livraison</span>
              </div>

              <div class="shipping-options" role="radiogroup" aria-label="Mode de livraison">
                <label
                  v-for="option in SHIPPING_OPTIONS"
                  :key="option.id"
                  class="shipping-option"
                  :class="{ 'shipping-option--selected': selectedShipping.id === option.id }"
                >
                  <input
                    v-model="selectedShipping"
                    type="radio"
                    :value="option"
                    class="shipping-radio"
                    name="livraison"
                  >
                  <span class="shipping-option__content">
                    <span class="shipping-option__label">{{ option.label }}</span>
                    <span class="shipping-option__delay">{{ option.delay }}</span>
                  </span>
                  <span class="shipping-option__price">{{ formatPrice(option.price) }}</span>
                </label>
              </div>

              <p v-if="error" class="form-error">{{ error }}</p>

              <button type="submit" class="btn btn-primary panier-submit" :disabled="submitting || loadingProduct || !product">
                {{ submitting ? 'Redirection vers le paiement...' : 'Passer au paiement sécurisé →' }}
              </button>

              <p class="panier-secure">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Paiement 100% sécurisé via Stripe
              </p>
            </form>
          </div>
        </div>

        <!-- RECAP -->
        <div class="panier-recap">
          <div class="recap-card">
            <h3 class="recap-title">Votre commande</h3>

            <div v-if="loadingProduct" class="recap-loading">
              <div class="skeleton skeleton--line" style="height: 60px; margin-bottom: 1rem" />
            </div>

            <div v-else-if="product" class="recap-product">
              <div class="recap-img">
                <div v-if="product.imageUrl">
                  <img :src="product.imageUrl" :alt="product.nom">
                </div>
                <div v-else class="recap-img-placeholder">
                  <span>mannaeden</span>
                </div>
              </div>
              <div class="recap-info">
                <p class="recap-name">{{ product.nom }}</p>
                <p class="recap-detail">Planner physique · A5 · ×1</p>
              </div>
            </div>

            <div class="recap-breakdown">
              <div class="recap-line">
                <span>Planner mannaeden</span>
                <span>{{ formatPrice(prixProduit) }}</span>
              </div>
              <div class="recap-line">
                <span>{{ selectedShipping.label }}</span>
                <span>{{ formatPrice(selectedShipping.price) }}</span>
              </div>
            </div>

            <div class="recap-total">
              <span class="recap-total__label">Total</span>
              <span class="recap-total__price">{{ formatPrice(prixTotal) }}</span>
            </div>

            <div class="recap-verse">
              <p class="verse-text" style="font-size: 0.95rem; color: var(--color-green-mid)">
                « Cherchez premièrement le royaume et la justice de Dieu. »
              </p>
              <p class="verse-ref" style="color: var(--color-muted)">Matthieu 6 : 33</p>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.panier-root {
  position: relative;
}

.panier-bg {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.panier-bg__verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: rgba(53, 64, 40, 0.04);
  text-align: center;
  max-width: 800px;
  padding-inline: 2rem;
  line-height: 1.4;
  user-select: none;
}

.panier-hero {
  padding-top: 9rem;
  padding-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.panier-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
}

.panier-sub {
  font-size: 1rem;
  color: var(--color-muted);
  margin-top: 0.75rem;
}

.panier-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3.5rem;
  align-items: start;
  position: relative;
  z-index: 1;
  padding-block: 3rem;
}

/* FORM */
.form-section {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2.5rem;
}

.form-section__header {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.form-section__num {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--color-green-mid);
  line-height: 1;
  flex-shrink: 0;
}

.form-section__title {
  font-size: 1.4rem;
  font-weight: 600;
}

.form-section__hint { margin-top: 0.4rem; }

.panier-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-row {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 1rem;
}

.field-row .field:first-child {
  min-width: 90px;
}

.field-row--ville-cp {
  grid-template-columns: 1fr 120px;
}

.form-section__divider {
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.panier-submit {
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.panier-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  margin-top: 0.5rem;
}

/* RECAP */
.panier-recap {
  position: sticky;
  top: 100px;
}

.recap-card {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recap-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.recap-product {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.recap-img {
  width: 64px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.recap-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recap-img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}

.recap-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.recap-detail {
  font-size: 0.82rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
}

.recap-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.recap-total__label {
  font-size: 0.85rem;
  color: var(--color-muted);
  font-weight: 500;
}

.recap-total__price {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
}

.recap-verse {
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

/* SHIPPING OPTIONS */
.shipping-divider {
  margin-top: 0.5rem;
}

.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.shipping-option:hover {
  border-color: var(--color-green-mid);
  background: rgba(53, 64, 40, 0.03);
}

.shipping-option--selected {
  border-color: var(--color-green);
  background: rgba(53, 64, 40, 0.06);
}

.shipping-radio {
  accent-color: var(--color-green);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.shipping-option__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.shipping-option__label {
  font-size: 0.9rem;
  font-weight: 500;
}

.shipping-option__delay {
  font-size: 0.78rem;
  color: var(--color-muted);
}

.shipping-option__price {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

/* RECAP BREAKDOWN */
.recap-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.recap-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.recap-loading .skeleton {
  border-radius: 8px;
  background: var(--color-border);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@media (max-width: 900px) {
  .panier-layout {
    grid-template-columns: 1fr;
  }

  .panier-recap {
    position: static;
    order: -1;
  }

  .field-row {
    grid-template-columns: auto 1fr;
  }

  .field-row .field:last-child:nth-child(3) {
    grid-column: 1 / -1;
  }
}
</style>
