export default defineNuxtPlugin(async () => {
  const { user, token, fetchMe } = useAuth()
  if (token.value && !user.value) {
    await fetchMe()
  }
})
