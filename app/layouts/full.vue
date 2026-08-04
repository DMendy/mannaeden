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
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.65, ease: 'power3.out' },
        '-=0.35'
      )
      .fromTo('.overlay-footer',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 },
        '-=0.15'
      )
  } else {
    document.body.style.overflow = ''

    gsap.timeline({
      onComplete: () => gsap.set('.menu-overlay', { autoAlpha: 0 })
    })
      .to('.overlay-nav-item', {
        opacity: 0, y: -30,
        stagger: { each: 0.04, from: 'end' },
        duration: 0.28, ease: 'power2.in'
      })
      .to('.overlay-footer', { opacity: 0, duration: 0.2 }, 0)
      .to('.overlay-deco', { opacity: 0, duration: 0.3 }, 0)
      .to('.overlay-panel', {
        scaleY: 0, transformOrigin: 'top center',
        duration: 0.48, ease: 'expo.in'
      }, '-=0.12')
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

    <header class="site-header" :class="{ 'site-header--menu-open': menuOpen }">
      <div class="container site-header__inner">
        <NuxtLink to="/" class="brand" @click="menuOpen = false">mannaeden</NuxtLink>

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

    <!-- Overlay -->
    <div class="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation principale">
      <div class="overlay-panel">

        <!-- Deco botanique droite -->
        <div class="overlay-deco" aria-hidden="true">
          <svg viewBox="0 0 130 680" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M65 680 L65 0" stroke="currentColor" stroke-width="0.8" opacity="0.25"/>
            <ellipse cx="33" cy="110" rx="42" ry="15" transform="rotate(-40 33 110)" fill="currentColor" opacity="0.14"/>
            <ellipse cx="97" cy="220" rx="42" ry="15" transform="rotate(38 97 220)" fill="currentColor" opacity="0.12"/>
            <ellipse cx="33" cy="340" rx="42" ry="15" transform="rotate(-36 33 340)" fill="currentColor" opacity="0.10"/>
            <ellipse cx="97" cy="460" rx="42" ry="15" transform="rotate(40 97 460)" fill="currentColor" opacity="0.08"/>
            <ellipse cx="33" cy="580" rx="42" ry="15" transform="rotate(-38 33 580)" fill="currentColor" opacity="0.06"/>
          </svg>
        </div>

        <!-- Nav principale -->
        <nav class="overlay-nav">
          <NuxtLink to="/planner" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">01</span>
            <span class="overlay-nav-label">Notre planner</span>
          </NuxtLink>
          <NuxtLink to="/comment-ca-marche" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">02</span>
            <span class="overlay-nav-label">Comment ça marche</span>
          </NuxtLink>
          <NuxtLink to="/boutique" class="overlay-nav-item" @click="menuOpen = false">
            <span class="overlay-nav-num">03</span>
            <span class="overlay-nav-label">Boutique</span>
          </NuxtLink>
        </nav>

        <!-- Footer overlay -->
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
  </div>
</template>

<style scoped>
/* ══ HEADER ══════════════════════════════════════ */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  transition: background 0.3s, border-color 0.3s;
  border-bottom: 1px solid rgba(217, 208, 190, 0.3);
  background: rgba(245, 240, 232, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.site-header--menu-open {
  background: transparent;
  border-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1.1rem;
}

.brand {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  color: var(--color-green-deep);
  position: relative;
  z-index: 201;
  transition: color 0.3s;
}

.site-header--menu-open .brand {
  color: rgba(245, 240, 232, 0.75);
}

/* ══ HAMBURGER ════════════════════════════════════ */
.hamburger {
  position: relative;
  z-index: 201;
  display: flex;
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
  width: 28px;
  height: 1.5px;
  background: var(--color-green-deep);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
              opacity 0.3s,
              background 0.3s,
              width 0.3s;
}

.site-header--menu-open .bar {
  background: rgba(245, 240, 232, 0.8);
}

/* Ouvrir → X */
.hamburger--open .bar-top {
  transform: translateY(4.25px) rotate(45deg);
}
.hamburger--open .bar-btm {
  transform: translateY(-4.25px) rotate(-45deg);
}

/* Fermé → top plus court (effet editorial) */
.bar-top { width: 20px; }
.bar-btm { width: 28px; }
.hamburger--open .bar-top { width: 28px; }

/* ══ OVERLAY ══════════════════════════════════════ */
/* autoAlpha: 0 → visibility: hidden (GSAP) — les interactions sont bloquées naturellement */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 199;
  visibility: hidden;
}

.overlay-panel {
  position: absolute;
  inset: 0;
  background: #1a2e1a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Deco botanique */
.overlay-deco {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: clamp(120px, 18vw, 240px);
  color: rgba(245, 240, 232, 0.9);
  pointer-events: none;
}

.overlay-deco svg {
  width: 100%;
  height: 100%;
}

/* Nav links */
.overlay-nav {
  position: relative;
  z-index: 2;
  padding: 0 clamp(2rem, 8vw, 8rem);
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.overlay-nav-item {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding-block: 0.6rem;
  border-bottom: 1px solid rgba(245, 240, 232, 0.07);
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.2s;
}

.overlay-nav-item:first-child { border-top: 1px solid rgba(245, 240, 232, 0.07); }

.overlay-nav-item:hover .overlay-nav-label {
  transform: translateX(8px);
  opacity: 0.65;
}

.overlay-nav-num {
  font-size: clamp(0.65rem, 1vw, 0.75rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(184, 150, 46, 0.6);
  flex-shrink: 0;
  width: 2rem;
}

.overlay-nav-label {
  font-family: var(--font-serif);
  font-size: clamp(2.8rem, 7vw, 6.5rem);
  font-weight: 600;
  line-height: 1.05;
  color: rgba(245, 240, 232, 0.82);
  letter-spacing: -0.02em;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.35s;
}

/* Footer */
.overlay-footer {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding: 2rem clamp(2rem, 8vw, 8rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(245, 240, 232, 0.08);
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
  color: rgba(245, 240, 232, 0.75);
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.overlay-auth-link em {
  font-family: var(--font-serif);
  font-style: italic;
  color: rgba(184, 150, 46, 0.8);
}

.overlay-auth-link:hover { color: rgba(245, 240, 232, 1); }

.overlay-auth-link--muted { color: rgba(245, 240, 232, 0.32); }
.overlay-auth-link--muted:hover { color: rgba(245, 240, 232, 0.6); }

.overlay-verse {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.82rem;
  color: rgba(245, 240, 232, 0.2);
  max-width: 320px;
  line-height: 1.55;
  text-align: right;
}

.overlay-verse span {
  display: block;
  font-style: normal;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
  color: rgba(245, 240, 232, 0.12);
}

</style>
