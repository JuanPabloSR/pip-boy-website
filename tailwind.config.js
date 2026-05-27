/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pipboy-green': '#14F814',
        'pipboy-green-dim': '#0c940c',
        'pipboy-bg': '#000000',
      },
      fontFamily: {
        pipboy: ['"Share Tech Mono"', '"VT323"', 'monospace'],
      },
      backgroundImage: {
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.98' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
