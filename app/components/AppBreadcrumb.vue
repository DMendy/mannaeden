<script setup lang="ts">
const route = useRoute()

const LABELS: Record<string, string> = {
  'qui-sommes-nous':         'Qui suis-je ?',
  'boutique':                'Graines de Foi',
  'planner':                 'Pour qui ?',
  'nos-valeurs':             'Nos valeurs',
  'contact':                 'Contact',
  'compte':                  'Mon compte',
  'connexion':               'Connexion',
  'inscription':             'Inscription',
  'mentions-legales':        'Mentions légales',
  'panier':                  'Panier',
  'succes':                  'Commande confirmée',
  'annulee':                 'Commande annulée',
}

const segments = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (!parts.length) return []

  const crumbs: { label: string; path: string | null }[] = [
    { label: 'Accueil', path: '/' },
  ]

  parts.forEach((part, i) => {
    const label = LABELS[part] ?? null
    if (!label) return
    const isLast = i === parts.length - 1
    crumbs.push({ label, path: isLast ? null : '/' + parts.slice(0, i + 1).join('/') })
  })

  return crumbs.length > 1 ? crumbs : []
})
</script>

<template>
  <nav v-if="segments.length" aria-label="Fil d'ariane" class="breadcrumb">
    <ol>
      <li v-for="(crumb, i) in segments" :key="i">
        <NuxtLink v-if="crumb.path" :to="crumb.path">{{ crumb.label }}</NuxtLink>
        <span v-else aria-current="page">{{ crumb.label }}</span>
        <span v-if="i < segments.length - 1" class="sep" aria-hidden="true">›</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 1.5rem;
}

.breadcrumb ol {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style: none;
  font-size: 0.72rem;
  font-family: var(--font-sans);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.breadcrumb a {
  color: var(--color-muted);
  transition: color 0.18s;
}

.breadcrumb a:hover {
  color: var(--color-green);
}

.breadcrumb [aria-current="page"] {
  color: var(--color-green-mid);
}

.sep {
  color: var(--color-border);
  margin-inline: 0.15rem;
}
</style>
