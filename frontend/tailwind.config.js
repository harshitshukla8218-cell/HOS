/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          ivory: '#FFF9F0',
          beige: '#F1E5D2',
          charcoal: '#1B302B',
          muted: '#626F68',
          champagne: '#9A6B2D',
          gold: '#D6AA4E',
          nearblack: '#173A34'
        },
        atelier: {
          sage: '#E5EFE5',
          peach: '#F9E7DE',
          marigold: '#F4EBCB',
          sky: '#E3EFF3',
          rose: '#F2E4E1',
          seafoam: '#E2EFEB',
          coral: '#A84C3B',
          teal: '#39766B'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        luxury: '0.15em'
      },
      height: {
        'hero': '85vh',
      }
    },
  },
  plugins: [],
}
