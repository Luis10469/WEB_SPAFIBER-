/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spefiber: {
          dark: '#090711',
          darker: '#06040C',
          surface: '#140D26',
          surfaceLight: '#1B1233',
          purple: '#8B3DFF',
          purpleLight: '#B45CFF',
          purpleGlow: 'rgba(180, 92, 255, 0.4)',
          purpleMuted: '#58249B',
          silver: '#C7C9D1',
          textMuted: '#B5B0C2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px rgba(180, 92, 255, 0.35)',
        'glow-purple-lg': '0 0 50px rgba(180, 92, 255, 0.45)',
        'glow-purple-sm': '0 0 15px rgba(139, 61, 255, 0.3)',
        'inner-glow': 'inset 0 0 15px rgba(180, 92, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 70% 30%, rgba(139, 61, 255, 0.15) 0%, rgba(20, 13, 38, 0.6) 45%, #090711 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
