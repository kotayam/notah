/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': {'max': '480px'},
      },
      height: {
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '240': '60rem'
      },
      width: {
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '240': '60rem'
      }
    },
  },
  plugins: [],
}

