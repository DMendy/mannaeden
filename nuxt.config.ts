// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: { port: 5174 },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'mannaeden — Graines de Foi',
      titleTemplate: '%s',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'description', content: 'Un planner chrétien ancré dans la foi, pour structurer et habiter chaque jour de l\'année avec intention.' },
        { property: 'og:site_name', content: 'mannaeden' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png?v=2' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000'
    }
  }
})
