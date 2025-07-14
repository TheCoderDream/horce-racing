import { createStore, ActionContext } from 'vuex';
import type { IHorse, IRound, IRootState, RaceStatus } from '../types/index.js';
import { calculateHorsesNextPosition, generateHorses, generateRounds, getSortedHorsesByRanking, areAllHorsesFinished } from '../utils/index.js';
import { LAP_LABELS, TICK_MS, INTER_ROUND_DELAY_MS } from '../constants/index';

// Union type for mutation payloads
export type StorePayload =
  | { horses: IHorse[] }
  | { rounds: IRound[] }
  | { round: number }
  | { roundIndex: number, raceStartTime: number }
  | { results: IHorse[][] }
  | { status: RaceStatus }
  | { horseIndex: number, position: number, finishTime?: number }
  | { roundIndex: number, result: IHorse[] }
  | Array<{ horseIndex: number, position: number, finishTime?: number }>
  | null;

const state = (): IRootState => ({
  horses: [],
  rounds: [],
  currentRoundIndex: 0,
  roundResults: [],
  raceStatus: 'idle',
  timerId: null,
});

const storeOptions = {
  state: state(),
  mutations: {
    setHorses(state: IRootState, horses: IHorse[]) {
      state.horses = horses;
    },
    setRounds(state: IRootState, rounds: IRound[]) {
      state.rounds = rounds;
    },
    setCurrentRoundIndex(state: IRootState, round: number) {
      state.currentRoundIndex = round;
    },
    setRoundResults(state: IRootState, roundResults: IHorse[][]) {
      state.roundResults = roundResults;
    },
    setRaceStatus(state: IRootState, status: RaceStatus) {
      state.raceStatus = status;
    },
    setRaceStartTime(state: IRootState, { roundIndex, raceStartTime }: { roundIndex: number, raceStartTime: number }) {
      state.rounds[roundIndex].raceStartTime = raceStartTime;
    },
    updateHorsePosition(state: IRootState, { horseIndex, position, finishTime }: { horseIndex: number, position: number, finishTime?: number }) {
      state.rounds[state.currentRoundIndex].horses[horseIndex].position = position;
      if (finishTime !== undefined) {
        state.rounds[state.currentRoundIndex].horses[horseIndex].finishTime = finishTime;
      }
    },
    bulkUpdatePositions(state: IRootState, payloads: Array<{ horseIndex: number, position: number, finishTime?: number }>) {
      for (const { horseIndex, position, finishTime } of payloads) {
        state.rounds[state.currentRoundIndex].horses[horseIndex].position = position;
        if (finishTime !== undefined) {
          state.rounds[state.currentRoundIndex].horses[horseIndex].finishTime = finishTime;
        }
      }
    },
    addRoundResult(state: IRootState, { roundIndex, result }: { roundIndex: number, result: IHorse[] }) {
      state.roundResults[roundIndex] = result;
    },
    setTimerId(state: IRootState, timerId: any) {
      state.timerId = timerId;
    },
    clearTimer(state: IRootState) {
      if (state.timerId !== null) {
        clearInterval(state.timerId);
        state.timerId = null;
      }
    },
    resetGame(state: IRootState) {
      state.horses = [];
      state.rounds = [];
      state.currentRoundIndex = 0;
      state.roundResults = [];
      state.raceStatus = 'idle';
      this.clearTimer(state);
    }
  },
  actions: {
    generateHorses({ commit }: ActionContext<IRootState, IRootState>, count: number = 20) {
      const horses = generateHorses(count);
      commit('setHorses', horses);
    },
    generateRounds({ state, commit }: ActionContext<IRootState, IRootState>) {
      const rounds = generateRounds(state.horses);
      commit('setRounds', rounds);
      commit('setRoundResults', []);
      commit('setCurrentRoundIndex', 0);
    },
    startRace({ state, commit, dispatch }: ActionContext<IRootState, IRootState>) {
      if (state.raceStatus === 'running') return;
      commit('setRaceStatus', 'running');
      dispatch('runCurrentRound');
    },
    pauseRace({ commit }: ActionContext<IRootState, IRootState>) {
      commit('setRaceStatus', 'paused');
      commit('clearTimer');
    },
    runCurrentRound({ state, commit, dispatch }: ActionContext<IRootState, IRootState>) {
      if (!state.rounds[state.currentRoundIndex]) return;
      if (!state.rounds[state.currentRoundIndex].raceStartTime) {
        commit('setRaceStartTime', { roundIndex: state.currentRoundIndex, raceStartTime: Date.now() });
      }
      const raceStartTime = state.rounds[state.currentRoundIndex].raceStartTime!;
      commit('clearTimer');
      const interval = setInterval(() => {
        if (state.raceStatus !== 'running') {
          commit('clearTimer');
          return;
        }
        const round = state.rounds[state.currentRoundIndex];
        const batchPayload = calculateHorsesNextPosition(
          round,
          state.currentRoundIndex,
          raceStartTime
        );
        commit('bulkUpdatePositions', batchPayload);
        if (areAllHorsesFinished(round)) {
          void dispatch('finalizeRound');
        }
      }, TICK_MS);
      commit('setTimerId', interval);
    },
    finalizeRound({ state, commit, dispatch }: ActionContext<IRootState, IRootState>) {
      commit('clearTimer');
      const round = state.rounds[state.currentRoundIndex];
      const result = getSortedHorsesByRanking(round.horses);
      commit('addRoundResult', { roundIndex: state.currentRoundIndex, result });
      if (state.currentRoundIndex < state.rounds.length - 1) {
        commit('setCurrentRoundIndex', state.currentRoundIndex + 1);
        setTimeout(() => {
          if (state.raceStatus === 'running') {
            void dispatch('runCurrentRound');
          }
        }, INTER_ROUND_DELAY_MS);
      } else {
        commit('setRaceStatus', 'finished');
      }
    },
    generateAll({ dispatch, commit }: ActionContext<IRootState, IRootState>) {
      void dispatch('generateHorses', 20);
      void dispatch('generateRounds');
      commit('setRaceStatus', 'idle');
    },
    toggleRace({ state, dispatch }: ActionContext<IRootState, IRootState>) {
      if (state.raceStatus === 'running') {
        void dispatch('pauseRace');
      } else {
        void dispatch('startRace');
      }
    },
  },
  getters: {
    startPauseLabel(state: IRootState): string {
      if (state.raceStatus === 'running') return 'Pause';
      if (state.raceStatus === 'paused') return 'Resume';
      if (state.raceStatus === 'finished') return 'Finished';
      return 'Start';
    },
    lapLabel(state: IRootState): string {
      return LAP_LABELS[state.currentRoundIndex] || '';
    },
    currentHorses(state: IRootState): IHorse[] {
      const round = state.rounds[state.currentRoundIndex];
      return round ? round.horses : [];
    },
    currentRound(state: IRootState): IRound {
      return state.rounds[state.currentRoundIndex];
    },
    roundResults(state: IRootState): IHorse[][] {
      return state.roundResults;
    }
  }
};

export default createStore(storeOptions); 