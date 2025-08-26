import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store';
import { useTestStore } from './store/testStore';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import CommandPalette from './components/CommandPalette';
import KeyboardHandler from './components/KeyboardHandler';

function App() {
  const { closeCommandPalette, commandPaletteOpen } = useAppStore();
  const { actions } = useTestStore();

  // Start a default test on app load
  useEffect(() => {
    actions.resetAndRebuild();
  }, [actions]);

  return (
    <div 
      className="min-h-[100svh] bg-bg text-text"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
      }}
    >
      <KeyboardHandler />
      
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>

      {commandPaletteOpen && (
        <CommandPalette onClose={closeCommandPalette} />
      )}
    </div>
  );
}

export default App;
