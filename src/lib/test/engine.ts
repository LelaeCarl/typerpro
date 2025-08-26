import type { WordToken } from '../../types';

const BASE_WPM = 220;

// Default English word list (200 common words)
const DEFAULT_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government',
  'company', 'number', 'group', 'problem', 'fact', 'water', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house',
  'service', 'friend', 'father', 'mind', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend',
  'father', 'mind', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'mind',
  'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'mind', 'month', 'lot',
  'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'mind', 'month', 'lot', 'right', 'study'
];

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
      // Get random words from the word list
      const randomWords = this.getRandomWords(50);
      
      for (const word of randomWords) {
        const wordLength = word.length + 1; // +1 for space
        if (currentChars + wordLength > targetChars) {
          break;
        }
        words.push({
          target: word,
          letters: new Array(word.length).fill('pending'),
          typed: ''
        });
        currentChars += wordLength;
      }
    }
    
    return words;
  }

  private getRandomWords(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * DEFAULT_WORDS.length);
      result.push(DEFAULT_WORDS[randomIndex]);
    }
    return result;
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
      const newRandomWords = this.getRandomWords(80);
      const newWords = newRandomWords.map(word => ({
        target: word,
        letters: new Array(word.length).fill('pending'),
        typed: ''
      }));
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
