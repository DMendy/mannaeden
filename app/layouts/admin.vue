<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  logout()
  router.push('/connexion')
}

const navItems = [
  { label: 'Commandes', path: '/admin/commandes', icon: 'orders' },
  { label: 'Stock', path: '/admin/stock', icon: 'stock' },
]
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="brand-text">mannaeden</span>
        <span class="brand-sub">admin</span>
      </div>

      <nav class="sidebar__nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': route.path.startsWith(item.path) }"
        >
          <!-- Orders icon -->
          <svg v-if="item.icon === 'orders'" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/>
            <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <!-- Stock icon -->
          <svg v-if="item.icon === 'stock'" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 13l4-4 3 3 4-5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/>
          </svg>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar__footer">
        <div class="admin-user">
          <span class="admin-user__name">{{ user?.prenom }} {{ user?.nom }}</span>
          <span class="admin-user__role">Administrateur</span>
        </div>
        <button class="logout-btn" @click="handleLogout">Déconnexion</button>
      </div>
    </aside>

    <!-- Main -->
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100dvh;
  background: #f5f5f3;
}

/* SIDEBAR */
.sidebar {
  background: var(--color-green-deep);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.25rem;
  position: sticky;
  top: 0;
  height: 100dvh;
}

.sidebar__brand {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 2rem;
}

.brand-text {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #fff;
}

.brand-sub {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.875rem;
  border-radius: 8px;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.55);
  transition: background 0.15s, color 0.15s;
}

.nav-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.85);
}

.nav-item--active {
  background: rgba(255,255,255,0.12);
  color: #fff;
  font-weight: 500;
}

.sidebar__footer {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-user__name {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
}

.admin-user__role {
  display: block;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
  margin-top: 0.15rem;
}

.logout-btn {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: color 0.15s;
}

.logout-btn:hover { color: rgba(255,255,255,0.7); }

/* MAIN */
.admin-main {
  padding: 2.5rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    align-items: center;
    padding: 1rem 1.25rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .sidebar__brand { padding-bottom: 0; border-bottom: none; margin-bottom: 0; }
  .sidebar__nav { flex-direction: row; flex: 0; }
  .sidebar__footer { border-top: none; padding-top: 0; flex-direction: row; align-items: center; margin-left: auto; }
  .admin-user { display: none; }

  .admin-main { padding: 1.5rem; }
}
</style>
