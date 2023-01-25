// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/style.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Waiting for https://github.com/unjs/nitro/issues/603 to enable SSR (SWR).
  ssr: false,
  routeRules: {
    "/**": { swr: 1 }
  },
  nitro: {
    commands: {
      preview: 'npx serve ./public'
    }
  }
})
