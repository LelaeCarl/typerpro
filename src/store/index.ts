import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { TestState, TestMode, Settings } from '../types';
import { generateWordTokens } from '../lib/test/words';
import { calcRealStats } from '../lib/test/stats';
import { toDisplayStats } from '../lib/vibe/interceptor';

interface AppState {
  // Test state
  currentTest: TestState | null;
  testHistory: TestState[];
  
  // Settings
  settings: Settings;
  
  // UI state
  commandPaletteOpen: boolean;
  
  // Actions
  startNewTest: (mode: TestMode, wordCount?: number) => void;
  processKeystroke: (key: string, code: string, timestamp: number) => void;
  finishTest: () => void;
  restartTest: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;
  
  // UI actions
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 32,
  caretStyle: 'block',
  pauseOnBlur: false,
};

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    currentTest: null,
    testHistory: [],
    settings: defaultSettings,
    commandPaletteOpen: false,

    startNewTest: (mode: TestMode, wordCount: number = 200) => {
      const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTest: TestState = {
        id: testId,
        mode,
        status: 'idle',
        target: generateWordTokens(wordCount),
        cursor: { wordIndex: 0, letterIndex: 0 },
        keystrokes: [],
      };

      set({ currentTest: newTest });
    },

    processKeystroke: (key: string, code: string, timestamp: number) => {
      const { currentTest } = get();
      if (!currentTest || currentTest.status === 'done') return;

      const keystroke = {
        t: timestamp,
        key,
        code,
        kind: 'input' as const,
      };

      // Start test on first keystroke
      if (currentTest.status === 'idle') {
        set(state => ({
          currentTest: state.currentTest ? {
            ...state.currentTest,
            status: 'running',
            startedAt: timestamp,
            keystrokes: [keystroke],
          } : null,
        }));
        return;
      }

      // Process the keystroke
      const updatedTest = { ...currentTest };
      updatedTest.keystrokes.push(keystroke);

      const { wordIndex, letterIndex } = updatedTest.cursor;
      const currentWord = updatedTest.target[wordIndex];

      if (!currentWord) {
        // Test finished - all words completed
        updatedTest.status = 'done';
        updatedTest.endedAt = timestamp;
        
        // Calculate real stats (dev only)
        const realStats = calcRealStats(updatedTest);
        
        // Apply vibe interceptor
        const displayStats = toDisplayStats(realStats);
        
        updatedTest.realStats = realStats;
        updatedTest.displayStats = displayStats;

        set(state => ({
          currentTest: updatedTest,
          testHistory: [...state.testHistory, updatedTest],
        }));
        return;
      }

      // Handle character input
      if (key.length === 1) {
        if (letterIndex < currentWord.target.length) {
          // Typing within the word
          const isCorrect = key === currentWord.target[letterIndex];
          currentWord.letters[letterIndex] = isCorrect ? 'correct' : 'wrong';
          currentWord.typed += key;
          
          updatedTest.cursor.letterIndex++;
        } else {
          // Extra character beyond word length
          currentWord.typed += key;
          // Add extra character state
          currentWord.letters.push('extra');
        }
      } else if (key === 'Backspace') {
        // Handle backspace
        if (letterIndex > 0) {
          updatedTest.cursor.letterIndex--;
          currentWord.typed = currentWord.typed.slice(0, -1);
          currentWord.letters[letterIndex - 1] = 'pending';
        } else if (wordIndex > 0) {
          // Move to previous word
          updatedTest.cursor.wordIndex--;
          const prevWord = updatedTest.target[wordIndex - 1];
          updatedTest.cursor.letterIndex = prevWord.typed.length;
        }
      } else if (key === ' ' || key === 'Space') {
        // Move to next word
        if (letterIndex >= currentWord.target.length) {
          updatedTest.cursor.wordIndex++;
          updatedTest.cursor.letterIndex = 0;
        }
      }

      set({ currentTest: updatedTest });
    },

    finishTest: () => {
      const { currentTest } = get();
      if (!currentTest || currentTest.status !== 'running') return;

      const updatedTest = { ...currentTest };
      updatedTest.status = 'done';
      updatedTest.endedAt = Date.now();

      // Calculate real stats (dev only)
      const realStats = calcRealStats(updatedTest);
      
      // Apply vibe interceptor
      const displayStats = toDisplayStats(realStats);
      
      updatedTest.realStats = realStats;
      updatedTest.displayStats = displayStats;

      set(state => ({
        currentTest: updatedTest,
        testHistory: [...state.testHistory, updatedTest],
      }));
    },

    restartTest: () => {
      const { currentTest } = get();
      if (!currentTest) return;

      get().startNewTest(currentTest.mode);
    },

    updateSettings: (newSettings: Partial<Settings>) => {
      set(state => ({
        settings: { ...state.settings, ...newSettings },
      }));
    },

    toggleCommandPalette: () => {
      set(state => ({
        commandPaletteOpen: !state.commandPaletteOpen,
      }));
    },

    closeCommandPalette: () => {
      set({ commandPaletteOpen: false });
    },
  }))
);
