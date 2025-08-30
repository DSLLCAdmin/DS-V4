<!-- Updated: 2025-08-30T20:54:08.135Z -->
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        swatch101: '#FFF7CB', // replace with your exact palette hex
        swatch102: '#F4D6ED',
        swatch103: '#B7011F',
        swatch104: '#883E3A',
        swatch105: '#572A1E',
        swatch201: '#E1E6E7',
        swatch202: '#B0BDC0',
        swatch203: '#6A8085',
        swatch204: '#3B3929',
        swatch205: '#000000',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
