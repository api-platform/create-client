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
    //ANGULAR
    "./src/app/components/**/**/*.component.ts",
    "./src/app/components/**/**/*.component.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
