// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: { port: 5174 },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'mannaeden — Graines de Foi',
      meta: [
        { name: 'description', content: 'Un planner chrétien conçu pour structurer et ancrer votre vie tout au long de l\'année.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-dark.png' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000'
    }
  }
})
