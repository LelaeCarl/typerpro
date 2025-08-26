import { TopToolbar } from './components/TopToolbar';
import { TestSurface } from './components/TestSurface';
import { KeyboardHandler } from './components/KeyboardHandler';

function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-mono">
      <TopToolbar />
      <TestSurface />
      <KeyboardHandler />
    </div>
  );
}

export default App;
