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
          terracotta: '#B85042',
          terracottaHover: '#9E4336',
          warmBeige: '#E7E8D1',
          mutedTeal: '#A7BEAE',
          mutedTealHover: '#8FA697',
          white: '#FFFFFF',
          charcoal: '#30342F',
          softSage: '#D5D8C3',
          mutedText: '#74796F',
          border: '#D6D8C8',
        },
        command: {
          bg: '#E7E8D1',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#D5D8C3',
          cardElevated: '#FFFFFF',
          border: '#D6D8C8',
          borderLight: '#E2E4D6',
          primary: '#B85042',
          primaryHover: '#9E4336',
          secondary: '#A7BEAE',
          secondaryHover: '#8FA697',
          success: '#4E8760',
          warning: '#D97706',
          critical: '#B85042',
          text: '#30342F',
          textSecondary: '#74796F',
          textMuted: '#74796F'
        },
        goi: {
          navy: '#30342F',
          blue: '#B85042',
          teal: '#A7BEAE',
          orange: '#D97706',
          red: '#B85042',
          green: '#4E8760',
          white: '#FFFFFF',
          lightblue: '#D5D8C3',
          greytext: '#74796F',
          greyborder: '#D6D8C8',
          pagebg: '#E7E8D1',
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
        'subtle': '0 1px 3px 0 rgba(48, 52, 47, 0.05), 0 1px 2px -1px rgba(48, 52, 47, 0.03)',
        'command-card': '0 1px 3px 0 rgba(48, 52, 47, 0.05), 0 1px 2px -1px rgba(48, 52, 47, 0.03)',
        'command-glow': '0 0 0 1px rgba(184, 80, 66, 0.18)',
        'command-blue': '0 0 0 1px rgba(167, 190, 174, 0.25)',
        'command-critical': '0 0 0 1px rgba(184, 80, 66, 0.25)',
      }
    },
  },
  plugins: [],
}
