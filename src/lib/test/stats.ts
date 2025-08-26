import type { TestState, RealStats } from '../../types';

export function calcRealStats(testState: TestState): RealStats {
  const { target, startedAt, endedAt } = testState;
  
  if (!startedAt || !endedAt) {
    return {
      wpm: 0,
      raw: 0,
      accuracy: 0,
      errors: 0,
      testDuration: 0,
      characters: {
        correct: 0,
        incorrect: 0,
        extra: 0,
        total: 0,
      },
    };
  }

  const testDuration = (endedAt - startedAt) / 1000; // seconds
  const minutes = testDuration / 60;

  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let totalChars = 0;

  target.forEach(word => {
    const targetLength = word.target.length;
    const typedLength = word.typed.length;
    
    // Count correct/incorrect characters
    for (let i = 0; i < Math.min(targetLength, typedLength); i++) {
      if (word.letters[i] === 'correct') {
        correctChars++;
      } else if (word.letters[i] === 'wrong') {
        incorrectChars++;
      }
    }
    
    // Count extra characters
    for (let i = targetLength; i < typedLength; i++) {
      if (word.letters[i] === 'extra') {
        extraChars++;
      }
    }
    
    totalChars += typedLength;
  });

  const totalErrors = incorrectChars + extraChars;
  const accuracy = totalChars > 0 ? ((correctChars / totalChars) * 100) : 0;
  
  // WPM calculation: (correct characters / 5) / minutes
  const wpm = minutes > 0 ? (correctChars / 5) / minutes : 0;
  const raw = minutes > 0 ? (totalChars / 5) / minutes : 0;

  return {
    wpm: Math.round(wpm * 100) / 100,
    raw: Math.round(raw * 100) / 100,
    accuracy: Math.round(accuracy * 100) / 100,
    errors: totalErrors,
    testDuration,
    characters: {
      correct: correctChars,
      incorrect: incorrectChars,
      extra: extraChars,
      total: totalChars,
    },
  };
}

/**
 * Calculate character statistics
 */
export const calcCharStats = (testState: TestState) => {
  let correct = 0;
  let wrong = 0;
  let extra = 0;
  let missed = 0;

  for (const word of testState.target) {
    const targetLength = word.target.length;
    const typedLength = word.typed.length;
    
    // Count correct and wrong characters
    for (let i = 0; i < Math.min(targetLength, typedLength); i++) {
      if (word.typed[i] === word.target[i]) {
        correct++;
      } else {
        wrong++;
      }
    }
    
    // Count extra characters (typed beyond target length)
    if (typedLength > targetLength) {
      extra += typedLength - targetLength;
    }
    
    // Count missed characters (target longer than typed)
    if (targetLength > typedLength) {
      missed += targetLength - typedLength;
    }
  }

  return { correct, wrong, extra, missed };
};
