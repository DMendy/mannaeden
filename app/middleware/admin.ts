export default defineNuxtRouteMiddleware(async (to) => {
  const { user, token, fetchMe } = useAuth()
  if (!token.value) {
    return navigateTo({ path: '/connexion', query: { redirect: to.fullPath } })
  }
  if (!user.value) {
    await fetchMe()
  }
  if (user.value?.role !== 'ADMIN') {
    return navigateTo('/')
  }
})
