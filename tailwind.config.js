/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 Importante, debe ser 'class'
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}

