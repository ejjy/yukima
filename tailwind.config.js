/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEW PRIMARY COLORS - Updated for MVP
        'primary-blush': '#F7C6D1',      // Soft blush pink for buttons, accents
        'primary-lavender': '#D9C2F0',   // Soft lavender for headers, secondary elements
        'pure-white': '#FFFFFF',         // Clean white for backgrounds
        
        // NEW SUPPORTING COLORS
        'soft-gray': '#F0F0F0',          // Light gray for dividers, skeleton loaders
        'deep-charcoal': '#2D2D2D',      // Dark charcoal for text
        'golden-amber': '#FF8A80',       // Coral glow for CTAs, savings highlights
        
        // OPTIONAL DARK THEME COLORS (for future use)
        'dark-background': '#1C1C1C',
        'muted-pink': '#E7A8B6',
        'muted-lavender': '#C4A8E0',
        'light-gray-dark': '#D0D0D0',
        
        // Legacy colors (keeping for backward compatibility during transition)
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        blush: {
          50: '#fef7f0',
          100: '#feeee0',
          200: '#fdd9c0',
          300: '#fbbf95',
          400: '#f8bbd9',
          500: '#f472b6',
          600: '#ec4899',
          700: '#db2777',
          800: '#be185d',
          900: '#9d174d',
        },
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(247, 198, 209, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(247, 198, 209, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}