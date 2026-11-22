/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#080D16',
          sidebar: '#0D1522',
          card: '#111D2D',
          cardHover: '#16253B',
          cardElevated: '#152238',
          border: '#1E2E45',
          borderLight: '#2A3F5E',
          primary: '#19C6D2',
          primaryHover: '#16b2bd',
          secondary: '#438BFF',
          secondaryHover: '#3377eb',
          success: '#20C997',
          warning: '#FFB547',
          critical: '#FF5252',
          text: '#F5F7FA',
          textSecondary: '#94A3B8',
          textMuted: '#64748B'
        },
        goi: {
          navy: '#0D1522',
          blue: '#438BFF',
          teal: '#19C6D2',
          orange: '#FFB547',
          red: '#FF5252',
          green: '#20C997',
          white: '#F5F7FA',
          lightblue: '#16253B',
          greytext: '#94A3B8',
          greyborder: '#1E2E45',
          pagebg: '#080D16',
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
        'command-card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'command-glow': '0 0 0 1px rgba(14, 165, 233, 0.2)',
        'command-blue': '0 0 0 1px rgba(56, 189, 248, 0.2)',
        'command-critical': '0 0 0 1px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
