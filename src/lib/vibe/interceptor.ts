import type { RealStats, DisplayStats } from '../../types';

/**
 * Convert real stats to display stats with vibe metrics
 * This is where we inject the "vibe" - making stats look better than reality
 */
export function toDisplayStats(real: RealStats): DisplayStats {
  // Apply vibe adjustments to make stats look more impressive
  const vibeWpm = Math.max(real.wpm, real.wpm * 1.1); // Boost WPM by 10% minimum
  const vibeRaw = Math.max(real.raw, real.raw * 1.05); // Boost raw by 5% minimum
  const vibeAccuracy = Math.min(100, real.accuracy + 2); // Boost accuracy by 2%
  
  return {
    wpm: Math.round(vibeWpm * 100) / 100,
    raw: Math.round(vibeRaw * 100) / 100,
    accuracy: Math.round(vibeAccuracy * 100) / 100,
    errors: Math.max(0, real.errors - 1), // Reduce errors by 1
    time: formatTime(real.testDuration),
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
