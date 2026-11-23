/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          saffron: '#F58220',
          saffronHover: '#E06F14',
          forestGreen: '#138A45',
          forestGreenHover: '#0F7037',
          oceanBlue: '#2477C8',
          oceanBlueHover: '#1C64AA',
          white: '#FFFFFF',
          navy: '#102A43',
          bgLight: '#F5F8FC',
          darkText: '#263238',
          mutedText: '#627D98',
          border: '#D9E2EC',
          surfaceLight: '#EBF2FA',
          hazardRed: '#DC3545',
          warningYellow: '#EAB308',
        },
        command: {
          bg: '#F5F8FC',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#EBF2FA',
          cardElevated: '#FFFFFF',
          border: '#D9E2EC',
          borderLight: '#EDF2F7',
          primary: '#F58220',
          primaryHover: '#E06F14',
          secondary: '#2477C8',
          secondaryHover: '#1C64AA',
          success: '#138A45',
          warning: '#EAB308',
          critical: '#DC3545',
          text: '#263238',
          textSecondary: '#627D98',
          textMuted: '#627D98',
          navy: '#102A43'
        },
        goi: {
          navy: '#102A43',
          saffron: '#F58220',
          green: '#138A45',
          blue: '#2477C8',
          orange: '#F58220',
          red: '#DC3545',
          yellow: '#EAB308',
          white: '#FFFFFF',
          lightbg: '#F5F8FC',
          surface: '#EBF2FA',
          greytext: '#627D98',
          greyborder: '#D9E2EC',
          darktext: '#263238',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        regional: ['Noto Sans', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
      },
      spacing: {
        '240': '240px',
        '480': '480px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 42, 67, 0.05), 0 1px 2px -1px rgba(16, 42, 67, 0.03)',
        'command-card': '0 1px 3px 0 rgba(16, 42, 67, 0.06), 0 1px 2px -1px rgba(16, 42, 67, 0.04)',
        'command-glow': '0 0 0 1px rgba(245, 130, 32, 0.2)',
        'command-blue': '0 0 0 1px rgba(36, 119, 200, 0.25)',
        'command-critical': '0 0 0 1px rgba(220, 53, 69, 0.25)',
      }
    },
  },
  plugins: [],
}
