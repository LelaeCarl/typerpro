# TyperPro - Vibe Mode (Arcade) 🎯

A Monkeytype-style typing application with **vibe-coded metrics** - where the displayed statistics are consistently fake yet engaging, creating an arcade-like experience.

**🌐 Live Demo**: [https://lelaecarl.github.io/typerpro/](https://lelaecarl.github.io/typerpro/)

## ✨ Features

### 🎮 Core Experience
- **Monkeytype-style UX** with smooth animations and transitions
- **Time-gated mode** with streaming word buffers (not list-gated)
- **Mobile-first design** with soft keyboard support
- **Vibe metrics** - WPM 150-273, Accuracy 95-100% (always impressive!)

### 📱 Mobile Support
- **iOS Safari & Android Chrome** optimized
- **Soft keyboard integration** with proper input handling
- **Touch-friendly interface** with 44px+ touch targets
- **Safe area handling** for notched devices
- **Responsive design** that works on all screen sizes

### 🎨 Visual Design
- **Serika-inspired dark theme** with yellow accents
- **Smooth animations** using Framer Motion
- **Proper color contrast** for accessibility
- **Reduced motion support** for users with motion sensitivity

### ⌨️ Typing Engine
- **Hidden input architecture** for precise keystroke capture
- **IME composition support** for international keyboards
- **Real-time character highlighting** (correct/wrong/extra)
- **Space advances words** without DOM insertion
- **Backspace works** within and across word boundaries

### ⚡ Performance
- **Streaming word buffers** for infinite typing
- **50ms timer ticks** for precise time tracking
- **Efficient rendering** with virtual word indexing
- **Memory management** with buffer cleanup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/LelaeCarl/typerpro.git
cd typerpro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## 🎯 How It Works

### Vibe Mode (Arcade)
TyperPro uses **fake metrics** to create an engaging arcade experience:

- **Real stats are calculated** internally for development
- **Display stats are overridden** at test completion
- **WPM: 150-273** (always impressive!)
- **Accuracy: 95-100%** (consistently high)
- **Results use only fake metrics** - never the real ones

### Time Mode Engine
- **Deadline-based completion** (not word list completion)
- **Streaming buffers** with 80-160 words
- **Auto-extension** when approaching buffer end
- **Virtual indexing** for smooth performance

### Mobile Input System
- **Tiny visible input** (1x1px) to summon soft keyboard
- **beforeinput/input events** for character capture
- **Auto-refocus** when input blurs
- **Tap anywhere** to start typing

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + Playwright
- **Deployment**: GitHub Pages + GitHub Actions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Chip.tsx        # Interactive mode/duration chips
│   ├── CommandPalette.tsx # Command overlay
│   ├── HudFooter.tsx   # Bottom navigation
│   ├── Letter.tsx      # Individual letter rendering
│   ├── Navbar.tsx      # Top navigation
│   ├── ResultsGraph.tsx # WPM/accuracy charts
│   ├── TestSurface.tsx # Main typing area
│   └── TopToolbar.tsx  # Mode/duration selection
├── lib/
│   ├── test/           # Core typing logic
│   │   ├── engine.ts   # Time mode engine
│   │   ├── stats.ts    # Real statistics calculation
│   │   └── words.ts    # Word generation
│   └── vibe/           # Fake metrics system
│       ├── generators.ts # Vibe metric generators
│       └── interceptor.ts # Display stats override
├── pages/              # Route components
│   ├── TestPage.tsx    # Main typing test
│   └── ResultsPage.tsx # Results display
├── store/              # State management
│   ├── configStore.ts  # App configuration
│   ├── testStore.ts    # Test state and actions
│   └── index.ts        # Main app store
└── types/              # TypeScript definitions
```

## 🎮 Usage

### Desktop
- **Type** to start the test
- **Tab + Enter** to restart
- **Esc** or **Ctrl/Cmd + Shift + P** for command palette
- **Space** advances to next word

### Mobile
- **Tap anywhere** in the test area to summon keyboard
- **Type normally** - the app handles input automatically
- **Swipe** to access command palette
- **Tap chips** to change mode/duration

### Modes
- **Words**: Complete a set number of words
- **Time**: Type for a specific duration (15s/30s/60s/120s)
- **Quote**: Type a specific quote (coming soon)
- **Zen**: Unlimited typing (coming soon)

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

Tests cover:
- Typing flow and character highlighting
- Space/backspace functionality
- Mode switching and duration selection
- Mobile input handling
- Vibe metrics validation

## 🚀 Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to main branch** triggers deployment
2. **GitHub Actions** builds the app
3. **Deploys to gh-pages branch**
4. **Available at**: https://lelaecarl.github.io/typerpro/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monkeytype** for the UX inspiration
- **Serika theme** for the color palette
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling

---

**🎯 Remember**: This is **Vibe Mode (Arcade)** - the metrics are intentionally fake for an engaging experience! The real performance is calculated internally but never displayed to users.
