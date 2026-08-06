export default defineNuxtRouteMiddleware((to) => {
  const { user, token } = useAuth()
  if (!token.value) {
    return navigateTo({ path: '/connexion', query: { redirect: to.fullPath } })
  }
  if (user.value?.role !== 'ADMIN') {
    return navigateTo('/')
  }
})
