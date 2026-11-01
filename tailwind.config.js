/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tangerine: {
          DEFAULT: '#FF6A1A',
          50: '#FFF1E9',
          100: '#FFE1CC',
          200: '#FFC299',
          300: '#FFA366',
          400: '#FF8533',
          500: '#FF6A1A',
          600: '#E85400',
          700: '#B54200',
          800: '#823000',
          900: '#4F1E00',
        },
        // shadcn/ui token names, wired directly to the T4N black/orange
        // palette (no CSS-variable indirection — this app is dark-only).
        background: '#0f0f11',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#18181b',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#18181b',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#FF6A1A',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#27272a',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#27272a',
        input: '#27272a',
        ring: '#FF6A1A',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
