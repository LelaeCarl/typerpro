import { describe, it, expect } from 'vitest';
import { toDisplayStats, generateDisplayGraphData } from '../interceptor';
import type { RealStats, DisplayStats } from '../../../types';

describe('Vibe Interceptor', () => {
  describe('toDisplayStats', () => {
    it('should convert real stats to display stats with fake values', () => {
      const realStats: RealStats = {
        wpm: 50,
        rawWpm: 52,
        accuracy: 85,
        consistency: 70,
        durationSec: 30,
        testMode: 'words'
      };

      const displayStats = toDisplayStats(realStats);

      // Should preserve some real values
      expect(displayStats.durationSec).toBe(realStats.durationSec);
      expect(displayStats.testMode).toBe(realStats.testMode);

      // Should have fake values for key metrics
      expect(displayStats.wpm).toBeGreaterThanOrEqual(150);
      expect(displayStats.wpm).toBeLessThanOrEqual(273);
      expect(displayStats.accuracy).toBeGreaterThanOrEqual(95);
      expect(displayStats.accuracy).toBeLessThan(100);
      expect(displayStats.rawWpm).toBeDefined();
      expect(displayStats.consistency).toBeDefined();
    });

    it('should generate different fake values on each call', () => {
      const realStats: RealStats = {
        wpm: 50,
        rawWpm: 52,
        accuracy: 85,
        durationSec: 30,
        testMode: 'words'
      };

      const result1 = toDisplayStats(realStats);
      const result2 = toDisplayStats(realStats);

      // Values should be different (random)
      expect(result1.wpm).not.toBe(result2.wpm);
      expect(result1.accuracy).not.toBe(result2.accuracy);
    });
  });

  describe('generateDisplayGraphData', () => {
    it('should generate graph data from display stats', () => {
      const displayStats: DisplayStats = {
        wpm: 200,
        accuracy: 98.5,
        durationSec: 30,
        testMode: 'words',
        rawWpm: 205,
        consistency: 85
      };

      const graphData = generateDisplayGraphData(displayStats);

      expect(graphData).toBeInstanceOf(Array);
      expect(graphData.length).toBeGreaterThan(0);

      graphData.forEach(point => {
        expect(point).toHaveProperty('time');
        expect(point).toHaveProperty('wpm');
        expect(point).toHaveProperty('rawWpm');
        expect(point).toHaveProperty('errors');
        
        expect(point.time).toBeGreaterThanOrEqual(0);
        expect(point.time).toBeLessThanOrEqual(displayStats.durationSec);
        expect(point.wpm).toBeGreaterThan(0);
        expect(point.rawWpm).toBeGreaterThan(0);
        expect(point.errors).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
