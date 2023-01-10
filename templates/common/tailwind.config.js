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
    "./components/**/*.{vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.ts",
    "./nuxt.config.ts",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
