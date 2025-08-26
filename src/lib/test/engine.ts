import type { WordToken } from '../../types';
import { generateWordTokens } from './words';

const BASE_WPM = 220;

export interface TimeModeState {
  deadline: number;
  remainingTime: number;
  isRunning: boolean;
  tickInterval?: NodeJS.Timeout;
}

export interface WordBuffer {
  words: WordToken[];
  startIndex: number; // Virtual index for the first word in buffer
  bufferSize: number;
}

export class TimeModeEngine {
  private state: TimeModeState;
  private buffer: WordBuffer;
  private onTimeUpdate?: (remainingTime: number) => void;
  private onFinish?: () => void;

  constructor(durationSec: number) {
    this.state = {
      deadline: performance.now() + durationSec * 1000,
      remainingTime: durationSec,
      isRunning: false,
    };
    
    const bufferSize = Math.min(160, Math.max(80, Math.ceil((BASE_WPM * durationSec) / 60 * 1.5)));
    this.buffer = {
      words: generateWordTokens(bufferSize),
      startIndex: 0,
      bufferSize,
    };
  }

  start(onTimeUpdate?: (remainingTime: number) => void, onFinish?: () => void) {
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
      const remaining = Math.max(0, (this.state.deadline - now) / 1000);
      this.state.remainingTime = remaining;

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

  getRemainingTime(): number {
    return this.state.remainingTime;
  }

  getWords(): WordToken[] {
    return this.buffer.words;
  }

  getVirtualIndex(realIndex: number): number {
    return realIndex - this.buffer.startIndex;
  }

  getRealIndex(virtualIndex: number): number {
    return virtualIndex + this.buffer.startIndex;
  }

  // Extend buffer when cursor approaches the end
  extendBufferIfNeeded(cursorWordIndex: number) {
    const virtualIndex = this.getVirtualIndex(cursorWordIndex);
    
    if (virtualIndex > this.buffer.words.length - 40) {
      // Add 80 new words to the end
      const newWords = generateWordTokens(80);
      this.buffer.words.push(...newWords);
      
      // Remove words from the beginning to maintain buffer size
      const toRemove = Math.min(40, this.buffer.words.length - this.buffer.bufferSize);
      if (toRemove > 0) {
        this.buffer.words.splice(0, toRemove);
        this.buffer.startIndex += toRemove;
      }
    }
  }

  // Get visible words for rendering (3 lines worth)
  getVisibleWords(cursorWordIndex: number, wordsPerLine: number = 8): WordToken[] {
    const virtualIndex = this.getVirtualIndex(cursorWordIndex);
    const start = Math.max(0, virtualIndex - wordsPerLine);
    const end = Math.min(this.buffer.words.length, virtualIndex + wordsPerLine * 2);
    
    return this.buffer.words.slice(start, end);
  }

  reset(durationSec: number) {
    this.stop();
    
    this.state = {
      deadline: performance.now() + durationSec * 1000,
      remainingTime: durationSec,
      isRunning: false,
    };
    
    const bufferSize = Math.min(160, Math.max(80, Math.ceil((BASE_WPM * durationSec) / 60 * 1.5)));
    this.buffer = {
      words: generateWordTokens(bufferSize),
      startIndex: 0,
      bufferSize,
    };
  }
}
