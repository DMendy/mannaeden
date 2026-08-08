<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()
const menuOpen = ref(false)

function handleLogout() {
  logout()
  router.push('/')
  menuOpen.value = false
}

watch(() => router.currentRoute.value.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <div class="container site-header__inner">
        <NuxtLink to="/" class="brand">
          <img src="/logo-dark.png" alt="mannaeden" class="brand-logo" />
        </NuxtLink>

        <button
          class="hamburger"
          :class="{ 'hamburger--open': menuOpen }"
          aria-label="Ouvrir le menu"
          @click="menuOpen = !menuOpen"
        >
          <span /><span /><span />
        </button>

        <nav class="nav" :class="{ 'nav--open': menuOpen }">
          <NuxtLink to="/qui-sommes-nous" @click="menuOpen = false">Qui suis-je ?</NuxtLink>
          <NuxtLink to="/boutique" @click="menuOpen = false">Graines de Foi</NuxtLink>
          <NuxtLink to="/planner" @click="menuOpen = false">Pour qui ?</NuxtLink>
          <NuxtLink to="/nos-valeurs" @click="menuOpen = false">Nos valeurs</NuxtLink>
          <NuxtLink to="/contact" @click="menuOpen = false">Contact</NuxtLink>
          <span class="nav-sep" />
          <template v-if="user">
            <NuxtLink to="/compte" @click="menuOpen = false">{{ user.prenom }}</NuxtLink>
            <button class="link-btn danger" @click="handleLogout">Déconnexion</button>
          </template>
          <template v-else>
            <NuxtLink to="/connexion" @click="menuOpen = false">Connexion</NuxtLink>
            <NuxtLink to="/inscription" class="btn btn-primary btn--nav" @click="menuOpen = false">Commencer</NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="container page">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--color-green-deep);
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-logo {
  display: block;
  width: 180px;
  height: 44px;
  object-fit: cover;
  object-position: center 49%;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.62);
  transition: color 0.2s;
}

.nav a:hover,
.nav a.router-link-active {
  color: #fff;
}

.nav-sep {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.15);
}

.link-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.2s;
}

.link-btn.danger:hover { color: #ff8080; }

.btn--nav {
  padding: 0.5rem 1.25rem;
  font-size: 0.82rem;
}

.nav a.btn--nav,
.nav a.btn--nav:hover,
.nav a.btn--nav:focus {
  color: #fff;
}

.page { padding-block: 3rem; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.85);
  transition: all 0.25s;
  transform-origin: center;
}

.hamburger--open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger--open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

@media (max-width: 768px) {
  .hamburger { display: flex; }

  .nav {
    display: none;
    position: fixed;
    inset: 0;
    top: 61px;
    background: var(--color-bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    font-size: 1.1rem;
    z-index: 99;
  }

  .nav--open { display: flex; }
  .nav-sep { display: none; }
  .btn--nav { padding: 0.7rem 2rem; }
}
</style>
