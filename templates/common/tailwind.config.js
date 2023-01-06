/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Next
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // Vue
    "./index.html",
    "./src/**/*.{vue,ts}",
    // Nuxt
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
