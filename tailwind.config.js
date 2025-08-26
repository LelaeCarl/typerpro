/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-base': '#2c2e31',
        'accent-yellow': '#5a5951',
        'semantic-error': '#313437',
        'text-primary': '#5a5951',
        'text-secondary': '#424446',
        'semantic-errorExtra': 'rgba(49,52,55,0.3)',
        'ui-caret': '#5a5951',
        'surface-panel': '#323438',
      },
      fontFamily: {
        'mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        'sans': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'md': '16px',
        'lg': '18px',
        'xl': '22px',
        'display-sm': '36px',
        'display-md': '48px',
        'display-lg': '72px',
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.25',
        'normal': '1.45',
        'relaxed': '1.6',
      },
      letterSpacing: {
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.02em',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '999px',
      },
      boxShadow: {
        'panel': '0 8px 24px rgba(0,0,0,0.35)',
        'tooltip': '0 2px 8px rgba(0,0,0,0.4)',
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
      },
    },
  },
  plugins: [],
}
