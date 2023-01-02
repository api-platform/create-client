/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Next
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // Vue
    "./index.html",
    "./src/**/*.{vue,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
