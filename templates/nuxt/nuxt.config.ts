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
  ssr: true,
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    // Greetings page generated on demand, revalidates in background, cached until API response changes
    "/greetings": { swr: true },
    // Greetings page generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
    "/greetings/**": { swr: 1 },
  },
});
