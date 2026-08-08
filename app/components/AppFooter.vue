<template>
  <footer class="site-footer">
    <div class="footer-inner">

      <!-- Brand -->
      <div class="footer-brand">
        <NuxtLink to="/" class="footer-logo">
          <img src="/logo-dark.png" alt="mannaeden" class="footer-logo-img" />
        </NuxtLink>
        <p class="footer-tagline">Un planner ancré dans la foi,<br>pour toute une année.</p>
        <p class="footer-verse">
          « Ta parole est une lampe à mes pieds. »
          <span>Psaume 119 : 105</span>
        </p>
      </div>

      <!-- Navigation -->
      <div class="footer-col">
        <h4 class="footer-col-title">Navigation</h4>
        <ul class="footer-links">
          <li><NuxtLink to="/qui-sommes-nous">Qui suis-je ?</NuxtLink></li>
          <li><NuxtLink to="/boutique">Graines de Foi</NuxtLink></li>
          <li><NuxtLink to="/planner">Pour qui ?</NuxtLink></li>
          <li><NuxtLink to="/nos-valeurs">Nos valeurs</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        </ul>
      </div>

      <!-- Commander -->
      <div class="footer-col">
        <h4 class="footer-col-title">Commander</h4>
        <ul class="footer-links">
          <li><NuxtLink to="/panier">Commander le planner</NuxtLink></li>
          <li><NuxtLink to="/connexion">Se connecter</NuxtLink></li>
          <li><NuxtLink to="/inscription">Créer un compte</NuxtLink></li>
          <li><NuxtLink to="/compte">Mon compte</NuxtLink></li>
        </ul>
      </div>

      <!-- Légal -->
      <div class="footer-col">
        <h4 class="footer-col-title">Informations</h4>
        <ul class="footer-links">
          <li><NuxtLink to="/mentions-legales">Mentions légales</NuxtLink></li>
          <li><NuxtLink to="/mentions-legales#cgv">Conditions générales de vente</NuxtLink></li>
          <li><NuxtLink to="/mentions-legales#confidentialite">Politique de confidentialité</NuxtLink></li>
          <li><NuxtLink to="/contact">Service client</NuxtLink></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <p class="footer-copy">© {{ year }} mannaeden — Tous droits réservés</p>
      <p class="footer-made">Conçu avec intention, ancré dans la foi.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--color-green-deep);
  color: rgba(255, 255, 255, 0.65);
  padding-top: 4.5rem;
}

.footer-inner {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Brand */
.footer-logo {
  display: block;
  margin-bottom: 1rem;
}

.footer-logo-img {
  height: 32px;
  width: auto;
  display: block;
}

.footer-tagline {
  font-size: 0.88rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 1.5rem;
}

.footer-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.25);
  line-height: 1.55;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.footer-verse span {
  display: block;
  font-style: normal;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.07em;
  margin-top: 0.3rem;
  color: rgba(255, 255, 255, 0.15);
}

/* Columns */
.footer-col-title {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 1.25rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer-links a {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.2s;
}

.footer-links a:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* Bottom */
.footer-bottom {
  max-width: 1200px;
  margin-inline: auto;
  padding: 1.25rem clamp(1.5rem, 5vw, 4rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-copy,
.footer-made {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 540px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
</style>
