import type { RealStats, DisplayStats } from '../../types';

/**
 * Convert real stats to display stats with vibe metrics
 * This is where we inject the "vibe" - making stats look better than reality
 */
export function toDisplayStats(real: RealStats): DisplayStats {
  // Generate fake metrics as specified
  const fakeWpm = Math.floor(Math.random() * (273 - 150 + 1)) + 150; // Random int [150..273]
  const fakeAccuracy = 100 - Math.floor(Math.random() * 6); // 100 - random(0..5)
  
  return {
    wpm: fakeWpm,
    raw: fakeWpm + Math.floor(Math.random() * 20), // Raw slightly higher than WPM
    accuracy: fakeAccuracy,
    errors: Math.floor(Math.random() * 3), // 0-2 errors
    time: formatTime(real.testDuration),
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
