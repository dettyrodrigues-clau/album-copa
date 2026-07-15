/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // World Cup / Brazil palette
        verde: {
          50: '#e6f7ee',
          100: '#bfead2',
          200: '#8edcb1',
          400: '#27b367',
          500: '#009C3B',  // primary green
          600: '#008132',
          700: '#006627',
          800: '#004d1c'
        },
        amarelo: {
          50: '#fffce6',
          100: '#fff7b3',
          400: '#ffe333',
          500: '#FFDF00',  // primary yellow
          600: '#e0c200',
          700: '#a89200'
        },
        azul: {
          50: '#e6ecf5',
          100: '#bdcae6',
          400: '#1f3fa3',
          500: '#002776',  // primary blue
          600: '#001f5e',
          700: '#001747',
          900: '#000f30'
        },
        cinza: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'card': '0 2px 14px rgba(0, 39, 118, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 39, 118, 0.14)',
        'inset-soft': 'inset 0 1px 2px rgba(0,0,0,0.06)'
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'pop': 'pop 0.2s ease-out'
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        'pop': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}
