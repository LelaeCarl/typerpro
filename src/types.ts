export type TestMode = 'time' | 'quote' | 'zen' | 'custom';

export type LetterState = 'pending' | 'correct' | 'wrong' | 'extra';

export interface WordToken {
  target: string;
  letters: LetterState[];
  typed: string;
}

export interface TestState {
  status: 'idle' | 'running' | 'done';
  target: WordToken[];
  cursor: { wordIndex: number; letterIndex: number };
  startedAt?: number;
  endedAt?: number;
  keystrokes: any[];
  mode: TestMode;
  id: string;
  remainingMs?: number;
}

export interface RealStats {
  wpm: number;
  raw: number;
  accuracy: number;
  errors: number;
  testDuration: number;
  characters: {
    correct: number;
    incorrect: number;
    extra: number;
    total: number;
  };
}

export interface DisplayStats {
  wpm: number;
  raw: number;
  accuracy: number;
  errors: number;
  time: string;
}
