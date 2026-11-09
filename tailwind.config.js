/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porjotok: {
          ivory: '#F4F1EA',
          'ivory-light': '#FBF9F5',
          'ivory-dark': '#E6E1D5',
          'ivory-border': '#DED8CB',
          teal: {
            DEFAULT: '#0F2B34',
            deep: '#0F2B34',
            dark: '#0A1E24',
            darker: '#061418',
            card: '#143844',
            panel: '#102F39',
            muted: '#7B98A2',
            light: '#ADC5CE',
            border: '#1B4856',
          },
          yellow: {
            DEFAULT: '#FDD835',
            bright: '#FFDE00',
            border: '#FDD835',
            glow: '#FFE566',
          },
          red: {
            DEFAULT: '#A31D1D',
            bright: '#C41E24',
            dark: '#851414',
          },
          charcoal: {
            DEFAULT: '#1E2328',
            dark: '#14181B',
            muted: '#5A636D',
          }
        }
      },
      fontFamily: {
        serif: ['SolaimanLipi', '"Noto Serif Bengali"', 'Georgia', 'serif'],
        sans: ['SolaimanLipi', '"Hind Siliguri"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SolaimanLipi', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'yellow-frame': '0 0 0 4px #FDD835',
        'yellow-frame-lg': '0 0 0 6px #FDD835',
        'editorial': '0 10px 30px -10px rgba(15, 43, 52, 0.15)',
        'editorial-deep': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
