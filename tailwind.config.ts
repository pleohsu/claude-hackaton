import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        shell: {
          50: '#fdf4f3',
          100: '#fce9e7',
          200: '#f9d6d3',
          300: '#f4b8b2',
          400: '#ec8d84',
          500: '#e06556',
          600: '#cc4b3b',
          700: '#ab3c2f',
          800: '#8d352b',
          900: '#753229',
        },
      },
    },
  },
  plugins: [],
}
export default config
