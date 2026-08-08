<template>
  <div class="legal-root">

    <section class="legal-hero section--alt">
      <div class="container">
        <span class="eyebrow">Informations légales</span>
        <h1 class="legal-hero-title">Mentions légales</h1>
      </div>
    </section>

    <section class="section">
      <div class="container--narrow legal-body">

        <!-- Éditeur -->
        <div class="legal-block">
          <h2 class="legal-h2">Éditeur du site</h2>
          <p>Le site <strong>mannaeden.fr</strong> est édité par :</p>
          <ul>
            <li><strong>Nom :</strong> Camille Gicquiaud</li>
            <li><strong>Marque :</strong> mannaeden</li>
            <li><strong>Adresse e-mail :</strong> contact.mannaeden@gmail.com</li>
          </ul>
        </div>

        <!-- Hébergement -->
        <div class="legal-block">
          <h2 class="legal-h2">Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Frontend :</strong> Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
            <li><strong>Backend :</strong> Render Services, Inc. — San Francisco, CA, USA</li>
            <li><strong>Base de données :</strong> Neon Inc.</li>
          </ul>
        </div>

        <!-- Propriété intellectuelle -->
        <div class="legal-block">
          <h2 class="legal-h2">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images, visuels, conception graphique) sont la propriété exclusive de mannaeden et de Camille Gicquiaud, et sont protégés par les lois françaises et internationales relatives au droit d'auteur.
          </p>
          <p>
            Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie des contenus est strictement interdite.
          </p>
        </div>

        <!-- CGV -->
        <div id="cgv" class="legal-block">
          <h2 class="legal-h2">Conditions générales de vente</h2>

          <h3 class="legal-h3">Produit</h3>
          <p>
            mannaeden commercialise le planner physique <em>Graines de Foi</em>, un planner chrétien annuel au format A5. Les caractéristiques essentielles du produit sont décrites sur la page boutique du site.
          </p>

          <h3 class="legal-h3">Prix</h3>
          <p>
            Les prix sont indiqués en euros toutes taxes comprises (TTC). mannaeden se réserve le droit de modifier ses prix à tout moment, sans préavis. Les commandes sont facturées au tarif en vigueur au moment de la validation.
          </p>

          <h3 class="legal-h3">Commande et paiement</h3>
          <p>
            Le paiement est effectué en ligne de manière sécurisée via Stripe. La commande est validée dès réception du paiement. Un e-mail de confirmation est envoyé à l'adresse fournie lors de l'inscription.
          </p>

          <h3 class="legal-h3">Livraison</h3>
          <p>
            Les commandes sont expédiées sous 2 à 4 jours ouvrés. Les frais et délais de livraison dépendent du mode choisi lors de la commande :
          </p>
          <ul>
            <li>Point relais classique : 5,99 € — 3 à 5 jours ouvrés</li>
            <li>Point relais rapide : 7,99 € — 1 à 2 jours ouvrés</li>
            <li>À domicile classique : 9,49 € — 3 à 5 jours ouvrés</li>
            <li>À domicile rapide : 12,49 € — 1 à 2 jours ouvrés</li>
          </ul>

          <h3 class="legal-h3">Droit de rétractation</h3>
          <p>
            Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la réception du produit pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités. Pour exercer ce droit, contactez-nous à l'adresse : <a href="mailto:contact.mannaeden@gmail.com">contact.mannaeden@gmail.com</a>.
          </p>

          <h3 class="legal-h3">Service client</h3>
          <p>
            Pour toute question ou réclamation, contactez-nous via la <NuxtLink to="/contact">page contact</NuxtLink> ou directement à l'adresse <a href="mailto:contact.mannaeden@gmail.com">contact.mannaeden@gmail.com</a>. Nous répondons sous 24 à 48 heures.
          </p>
        </div>

        <!-- Confidentialité -->
        <div id="confidentialite" class="legal-block">
          <h2 class="legal-h2">Politique de confidentialité</h2>

          <h3 class="legal-h3">Données collectées</h3>
          <p>
            Dans le cadre de l'utilisation du site et de la passation de commandes, mannaeden collecte les données personnelles suivantes : nom, prénom, adresse e-mail, adresse de livraison et numéro de téléphone (optionnel).
          </p>

          <h3 class="legal-h3">Finalités du traitement</h3>
          <p>Ces données sont collectées et traitées pour :</p>
          <ul>
            <li>Gérer votre compte client</li>
            <li>Traiter et expédier vos commandes</li>
            <li>Vous envoyer des confirmations de commande et mises à jour de livraison</li>
          </ul>

          <h3 class="legal-h3">Conservation des données</h3>
          <p>
            Vos données sont conservées pendant toute la durée de votre relation commerciale avec mannaeden, puis archivées conformément aux obligations légales en vigueur (5 ans pour les données comptables).
          </p>

          <h3 class="legal-h3">Vos droits</h3>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez : <a href="mailto:contact.mannaeden@gmail.com">contact.mannaeden@gmail.com</a>.
          </p>

          <h3 class="legal-h3">Cookies</h3>
          <p>
            Ce site utilise des cookies strictement nécessaires au bon fonctionnement de l'authentification. Aucun cookie publicitaire ni outil de tracking tiers n'est utilisé.
          </p>

          <h3 class="legal-h3">Paiement</h3>
          <p>
            Les paiements sont traités par Stripe. mannaeden ne stocke aucune donnée bancaire. Stripe est certifié PCI DSS niveau 1.
          </p>
        </div>

        <div class="legal-block legal-block--muted">
          <p>Page mise à jour en {{ year }}. Pour toute question d'ordre juridique, contactez : <a href="mailto:contact.mannaeden@gmail.com">contact.mannaeden@gmail.com</a>.</p>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'full' })
const year = new Date().getFullYear()
</script>

<style scoped>
.legal-root { background: var(--color-bg); }

.legal-hero {
  padding-top: 9rem;
  padding-bottom: 3rem;
}

.legal-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-top: 0.75rem;
}

.legal-body {
  padding-block: 3rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.legal-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legal-block--muted p {
  font-size: 0.85rem;
  color: var(--color-muted);
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.legal-h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-green-deep);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.legal-h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 0.5rem;
}

.legal-body p,
.legal-body li {
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 1.8;
}

.legal-body ul {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legal-body a {
  color: var(--color-green);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal-body strong { color: var(--color-text); }
.legal-body em { font-family: var(--font-serif); font-style: italic; }
</style>
