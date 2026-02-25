/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#0a0a0f',
          lighter: '#0D1117',
        },
        prana: {
          DEFAULT: '#00D9C0',
          teal: '#4ECDC4',
        },
        ananda: {
          DEFAULT: '#FFD700',
          amber: '#F39C12',
        },
        kosha: {
          annamaya: '#FF6B6B',
          pranamaya: '#00D9C0',
          manomaya: '#9B59B6',
          vijnanamaya: '#3498DB',
          anandamaya: '#F39C12',
        },
        yuga: {
          krita: '#FFD700',
          treta: '#C0C0C0',
          dvapara: '#CD7F32',
          kali: '#4A5568',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'prana-pulse': 'pranaPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'mandala': 'mandalaSpin 120s linear infinite',
      },
      keyframes: {
        pranaPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        mandalaSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
