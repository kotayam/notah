/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': {'min': '300px', 'max': '640px'},
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
      },
      keyframes: {
        blinker: {
          '0%, 100%': {opacity: '1'},
          '50%': {opacity: '0'}
        },
        gradient: {
          '0%': {backgroundPosition: '0% 50%'},
          '50%': {backgroundPosition: '100% 50%'},
          '100%': {backgroundPosition: '0% 50%'}
        },
        slidein: {
          '0%': {transform: 'translateX(-500px)', opacity: '0'},
          '40%': {opacity: '1'},
          '100%': {transform: 'translateX(0)'}
        },
        slideup: {
          '0%': {transform: 'translateY(100px)', opacity: '0'},
          '100%': {transform: '0%', opacity: '1'}
        }
      },
      animation: {
        blinker: 'blinker 1s infinite step-end',
        gradient: 'gradient 10s ease infinite',
        slidein: 'slidein 3s',
        slideup: 'slideup 2s 2s backwards'
      },
    },
  },
  plugins: [],
}

