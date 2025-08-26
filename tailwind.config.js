/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--tp-bg)',
        panel: 'var(--tp-panel)',
        'panel-border': 'var(--tp-panel-border)',
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
      transitionDuration: {
        '120': '120ms',
        '110': '110ms',
      }
    }
  },
  plugins: []
}
