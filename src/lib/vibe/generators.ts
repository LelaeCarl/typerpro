/**
 * Vibe generators for fake metrics
 * These generate consistent but fake statistics for the arcade mode
 */

export const vibeWpm = (): number => {
  return 150 + Math.floor(Math.random() * (273 - 150 + 1));
};

export const vibeAcc = (): number => {
  return Math.max(95, Math.min(99.99, 100 - Math.random() * 5));
};

export const vibeRawWpm = (wpm: number): number => {
  // Raw WPM is typically slightly higher than regular WPM
  const variance = Math.random() * 20 - 10; // -10 to +10
  return Math.max(wpm - 5, wpm + variance);
};

export const vibeConsistency = (): number => {
  return Math.max(60, Math.min(95, 70 + Math.random() * 25));
};

export const generateVibeGraphData = (durationSec: number, targetWpm: number): Array<{ time: number; wpm: number; rawWpm: number; errors: number }> => {
  const points: Array<{ time: number; wpm: number; rawWpm: number; errors: number }> = [];
  const samples = Math.min(30, Math.max(10, Math.floor(durationSec / 2)));
  
  // Generate smooth curve around target WPM
  for (let i = 0; i < samples; i++) {
    const time = (i / (samples - 1)) * durationSec;
    
    // Create a smooth curve with some variation
    const baseVariation = Math.sin((i / samples) * Math.PI * 2) * 15;
    const randomNoise = (Math.random() - 0.5) * 10;
    const wpm = Math.max(50, targetWpm + baseVariation + randomNoise);
    
    const rawWpm = vibeRawWpm(wpm);
    
    // Sparse error marks
    const errors = Math.random() < 0.1 ? Math.floor(Math.random() * 2) + 1 : 0;
    
    points.push({ time, wpm: Math.round(wpm), rawWpm: Math.round(rawWpm), errors });
  }
  
  return points;
};
