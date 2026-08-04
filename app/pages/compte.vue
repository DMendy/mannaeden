<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
</script>

<template>
  <section v-if="user" class="account">
    <h1>Mon compte</h1>
    <dl>
      <dt>Nom</dt>
      <dd>{{ user.civilite === 'MME' ? 'Mme' : user.civilite === 'M' ? 'M' : '' }} {{ user.prenom }} {{ user.nom }}</dd>
      <dt>Email</dt>
      <dd>{{ user.email }}</dd>
      <dt>Téléphone</dt>
      <dd>{{ user.telephone || '—' }}</dd>
      <dt>Adresse</dt>
      <dd>
        <span v-if="user.adresseLigne1">
          {{ user.adresseLigne1 }}<br v-if="user.adresseLigne2" />{{ user.adresseLigne2 }}<br />
          {{ user.codePostal }} {{ user.ville }}, {{ user.pays }}
        </span>
        <span v-else>—</span>
      </dd>
    </dl>
  </section>
</template>

<style scoped>
.account {
  max-width: 480px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1.5rem;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1.5rem;
}

dt {
  color: var(--color-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

dd {
  margin: 0;
}
</style>
