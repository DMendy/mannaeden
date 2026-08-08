<script setup lang="ts">
import { gsap } from 'gsap'

const { user, logout } = useAuth()
const router = useRouter()
const menuOpen = ref(false)

onMounted(() => {
  gsap.set('.menu-overlay', { autoAlpha: 0 })
})

watch(menuOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    gsap.set('.menu-overlay', { autoAlpha: 1 })

    gsap.timeline()
      .fromTo('.overlay-panel',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.6, ease: 'expo.inOut' }
      )
      .fromTo('.overlay-deco',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' },
        0.2
      )
      .fromTo('.overlay-nav-item',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' },
        '-=0.35'
      )
      .fromTo('.overlay-footer',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.1'
      )
  } else {
    document.body.style.overflow = ''

    gsap.timeline({
      onComplete: () => gsap.set('.menu-overlay', { autoAlpha: 0 })
    })
      .to('.overlay-nav-item', {
        opacity: 0, y: -25,
        stagger: { each: 0.04, from: 'end' },
        duration: 0.25, ease: 'power2.in'
      })
      .to('.overlay-footer', { opacity: 0, duration: 0.2 }, 0)
      .to('.overlay-deco', { opacity: 0, duration: 0.25 }, 0)
      .to('.overlay-panel', {
        scaleY: 0, transformOrigin: 'top center',
        duration: 0.45, ease: 'expo.in'
      }, '-=0.1')
  }
})

function handleLogout() {
  document.body.style.overflow = ''
  logout()
  router.push('/')
  menuOpen.value = false
}

watch(() => router.currentRoute.value.path, () => {
  if (menuOpen.value) menuOpen.value = false
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <header class="site-header" :class="{ 'site-header--open': menuOpen }">
      <div class="container site-header__inner">
        <NuxtLink to="/" class="brand" @click="menuOpen = false">
          <img src="/logo-dark.png" alt="mannaeden" class="brand-logo" />
        </NuxtLink>

        <!-- Nav desktop -->
        <nav class="desktop-nav">
          <NuxtLink to="/qui-sommes-nous">Qui suis-je ?</NuxtLink>
          <NuxtLink to="/boutique">Graines de Foi</NuxtLink>
          <NuxtLink to="/planner">Pour qui ?</NuxtLink>
          <NuxtLink to="/nos-valeurs">Nos valeurs</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
          <span class="nav-sep" />
          <template v-if="user">
            <NuxtLink to="/compte">{{ user.prenom }}</NuxtLink>
            <button class="link-btn" @click="handleLogout">Déconnexion</button>
          </template>
          <template v-else>
            <NuxtLink to="/connexion">Connexion</NuxtLink>
            <NuxtLink to="/inscription" class="btn btn-primary btn--nav">Commencer</NuxtLink>
          </template>
        </nav>

        <!-- Burger mobile -->
        <button
          class="hamburger"
          :class="{ 'hamburger--open': menuOpen }"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="bar bar-top" />
          <span class="bar bar-btm" />
        </button>
      </div>
    </header>

    <div class="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation">
      <div class="overlay-panel">

        <div class="overlay-deco" aria-hidden="true">
          <img src="/IMG_2483.JPG" alt="" />
        </div>

        <nav class="overlay-nav">
          <NuxtLink to="/qui-sommes-nous" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">01</span>
            <span class="overlay-nav-label">Qui suis-je ?</span>
          </NuxtLink>
          <NuxtLink to="/boutique" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">02</span>
            <span class="overlay-nav-label">Graines de Foi</span>
          </NuxtLink>
          <NuxtLink to="/planner" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">03</span>
            <span class="overlay-nav-label">Pour qui ?</span>
          </NuxtLink>
          <NuxtLink to="/nos-valeurs" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">04</span>
            <span class="overlay-nav-label">Nos valeurs</span>
          </NuxtLink>
          <NuxtLink to="/contact" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">05</span>
            <span class="overlay-nav-label">Contact</span>
          </NuxtLink>
        </nav>

        <footer class="overlay-footer">
          <div class="overlay-auth">
            <template v-if="user">
              <NuxtLink to="/compte" class="overlay-auth-link" @click="menuOpen = false">
                Mon compte — <em>{{ user.prenom }}</em>
              </NuxtLink>
              <button class="overlay-auth-link overlay-auth-link--muted" @click="handleLogout">
                Déconnexion
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/connexion" class="overlay-auth-link overlay-auth-link--muted" @click="menuOpen = false">
                Connexion
              </NuxtLink>
              <NuxtLink to="/inscription" class="overlay-auth-link" @click="menuOpen = false">
                Commencer →
              </NuxtLink>
            </template>
          </div>
          <p class="overlay-verse">
            « Ma nourriture est de faire la volonté de celui qui m'a envoyé. »
            <span>Jean 4 : 34</span>
          </p>
        </footer>

      </div>
    </div>

    <main><slot /></main>
    <AppFooter />
  </div>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  transition: background 0.3s, border-color 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--color-green-deep);
}

