import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#8b5cf6',
        'accent-hover': '#7c3aed',
        'dark-body': '#111111',
        'dark-header': '#1c1c1c',
        'dark-card': '#1a1a1a',
        'dark-card-hover': '#252525',
        'dark-border': '#2a2a2a',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-up-1': 'slideUp 0.6s ease-out 0.1s forwards',
        'slide-up-2': 'slideUp 0.6s ease-out 0.25s forwards',
        'slide-up-3': 'slideUp 0.6s ease-out 0.4s forwards',
        'slide-up-4': 'slideUp 0.6s ease-out 0.55s forwards',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
