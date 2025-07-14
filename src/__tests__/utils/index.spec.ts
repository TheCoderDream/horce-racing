import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateColors,
  generateNames,
  getRandomInt,
  generateHorses,
  generateRounds,
  calculateHorseNewPosition,
  calculateHorsesNextPosition,
  areAllHorsesFinished,
  getSortedHorsesByRanking,
  getOrdinal
} from '../../utils/index';
import { BASE_COLORS, HORSE_NAMES, ROUND_DISTANCES } from '../../constants/index';

describe('utils/index', () => {
  describe('generateColors', () => {
    it('returns the first N base colors', () => {
      expect(generateColors(3)).toEqual(BASE_COLORS.slice(0, 3));
      expect(generateColors(20)).toEqual(BASE_COLORS);
    });
  });

  describe('generateNames', () => {
    it('returns the first N horse names', () => {
      expect(generateNames(2)).toEqual(HORSE_NAMES.slice(0, 2));
      expect(generateNames(20)).toEqual(HORSE_NAMES);
    });
  });

  describe('getRandomInt', () => {
    it('returns a value within the range', () => {
      for (let i = 0; i < 100; i++) {
        const val = getRandomInt(1, 5);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('generateHorses', () => {
    it('returns N horses with unique names/colors/condition', () => {
      const horses = generateHorses(5);
      expect(horses).toHaveLength(5);
      expect(new Set(horses.map(h => h.name)).size).toBe(5);
      expect(new Set(horses.map(h => h.color)).size).toBe(5);
      horses.forEach(h => {
        expect(typeof h.condition).toBe('number');
        expect(h.condition).toBeGreaterThanOrEqual(1);
        expect(h.condition).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('generateRounds', () => {
    it('returns 6 rounds with 10 horses each', () => {
      const horses = generateHorses(20);
      const rounds = generateRounds(horses);
      expect(rounds).toHaveLength(ROUND_DISTANCES.length);
      rounds.forEach(round => {
        expect(round.horses).toHaveLength(10);
        expect(typeof round.distance).toBe('number');
      });
    });
  });

  describe('calculateHorseNewPosition', () => {
    beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0.5); });
    afterEach(() => { vi.restoreAllMocks(); });
    it('calculates new position based on condition', () => {
      const horse = { id: 1, name: 'A', color: '#fff', condition: 40, position: 10 };
      // advance = 0.5 * (40/20) + 1 = 2
      expect(calculateHorseNewPosition(horse)).toBe(12);
    });
    it('caps position at 100', () => {
      const horse = { id: 1, name: 'A', color: '#fff', condition: 40, position: 99 };
      expect(calculateHorseNewPosition(horse)).toBe(100);
    });
  });

  describe('calculateHorsesNextPosition', () => {
    beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0.5); });
    afterEach(() => { vi.restoreAllMocks(); });
    it('returns new positions and finishTime for horses crossing 100', () => {
      const now = Date.now();
      const round = {
        distance: 1200,
        horses: [
          { id: 1, name: 'A', color: '#fff', condition: 40, position: 99 },
          { id: 2, name: 'B', color: '#000', condition: 20, position: 10 },
        ],
        raceStartTime: now - 1000,
      };
      const updates = calculateHorsesNextPosition(round, 0, round.raceStartTime!);
      expect(updates[0].position).toBe(100);
      expect(typeof updates[0].finishTime).toBe('number');
      expect(updates[1].position).toBe(11.5);
      expect(updates[1].finishTime).toBeUndefined();
    });
  });

  describe('areAllHorsesFinished', () => {
    it('returns true if all horses have finishTime', () => {
      const round = {
        distance: 1200,
        horses: [
          { id: 1, name: 'A', color: '#fff', condition: 40, finishTime: 100 },
          { id: 2, name: 'B', color: '#000', condition: 20, finishTime: 200 },
        ],
      };
      expect(areAllHorsesFinished(round)).toBe(true);
    });
    it('returns false if any horse is not finished', () => {
      const round = {
        distance: 1200,
        horses: [
          { id: 1, name: 'A', color: '#fff', condition: 40, finishTime: 100 },
          { id: 2, name: 'B', color: '#000', condition: 20 },
        ],
      };
      expect(areAllHorsesFinished(round)).toBe(false);
    });
  });

  describe('getSortedHorsesByRanking', () => {
    it('sorts by finishTime, then position, then condition', () => {
      const horses = [
        { id: 1, name: 'A', color: '#fff', condition: 40, finishTime: 200, position: 100 },
        { id: 2, name: 'B', color: '#000', condition: 20, finishTime: 100, position: 100 },
        { id: 3, name: 'C', color: '#111', condition: 80, position: 90 },
      ];
      const sorted = getSortedHorsesByRanking(horses);
      expect(sorted[0].id).toBe(2); // finishTime 100
      expect(sorted[1].id).toBe(1); // finishTime 200
      expect(sorted[2].id).toBe(3); // not finished, by position
    });
  });

  describe('getOrdinal', () => {
    it('returns correct ordinal suffix', () => {
      expect(getOrdinal(1)).toBe('.st');
      expect(getOrdinal(2)).toBe('.nd');
      expect(getOrdinal(3)).toBe('.rd');
      expect(getOrdinal(4)).toBe('.th');
      expect(getOrdinal(11)).toBe('.th');
      expect(getOrdinal(20)).toBe('.th');
    });
  });
}); 