.site-header--open {
  background: transparent;
  border-color: transparent;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1.1rem;
}

.brand {
  position: relative;
  z-index: 201;
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

/* ── Nav desktop ── */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.desktop-nav a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.62);
  transition: color 0.2s;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-active {
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
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}

.link-btn:hover { color: rgba(255, 255, 255, 0.9); }

.btn--nav {
  padding: 0.5rem 1.25rem;
  font-size: 0.82rem;
}

.desktop-nav a.btn--nav,
.desktop-nav a.btn--nav:hover {
  color: #fff;
}

/* ── Hamburger (mobile only) ── */
.hamburger {
  position: relative;
  z-index: 201;
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.bar {
  display: block;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.85);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.3s, width 0.3s;
}

.bar-top { width: 20px; }
.bar-btm { width: 28px; }

.hamburger--open .bar-top { transform: translateY(4.25px)  rotate(45deg);  width: 28px; }
.hamburger--open .bar-btm { transform: translateY(-4.25px) rotate(-45deg); }

/* ── Overlay ── */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 199;
  visibility: hidden;
}

.overlay-panel {
  position: absolute;
  inset: 0;
  background: var(--color-green-deep);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.overlay-deco {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: clamp(180px, 28vw, 380px);
  opacity: 0.18;
  pointer-events: none;
}

.overlay-deco img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-nav {
  position: relative;
  z-index: 2;
  padding: 0 clamp(2rem, 8vw, 8rem);
  display: flex;
  flex-direction: column;
  gap: 0;
}

.overlay-nav-item {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding-block: 0.55rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  text-decoration: none;
}

.overlay-nav-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }

.overlay-nav-item:hover .overlay-nav-label {
  transform: translateX(8px);
  opacity: 0.6;
}

.overlay-nav-num {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.3);
  flex-shrink: 0;
  width: 2rem;
}

.overlay-nav-label {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2.6rem);
  font-weight: 700;
  line-height: 1.05;
  color: rgba(255,255,255,0.85);
  letter-spacing: -0.01em;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s;
}

.overlay-footer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 2;
  padding: 1.75rem clamp(2rem, 8vw, 8rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255,255,255,0.07);
  flex-wrap: wrap;
  gap: 1rem;
}

.overlay-auth {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.overlay-auth-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.overlay-auth-link em {
  font-family: var(--font-serif);
  font-style: italic;
  color: rgba(255,255,255,0.5);
}

.overlay-auth-link:hover { color: #fff; }
.overlay-auth-link--muted { color: rgba(255,255,255,0.3); }
.overlay-auth-link--muted:hover { color: rgba(255,255,255,0.6); }

.overlay-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.18);
  max-width: 300px;
  line-height: 1.55;
  text-align: right;
}

.overlay-verse span {
  display: block;
  font-style: normal;
  font-size: 0.68rem;
  letter-spacing: 0.07em;
  margin-top: 0.25rem;
  color: rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .hamburger { display: flex; }
}
</style>
