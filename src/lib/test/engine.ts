import type { WordToken } from '../../types';
import { generateWordTokens } from './words';

const BASE_WPM = 220;

export interface TimeModeState {
  deadline: number;
  remainingMs: number;
  isRunning: boolean;
  tickInterval?: NodeJS.Timeout;
}

export class TimeModeEngine {
  private state: TimeModeState;
  private words: WordToken[];
  private onTimeUpdate?: (remainingMs: number) => void;
  private onFinish?: () => void;

  constructor(durationSec: number) {
    this.state = {
      deadline: 0,
      remainingMs: durationSec * 1000,
      isRunning: false,
    };
    
    // Calculate budgeted character count for this duration
    const budgetChars = Math.ceil(BASE_WPM * 5 * (durationSec / 60) * 1.4);
    this.words = this.generateBudgetedWords(budgetChars);
  }

  private generateBudgetedWords(targetChars: number): WordToken[] {
    const words: WordToken[] = [];
    let currentChars = 0;
    
    // Generate words until we reach the target character count
    while (currentChars < targetChars) {
      const newWords = generateWordTokens(50); // Get 50 words at a time
      
      for (const word of newWords) {
        const wordLength = word.target.length + 1; // +1 for space
        if (currentChars + wordLength > targetChars) {
          break;
        }
        words.push(word);
        currentChars += wordLength;
      }
    }
    
    return words;
  }

  start(onTimeUpdate?: (remainingMs: number) => void, onFinish?: () => void) {
    this.onTimeUpdate = onTimeUpdate;
    this.onFinish = onFinish;
    this.state.isRunning = true;
    this.startTick();
  }

  stop() {
    this.state.isRunning = false;
    if (this.state.tickInterval) {
      clearInterval(this.state.tickInterval);
      this.state.tickInterval = undefined;
    }
  }

  private startTick() {
    this.state.tickInterval = setInterval(() => {
      if (!this.state.isRunning) return;

      const now = performance.now();
      const remaining = Math.max(0, this.state.deadline - now);
      this.state.remainingMs = remaining;

      if (this.onTimeUpdate) {
        this.onTimeUpdate(remaining);
      }

      if (now >= this.state.deadline) {
        this.stop();
        if (this.onFinish) {
          this.onFinish();
        }
      }
    }, 50);
  }

  setDeadline(startedAt: number, durationSec: number) {
    this.state.deadline = startedAt + (durationSec * 1000);
  }

  getRemainingMs(): number {
    return this.state.remainingMs;
  }

  getWords(): WordToken[] {
    return this.words;
  }

  // Extend buffer when cursor approaches the end
  extendBufferIfNeeded(cursorWordIndex: number) {
    if (cursorWordIndex > this.words.length - 40) {
      // Add 80 new words to the end
      const newWords = generateWordTokens(80);
      this.words.push(...newWords);
    }
  }

  reset(durationSec: number) {
    this.stop();
    
    this.state = {
      deadline: 0,
      remainingMs: durationSec * 1000,
      isRunning: false,
    };
    
    // Generate new budgeted words for this duration
    const budgetChars = Math.ceil(BASE_WPM * 5 * (durationSec / 60) * 1.4);
    this.words = this.generateBudgetedWords(budgetChars);
  }
}
