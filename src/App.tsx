import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import CommandPalette from './components/CommandPalette';
import KeyboardHandler from './components/KeyboardHandler';

function App() {
  const { currentTest, startNewTest, toggleCommandPalette, closeCommandPalette, commandPaletteOpen } = useAppStore();

  // Start a default test on app load
  useEffect(() => {
    if (!currentTest) {
      startNewTest('words');
    }
  }, [currentTest, startNewTest]);

  return (
    <div className="min-h-screen bg-background-base text-text-primary">
      <KeyboardHandler />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
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
