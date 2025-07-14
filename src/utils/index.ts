import type { IHorse, IRound } from '../types/index.js'
import { ROUND_DISTANCES, BASE_COLORS, HORSE_NAMES } from '../constants/index.js';


export function generateColors(count: number): string[] {
  return BASE_COLORS.slice(0, count);
}

export function generateNames(count: number): string[] {
  return HORSE_NAMES.slice(0, count);
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateHorses(count: number): IHorse[] {
  const names = generateNames(count);
  const colors = generateColors(count);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i],
    color: colors[i],
    condition: getRandomInt(1, 100),
  }));
}

export function generateRounds(horses: IHorse[]): IRound[] {
  return ROUND_DISTANCES.map((distance) => {
    const shuffled = [...horses].sort(() => Math.random() - 0.5);
    const roundHorses = shuffled.slice(0, 10).map(horse => ({ ...horse, position: 0 }));
    return { distance, horses: roundHorses };
  });
}

export function calculateHorseNewPosition(horse: IHorse): number {
  const advance = Math.random() * (horse.condition / 20) + 1;
  return Math.min(100, (horse.position ?? 0) + advance);
}

export function advanceHorsesRealTime(round: IRound, onPositionUpdate: (horseIndex: number, newPosition: number, finishedNow: boolean, finishTime?: number) => void, roundIndex: number, raceStartTime: number): boolean {
  let finished = true;
  round.horses.forEach((horse: IHorse, idx: number) => {
    if ((horse.position ?? 0) < 100) {
      const newPosition = calculateHorseNewPosition(horse);
      let finishedNow = false;
      let finishTime: number | undefined = undefined;
      if (newPosition >= 100 && horse.finishTime === undefined) {
        finishedNow = true;
        finishTime = Date.now() - raceStartTime;
      }
      onPositionUpdate(idx, newPosition, finishedNow, finishTime);
      if (newPosition < 100) finished = false;
    }
  });
  return finished;
}

export function getSortedHorsesByRanking(horses: IHorse[]): IHorse[] {
  return [...horses].sort((a, b) => {
    if (a.finishTime !== undefined && b.finishTime !== undefined) {
      return a.finishTime - b.finishTime;
    } else if (a.finishTime !== undefined) {
      return -1;
    } else if (b.finishTime !== undefined) {
      return 1;
    }
    // fallback: sort by position, then condition
    return (b.position ?? 0) - (a.position ?? 0) || b.condition - a.condition;
  });
}

export type TOrdinal = '.st' |'.nd' | '.rd' | '.th'
export function getOrdinal(n: number): TOrdinal {
  if (n === 1) return '.st'
  if (n === 2) return '.nd'
  if (n === 3) return '.rd'
  return '.th'
}