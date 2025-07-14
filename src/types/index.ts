export interface IHorse {
  id: number;
  name: string;
  color: string;
  condition: number;
  position?: number;
  finishTime?: number; // milliseconds since race start
}

export interface IRound {
  distance: number;
  horses: IHorse[];
  raceStartTime?: number; // timestamp in ms
}

export type RaceStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface IRootState {
  horses: IHorse[];
  rounds: IRound[];
  currentRoundIndex: number;
  roundResults: IHorse[][];
  raceStatus: RaceStatus;
  timerId: any | null;
} 