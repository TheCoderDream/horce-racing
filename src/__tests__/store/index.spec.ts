import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore, Store } from 'vuex';
import { storeOptions } from '../../store/index';
import * as utils from '../../utils/index';
import { IHorse, IRound, IRootState } from '../../types/index';

function makeStore(): Store<IRootState> {
  // Create a fresh store for each test
  return createStore(storeOptions as any) as Store<IRootState>;
}

describe('Vuex Store', () => {
  let store: Store<IRootState>;

  beforeEach(() => {
    store = makeStore();
  });

  describe('state', () => {
    it('initializes with correct default values', () => {
      expect(store.state.horses).toEqual([]);
      expect(store.state.rounds).toEqual([]);
      expect(store.state.currentRoundIndex).toBe(0);
      expect(store.state.roundResults).toEqual([]);
      expect(store.state.raceStatus).toBe('idle');
      expect(store.state.timerId).toBeNull();
    });
  });

  describe('mutations', () => {
    it('setHorses sets horses', () => {
      const horses = [{ id: 1, name: 'A', color: '#fff', condition: 50 }];
      store.commit('setHorses', horses);
      expect(store.state.horses).toEqual(horses);
    });
    it('setRounds sets rounds', () => {
      const rounds = [{ distance: 1200, horses: [] }];
      store.commit('setRounds', rounds);
      expect(store.state.rounds).toEqual(rounds);
    });
    it('setCurrentRoundIndex sets currentRoundIndex', () => {
      store.commit('setCurrentRoundIndex', 2);
      expect(store.state.currentRoundIndex).toBe(2);
    });
    it('setRoundResults sets roundResults', () => {
      const results = [[{ id: 1, name: 'A', color: '#fff', condition: 50 }]];
      store.commit('setRoundResults', results);
      expect(store.state.roundResults).toEqual(results);
    });
    it('setRaceStatus sets raceStatus', () => {
      store.commit('setRaceStatus', 'running');
      expect(store.state.raceStatus).toBe('running');
    });
    it('setRaceStartTime sets raceStartTime for round', () => {
      const rounds = [{ distance: 1200, horses: [], raceStartTime: undefined }];
      store.commit('setRounds', rounds);
      store.commit('setRaceStartTime', { roundIndex: 0, raceStartTime: 123 });
      expect(store.state.rounds[0].raceStartTime).toBe(123);
    });
    it('updateHorsePosition updates position and finishTime', () => {
      // Setup a round at currentRoundIndex
      store.replaceState({
        ...store.state,
        rounds: [{ distance: 1200, horses: [{ id: 1, name: 'A', color: '#fff', condition: 50, position: 0 }] }],
        currentRoundIndex: 0,
      });
      store.commit('updateHorsePosition', { horseIndex: 0, position: 42, finishTime: 100 });
      expect(store.state.rounds[0].horses[0].position).toBe(42);
      expect(store.state.rounds[0].horses[0].finishTime).toBe(100);
    });
    it('bulkUpdatePositions updates multiple horses', () => {
      // Setup a round at currentRoundIndex
      store.replaceState({
        ...store.state,
        rounds: [{ distance: 1200, horses: [
          { id: 1, name: 'A', color: '#fff', condition: 50, position: 0 },
          { id: 2, name: 'B', color: '#000', condition: 60, position: 0 }
        ] }],
        currentRoundIndex: 0,
      });
      store.commit('bulkUpdatePositions', [
        { horseIndex: 0, position: 10, finishTime: 50 },
        { horseIndex: 1, position: 20 }
      ]);
      expect(store.state.rounds[0].horses[0].position).toBe(10);
      expect(store.state.rounds[0].horses[0].finishTime).toBe(50);
      expect(store.state.rounds[0].horses[1].position).toBe(20);
    });
    it('addRoundResult adds result for round', () => {
      const result = [{ id: 1, name: 'A', color: '#fff', condition: 50 }];
      store.commit('addRoundResult', { roundIndex: 0, result });
      expect(store.state.roundResults[0]).toEqual(result);
    });
    it('setTimerId and clearTimer manage timerId', () => {
      store.commit('setTimerId', 123);
      expect(store.state.timerId).toBe(123);
      store.commit('clearTimer');
      expect(store.state.timerId).toBeNull();
    });
    it('resetGame resets all state', () => {
      store.replaceState({
        horses: [{ id: 1, name: 'A', color: '#fff', condition: 50 }],
        rounds: [{ distance: 1200, horses: [] }],
        currentRoundIndex: 2,
        roundResults: [[{ id: 1, name: 'A', color: '#fff', condition: 50 }]],
        raceStatus: 'running',
        timerId: 123,
      });
      store.commit('resetGame');
      expect(store.state.horses).toEqual([]);
      expect(store.state.rounds).toEqual([]);
      expect(store.state.currentRoundIndex).toBe(0);
      expect(store.state.roundResults).toEqual([]);
      expect(store.state.raceStatus).toBe('idle');
      expect(store.state.timerId).toBeNull();
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      store.replaceState({
        horses: [],
        rounds: [
          { distance: 1200, horses: [{ id: 1, name: 'A', color: '#fff', condition: 50 }], raceStartTime: 123 }
        ],
        currentRoundIndex: 0,
        roundResults: [[{ id: 1, name: 'A', color: '#fff', condition: 50 }]],
        raceStatus: 'running',
        timerId: null,
      });
    });
    it('startPauseLabel returns correct label', () => {
      expect(store.getters.startPauseLabel).toBe('Pause');
      store.replaceState({ ...store.state, raceStatus: 'paused' });
      expect(store.getters.startPauseLabel).toBe('Resume');
      store.replaceState({ ...store.state, raceStatus: 'finished' });
      expect(store.getters.startPauseLabel).toBe('Finished');
      store.replaceState({ ...store.state, raceStatus: 'idle' });
      expect(store.getters.startPauseLabel).toBe('Start');
    });
    it('lapLabel returns correct label', () => {
      expect(store.getters.lapLabel).toContain('Lap');
    });
    it('currentHorses returns horses for current round', () => {
      expect(store.getters.currentHorses).toHaveLength(1);
    });
    it('currentRound returns current round', () => {
      expect(store.getters.currentRound).toEqual(store.state.rounds[0]);
    });
    it('roundResults returns roundResults', () => {
      expect(store.getters.roundResults).toEqual(store.state.roundResults);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });
    it('generateHorses commits setHorses', async () => {
      const horses = [{ id: 1, name: 'A', color: '#fff', condition: 50 }];
      vi.spyOn(utils, 'generateHorses').mockReturnValue(horses as IHorse[]);
      await store.dispatch('generateHorses', 1);
      expect(store.state.horses).toEqual(horses);
    });
    it('generateRounds commits setRounds, setRoundResults, setCurrentRoundIndex', async () => {
      const horses = [{ id: 1, name: 'A', color: '#fff', condition: 50 }];
      const rounds = [{ distance: 1200, horses }];
      vi.spyOn(utils, 'generateRounds').mockReturnValue(rounds as IRound[]);
      store.replaceState({ ...store.state, horses });
      await store.dispatch('generateRounds');
      expect(store.state.rounds).toEqual(rounds);
      expect(store.state.roundResults).toEqual([]);
      expect(store.state.currentRoundIndex).toBe(0);
    });
    it('startRace sets raceStatus and calls runCurrentRound', async () => {
      const spy = vi.spyOn((store as any)._actions.runCurrentRound, '0');
      store.replaceState({ ...store.state, raceStatus: 'idle' });
      await store.dispatch('startRace');
      expect(store.state.raceStatus).toBe('running');
      expect(spy).toHaveBeenCalled();
    });
    it('pauseRace sets raceStatus and clears timer', async () => {
      store.replaceState({ ...store.state, raceStatus: 'running', timerId: 123 });
      await store.dispatch('pauseRace');
      expect(store.state.raceStatus).toBe('paused');
      expect(store.state.timerId).toBeNull();
    });
    it('generateAll dispatches generateHorses and generateRounds, sets raceStatus', async () => {
      const horses = [{ id: 1, name: 'A', color: '#fff', condition: 50 }];
      const rounds = [{ distance: 1200, horses }];
      vi.spyOn(utils, 'generateHorses').mockReturnValue(horses as IHorse[]);
      vi.spyOn(utils, 'generateRounds').mockReturnValue(rounds as IRound[]);
      await store.dispatch('generateAll');
      expect(store.state.horses).toEqual(horses);
      expect(store.state.rounds).toEqual(rounds);
      expect(store.state.raceStatus).toBe('idle');
    });
    it('toggleRace dispatches pauseRace or startRace', async () => {
      const pauseSpy = vi.spyOn((store as any)._actions.pauseRace, '0');
      const startSpy = vi.spyOn((store as any)._actions.startRace, '0');
      store.replaceState({ ...store.state, raceStatus: 'running' });
      await store.dispatch('toggleRace');
      expect(pauseSpy).toHaveBeenCalled();
      store.replaceState({ ...store.state, raceStatus: 'paused' });
      await store.dispatch('toggleRace');
      expect(startSpy).toHaveBeenCalled();
    });
  });
}); 