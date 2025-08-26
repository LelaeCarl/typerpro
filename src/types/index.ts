export type TestMode = 'words' | 'time' | 'quote' | 'zen';
export type LetterState = 'pending' | 'correct' | 'wrong' | 'extra';

export type WordToken = {
  target: string;
  letters: LetterState[];
  typed: string;
};

export type Keystroke = {
  t: number;
  key: string;
  code: string;
  kind: 'input' | 'sys';
};

export type RealStats = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency?: number;
  durationSec: number;
  testMode: TestMode;
};

export type DisplayStats = {
  wpm: number;
  accuracy: number;
  durationSec: number;
  testMode: TestMode;
  rawWpm?: number;
  consistency?: number;
};

export type TestState = {
  id: string;
  mode: TestMode;
  status: 'idle' | 'running' | 'done';
  target: WordToken[];
  cursor: { wordIndex: number; letterIndex: number };
  startedAt?: number;
  endedAt?: number;
  keystrokes: Keystroke[];
  realStats?: RealStats;        // dev-only
  displayStats?: DisplayStats;  // UI uses this only
};

export type Settings = {
  theme: 'dark' | 'light';
  fontSize: number;
  caretStyle: 'block' | 'line' | 'underline';
  pauseOnBlur: boolean;
};

export type GraphPoint = {
  time: number;
  wpm: number;
  rawWpm: number;
  errors: number;
};
