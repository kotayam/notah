/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': {'min': '360px', 'max': '640px'},
        'tablet': {'min': '641px', 'max': '1030px'},
        'laptop': {'min': '1031px'}
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

