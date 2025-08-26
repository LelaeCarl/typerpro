import { create } from 'zustand';
import type { WordToken, TestMode, TestState } from '../types';
import { generateWordTokens } from '../lib/test/words';
import { calcRealStats } from '../lib/test/stats';
import { toDisplayStats } from '../lib/vibe/interceptor';
import { TimeModeEngine } from '../lib/test/engine';
import { useConfigStore } from './configStore';

type Cursor = { wordIndex: number; letterIndex: number };

interface TestSlice {
  current: {
    status: 'idle' | 'running' | 'done';
    target: WordToken[];
    cursor: Cursor;
    startedAt?: number;
    endedAt?: number;
    realStats?: any;
    displayStats?: any;
    keystrokes: any[];
    mode: TestMode;
    id: string;
    remainingTime?: number;
    timeEngine?: TimeModeEngine | null;
  };
  actions: {
    startIfIdle(): void;
    typeChar(ch: string): void;
    commitSpace(): void;
    backspace(): void;
    resetAndRebuild(): void;
    finishTest(): void;
    initTimeMode(durationSec: number): void;
  };
}

export const useTestStore = create<TestSlice>((set, get) => ({
  current: {
    status: 'idle',
    target: generateWordTokens(200), // Initialize with words immediately
    cursor: { wordIndex: 0, letterIndex: 0 },
    keystrokes: [],
    mode: 'time',
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timeEngine: null,
  },
  actions: {
    startIfIdle() {
      const s = get().current;
      if (s.status === 'idle') {
        set(state => {
          const newState = {
            current: {
              ...state.current,
              status: 'running' as const,
              startedAt: performance.now(),
            }
          };

          // Start time engine if in time mode
          if (state.current.mode === 'time' && state.current.timeEngine) {
            state.current.timeEngine.start(
              (remainingTime) => {
                set(s => ({
                  current: { ...s.current, remainingTime }
                }));
              },
              () => {
                get().actions.finishTest();
              }
            );
          }

          return newState;
        });
      }
    },

    typeChar(ch: string) {
      set(state => {
        const { target, cursor, mode, timeEngine } = state.current;
        const w = target[cursor.wordIndex];
        if (!w) return state;

        // Extend buffer if needed in time mode
        if (mode === 'time' && timeEngine) {
          timeEngine.extendBufferIfNeeded(cursor.wordIndex);
        }

        const newTarget = [...target];
        const newWord = { ...w };
        
        if (cursor.letterIndex < newWord.target.length) {
          const expected = newWord.target[cursor.letterIndex];
          if (ch === expected) {
            newWord.letters[cursor.letterIndex] = 'correct';
          } else {
            newWord.letters[cursor.letterIndex] = 'wrong';
          }
          newWord.typed += ch;
          newTarget[cursor.wordIndex] = newWord;
          
          return {
            current: {
              ...state.current,
              target: newTarget,
              cursor: { ...cursor, letterIndex: cursor.letterIndex + 1 }
            }
          };
        } else {
          // extra character
          newWord.typed += ch;
          newWord.letters.push('extra');
          newTarget[cursor.wordIndex] = newWord;
          
          return {
            current: {
              ...state.current,
              target: newTarget,
              cursor: { ...cursor, letterIndex: cursor.letterIndex + 1 }
            }
          };
        }
      });
    },

    commitSpace() {
      set(state => {
        const { target, cursor, mode } = state.current;
        
        // In time mode, don't end on word completion
        if (mode === 'time') {
          // move to next word, reset letter index
          return {
            current: {
              ...state.current,
              cursor: { wordIndex: cursor.wordIndex + 1, letterIndex: 0 }
            }
          };
        }
        
        // For other modes, just advance to next word
        const atLastWord = cursor.wordIndex >= target.length - 1;
        
        if (!atLastWord) {
          // move to next word, reset letter index
          return {
            current: {
              ...state.current,
              cursor: { wordIndex: cursor.wordIndex + 1, letterIndex: 0 }
            }
          };
        } else {
          // last word done → end test
          const testState: TestState = {
            ...state.current,
            endedAt: performance.now(),
          };
          const realStats = calcRealStats(testState);
          const displayStats = toDisplayStats(realStats);
          
          return {
            current: {
              ...state.current,
              status: 'done',
              endedAt: performance.now(),
              realStats,
              displayStats
            }
          };
        }
      });
    },

    backspace() {
      set(state => {
        const { target, cursor } = state.current;
        const w = target[cursor.wordIndex];
        if (!w) return state;

        const newTarget = [...target];
        const newWord = { ...w };

        if (cursor.letterIndex > 0) {
          // delete within word
          const newLetterIndex = cursor.letterIndex - 1;
          newWord.typed = newWord.typed.slice(0, -1);
          newWord.letters[newLetterIndex] = 'pending';
          // also remove trailing 'extra' state if beyond target length
          if (newLetterIndex >= newWord.target.length) {
            newWord.letters.pop();
          }
          newTarget[cursor.wordIndex] = newWord;
          
          return {
            current: {
              ...state.current,
              target: newTarget,
              cursor: { ...cursor, letterIndex: newLetterIndex }
            }
          };
        } else if (cursor.wordIndex > 0) {
          // borrow from previous word end
          const newWordIndex = cursor.wordIndex - 1;
          const prevWord = target[newWordIndex];
          const newLetterIndex = Math.max(0, prevWord.typed.length);
          
          if (prevWord.typed.length > 0) {
            const newPrevWord = { ...prevWord };
            newPrevWord.typed = newPrevWord.typed.slice(0, -1);
            newPrevWord.letters[newLetterIndex - 1] = 'pending';
            newTarget[newWordIndex] = newPrevWord;
          }
          
          return {
            current: {
              ...state.current,
              target: newTarget,
              cursor: { wordIndex: newWordIndex, letterIndex: newLetterIndex }
            }
          };
        }
        
        return state;
      });
    },

    initTimeMode(durationSec: number) {
      const timeEngine = new TimeModeEngine(durationSec);
      set(state => ({
        current: {
          ...state.current,
          mode: 'time',
          target: timeEngine.getWords(),
          timeEngine,
          remainingTime: durationSec,
        }
      }));
    },

    resetAndRebuild() {
      set(state => {
        // Stop time engine if running
        if (state.current.timeEngine) {
          state.current.timeEngine.stop();
        }

        const newState = {
          current: {
            ...state.current,
            status: 'idle' as const,
            target: generateWordTokens(200),
            cursor: { wordIndex: 0, letterIndex: 0 },
            startedAt: undefined,
            endedAt: undefined,
            realStats: undefined,
            displayStats: undefined,
            keystrokes: [],
            id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            remainingTime: undefined,
            timeEngine: null,
          }
        };

        // Re-initialize time mode if needed
        if (state.current.mode === 'time') {
          const configStore = useConfigStore.getState();
          const timeEngine = new TimeModeEngine(configStore.durationSec);
          newState.current = {
            ...newState.current,
            timeEngine: timeEngine as any,
            target: timeEngine.getWords(),
            remainingTime: configStore.durationSec as any,
          };
        }

        return newState;
      });
    },

    finishTest() {
      const current = get().current;
      if (current.status !== 'running') return;

      // Stop time engine if running
      if (current.timeEngine) {
        current.timeEngine.stop();
      }

      const testState: TestState = {
        ...current,
        endedAt: performance.now(),
      };
      const realStats = calcRealStats(testState);
      const displayStats = toDisplayStats(realStats);

      set(state => ({
        current: {
          ...state.current,
          status: 'done',
          endedAt: performance.now(),
          realStats,
          displayStats
        }
      }));
    },
  },
}));
