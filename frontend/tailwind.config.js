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
          cherry: '#990011',
          cherryHover: '#80000e',
          offWhite: '#FCF6F5',
          white: '#FFFFFF',
          charcoal: '#252124',
          warmSurface: '#EDE4E2',
          mutedText: '#786D6D',
          border: '#E7DAD8',
        },
        command: {
          bg: '#FCF6F5',
          sidebar: '#FCF6F5',
          card: '#FFFFFF',
          cardHover: '#EDE4E2',
          cardElevated: '#FFFFFF',
          border: '#E7DAD8',
          borderLight: '#F0E8E6',
          primary: '#990011',
          primaryHover: '#80000e',
          secondary: '#252124',
          secondaryHover: '#181517',
          success: '#10B981',
          warning: '#D97706',
          critical: '#990011',
          text: '#252124',
          textSecondary: '#786D6D',
          textMuted: '#9E9494'
        },
        goi: {
          navy: '#252124',
          blue: '#990011',
          teal: '#990011',
          orange: '#D97706',
          red: '#990011',
          green: '#10B981',
          white: '#FFFFFF',
          lightblue: '#EDE4E2',
          greytext: '#786D6D',
          greyborder: '#E7DAD8',
          pagebg: '#FCF6F5',
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
        'subtle': '0 1px 3px 0 rgba(37, 33, 36, 0.06), 0 1px 2px -1px rgba(37, 33, 36, 0.04)',
        'command-card': '0 1px 3px 0 rgba(37, 33, 36, 0.05), 0 1px 2px -1px rgba(37, 33, 36, 0.03)',
        'command-glow': '0 0 0 1px rgba(153, 0, 17, 0.15)',
        'command-blue': '0 0 0 1px rgba(153, 0, 17, 0.15)',
        'command-critical': '0 0 0 1px rgba(153, 0, 17, 0.25)',
      }
    },
  },
  plugins: [],
}
