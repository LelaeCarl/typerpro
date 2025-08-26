import { describe, it, expect } from 'vitest';
import { vibeWpm, vibeAcc, vibeRawWpm, vibeConsistency, generateVibeGraphData } from '../generators';

describe('Vibe Generators', () => {
  describe('vibeWpm', () => {
    it('should generate WPM between 150 and 273', () => {
      for (let i = 0; i < 100; i++) {
        const wpm = vibeWpm();
        expect(wpm).toBeGreaterThanOrEqual(150);
        expect(wpm).toBeLessThanOrEqual(273);
        expect(Number.isInteger(wpm)).toBe(true);
      }
    });
  });

  describe('vibeAcc', () => {
    it('should generate accuracy between 95 and 99.99', () => {
      for (let i = 0; i < 100; i++) {
        const acc = vibeAcc();
        expect(acc).toBeGreaterThanOrEqual(95);
        expect(acc).toBeLessThan(100);
      }
    });
  });

  describe('vibeRawWpm', () => {
    it('should generate raw WPM close to input WPM', () => {
      const baseWpm = 200;
      for (let i = 0; i < 100; i++) {
        const rawWpm = vibeRawWpm(baseWpm);
        expect(rawWpm).toBeGreaterThan(baseWpm - 15);
        expect(rawWpm).toBeLessThan(baseWpm + 15);
      }
    });
  });

  describe('vibeConsistency', () => {
    it('should generate consistency between 60 and 95', () => {
      for (let i = 0; i < 100; i++) {
        const consistency = vibeConsistency();
        expect(consistency).toBeGreaterThanOrEqual(60);
        expect(consistency).toBeLessThanOrEqual(95);
      }
    });
  });

  describe('generateVibeGraphData', () => {
    it('should generate graph data with correct structure', () => {
      const durationSec = 30;
      const targetWpm = 200;
      const data = generateVibeGraphData(durationSec, targetWpm);

      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data.length).toBeLessThanOrEqual(30);

      data.forEach(point => {
        expect(point).toHaveProperty('time');
        expect(point).toHaveProperty('wpm');
        expect(point).toHaveProperty('rawWpm');
        expect(point).toHaveProperty('errors');
        
        expect(point.time).toBeGreaterThanOrEqual(0);
        expect(point.time).toBeLessThanOrEqual(durationSec);
        expect(point.wpm).toBeGreaterThan(0);
        expect(point.rawWpm).toBeGreaterThan(0);
        expect(point.errors).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
