import type { RealStats, DisplayStats } from '../../types';
import { vibeWpm, vibeAcc, vibeRawWpm, vibeConsistency, generateVibeGraphData } from './generators';

/**
 * Vibe interceptor - replaces real stats with fake ones for arcade mode
 * This is the critical override point that ensures UI never sees real stats
 */
export const toDisplayStats = (real: RealStats): DisplayStats => {
  const fakeWpm = vibeWpm();
  
  return {
    wpm: fakeWpm,
    accuracy: vibeAcc(),
    durationSec: real.durationSec,
    testMode: real.testMode,
    rawWpm: vibeRawWpm(fakeWpm),
    consistency: vibeConsistency(),
  };
};

/**
 * Generate fake graph data for the results screen
 * This ensures the graph never reveals real keystroke timing
 */
export const generateDisplayGraphData = (displayStats: DisplayStats): Array<{ time: number; wpm: number; rawWpm: number; errors: number }> => {
  const { durationSec, wpm } = displayStats;
  return generateVibeGraphData(durationSec, wpm);
};
