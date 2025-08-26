/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--tp-bg)',
        panel: 'var(--tp-panel)',
        text: 'var(--tp-text)',
        text2: 'var(--tp-text-2)',
        accent: 'var(--tp-accent)',
        error: 'var(--tp-error)',
        errorExtra: 'var(--tp-error-extra)',
        graph: {
          wpm: 'var(--tp-graph-wpm)',
          raw: 'var(--tp-graph-raw)',
          grid: 'var(--tp-graph-grid)'
        }
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
      transitionDuration: {
        '120': '120ms',
        '110': '110ms',
      }
    },
  },
  plugins: [],
}
