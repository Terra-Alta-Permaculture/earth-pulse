/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base — deep earthy dark
        soil: {
          950: '#0d0f0d',
          900: '#131613',
          DEFAULT: '#161a16',
          800: '#1c211c',
          700: '#262c26',
          600: '#333b33',
        },
        bark: '#1a1d1a',
        // Crisis stream — warm amber / ember (concerned, not alarmist)
        ember: {
          50: '#fdf4e7',
          200: '#f4d9a8',
          400: '#e0a852',
          500: '#d18f36',
          600: '#b5741f',
          700: '#8f5a19',
        },
        // Regeneration stream — living green / moss
        moss: {
          50: '#eef6ec',
          200: '#bcdcb3',
          400: '#79b568',
          500: '#5a9d48',
          600: '#42813a',
          700: '#33632e',
        },
        // Neutral text — warm sand
        sand: {
          100: '#f0ece2',
          300: '#cfc7b5',
          500: '#9c937f',
          700: '#6b6455',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.7)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        eq: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        eq: 'eq 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
