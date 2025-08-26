# TyperPro

A Monkeytype-style typing test application with **Vibe Mode (Arcade)** - featuring fake yet consistent metrics for a fun, arcade-like experience.

## Features

- **Minimalist typing interface** with smooth caret and unobtrusive HUD
- **Real-time character highlighting**: correct letters brighten, incorrect letters are red + underlined, extra keystrokes render as faint red glyphs
- **Vibe Mode**: All metrics are fake but consistent - WPM ranges from 150-273, accuracy from 95-100%
- **Multiple test modes**: words, time (15/30/60/120s), quote, zen
- **Command palette**: Quick access to settings and commands via Esc or Ctrl/Cmd+Shift+P
- **Keybinds**: Tab+Enter to restart, Esc for command palette
- **Results screen**: Beautiful graph with fake WPM data and comprehensive statistics
- **Serika-inspired dark theme** with yellow accents

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Routing**: React Router

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests with Playwright

## Project Structure

```
src/
├── components/          # React components
│   ├── CommandPalette.tsx
│   ├── HudFooter.tsx
│   ├── KeyboardHandler.tsx
│   ├── Navbar.tsx
│   ├── ResultsGraph.tsx
│   ├── TestSurface.tsx
│   └── TopToolbar.tsx
├── lib/                 # Core logic
│   ├── test/           # Test utilities
│   │   ├── stats.ts    # Real statistics calculation
│   │   └── words.ts    # Word generation
│   └── vibe/           # Vibe mode (fake metrics)
│       ├── generators.ts
│       └── interceptor.ts
├── pages/              # Page components
│   ├── ResultsPage.tsx
│   └── TestPage.tsx
├── store/              # Zustand store
│   └── index.ts
├── test/               # Test setup
├── types/              # TypeScript types
└── App.tsx             # Main app component
```

## Vibe Mode (Arcade)

TyperPro operates in "Vibe Mode" where all displayed metrics are fake but consistent:

- **WPM**: Random integer between 150-273
- **Accuracy**: Random value between 95-100%
- **Raw WPM**: Slightly varied from main WPM
- **Consistency**: Random value between 60-95%
- **Graph data**: Smooth curves generated around fake WPM values

Real statistics are calculated internally for development purposes but are never displayed to users. The vibe interceptor (`src/lib/vibe/interceptor.ts`) ensures the UI only sees fake metrics.

## Keybinds

- **Tab + Enter**: Restart test
- **Esc**: Open command palette
- **Ctrl/Cmd + Shift + P**: Open command palette
- **Ctrl + Enter**: Finish test early

## Testing

The application includes comprehensive testing:

- **Unit tests** for vibe generators and interceptors
- **E2E tests** for typing flow, keybinds, and results display
- **Accessibility tests** for keyboard navigation and screen readers

Run tests with:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

## Design System

The application uses a custom design system based on the Serika dark theme:

- **Colors**: Dark charcoal background (#2c2e31) with yellow accents (#5a5951)
- **Typography**: Monospace font for test surface, sans-serif for UI
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable design tokens for consistent styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Note**: This is a fun, arcade-style typing test. All metrics are intentionally fake for entertainment purposes. For serious typing practice, consider using Monkeytype or other professional typing test applications.
