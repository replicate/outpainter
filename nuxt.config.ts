// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: {
    enabled: false
  },
  runtimeConfig: {
    replicateApiToken: process.env.REPLICATE_API_TOKEN || ''
  },
  nitro: {
    preset: 'vercel-edge'
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Outpainter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Expand the contents of an image using generative fill.'
        },
        {
          property: 'og:title',
          content: 'Outpainter'
        },
        {
          property: 'og:description',
          content: 'Expand the contents of an image using generative fill.'
        },
        {
          property: 'og:url',
          content: 'https://outpainter.app/'
        },
        {
          property: 'og:image',
          content: 'https://outpainter.app/cover.jpeg'
        },
        {
          property: 'twitter:image',
          content: 'https://outpainter.app/cover.jpeg'
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:title',
          content: 'Outpainter'
        },
        {
          property: 'twitter:description',
          content: 'Expand the contents of an image using generative fill.'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          sizes: 'any'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        }
      ]
    }
  }
})
