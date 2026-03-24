import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f2ff',
          100: '#eee5ff',
          200: '#d6bfff',
          300: '#bd97ff',
          400: '#a26bf2',
          500: '#7B2CBF',
          600: '#6B46C1',
          700: '#5a2390',
          800: '#430c65',
          900: '#2c083f'
        },
        progress: '#22c55e'
      },      ringColor: theme => ({
        ...theme('colors'),
        brand: '#7B2CBF',
      }),      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
