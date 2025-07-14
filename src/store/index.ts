import { createStore } from 'vuex';
import type { IHorse, IRound, IRootState, RaceStatus } from '../types/index.js';
import { advanceHorsesRealTime, generateHorses, generateRounds, getSortedHorsesByRanking } from '../utils/index.js';
import { LAP_LABELS } from '../constants/index';


const storeOptions = {
  state: {
    horses: [],
    rounds: [],
    currentRound: 0,
    results: [],
    raceStatus: 'idle',
  } as IRootState,
  mutations: {
    setHorses(state: IRootState, horses: IHorse[]) {
      state.horses = horses;
    },
    setRounds(state: IRootState, rounds: IRound[]) {
      state.rounds = rounds;
    },
    setCurrentRound(state: IRootState, round: number) {
      state.currentRound = round;
    },
    setResults(state: IRootState, results: IHorse[][]) {
      state.results = results;
    },
    setRaceStatus(state: IRootState, status: RaceStatus) {
      state.raceStatus = status;
    },
    setRaceStartTime(state: IRootState, { roundIndex, raceStartTime }: { roundIndex: number, raceStartTime: number }) {
      state.rounds[roundIndex].raceStartTime = raceStartTime;
    },
    updateHorsePosition(state: IRootState, { roundIndex, horseIndex, position, finishTime }: { roundIndex: number, horseIndex: number, position: number, finishTime?: number }) {
      state.rounds[roundIndex].horses[horseIndex].position = position;
      if (finishTime !== undefined) {
        state.rounds[roundIndex].horses[horseIndex].finishTime = finishTime;
      }
    },
    addRoundResult(state: IRootState, { roundIndex, result }: { roundIndex: number, result: IHorse[] }) {
      state.results[roundIndex] = result;
    },
    resetGame(state: IRootState) {
      state.horses = [];
      state.rounds = [];
      state.currentRound = 0;
      state.results = [];
      state.raceStatus = 'idle';
    }
  },
  actions: {
    generateHorses({ commit }: { commit: Function }, count: number = 20) {
      const horses = generateHorses(count);
      commit('setHorses', horses);
    },
    generateRounds({ state, commit }: { state: IRootState; commit: Function }) {
      const rounds = generateRounds(state.horses);
      commit('setRounds', rounds);
      commit('setResults', []);
      commit('setCurrentRound', 0);
    },
    startRace({ state, commit, dispatch }: { state: IRootState; commit: Function; dispatch: Function }) {
      if (state.raceStatus === 'running') return;
      commit('setRaceStatus', 'running');
      dispatch('runCurrentRound');
    },
    pauseRace({ commit }: { commit: Function }) {
      commit('setRaceStatus', 'paused');
    },
    runCurrentRound({ state, commit, dispatch }: { state: IRootState; commit: Function; dispatch: Function }) {
      if (!state.rounds[state.currentRound]) return;
      // Set race start time for this round if not already set
      if (!state.rounds[state.currentRound].raceStartTime) {
        commit('setRaceStartTime', { roundIndex: state.currentRound, raceStartTime: Date.now() });
      }
      const raceStartTime = state.rounds[state.currentRound].raceStartTime!;
      let interval = setInterval(() => {
        if (state.raceStatus !== 'running') {
          clearInterval(interval);
          return;
        }
        const round = state.rounds[state.currentRound];
        const finished = advanceHorsesRealTime(
          round,
          (horseIndex, newPosition, finishedNow, finishTime) => {
            const payload: any = { roundIndex: state.currentRound, horseIndex, position: newPosition };
            if (finishedNow && finishTime !== undefined) payload.finishTime = finishTime;
            commit('updateHorsePosition', payload);
          },
          state.currentRound,
          raceStartTime
        );
        if (finished) {
          clearInterval(interval);
          const result = getSortedHorsesByRanking(round.horses);
          commit('addRoundResult', { roundIndex: state.currentRound, result });
          if (state.currentRound < state.rounds.length - 1) {
            commit('setCurrentRound', state.currentRound + 1);
            setTimeout(() => {
              if (state.raceStatus === 'running') {
                dispatch('runCurrentRound');
              }
            }, 1000);
          } else {
            commit('setRaceStatus', 'finished');
          }
        }
      }, 100);
    },
    generateAll({ dispatch, commit }: { dispatch: Function; commit: Function }) {
      dispatch('generateHorses', 20);
      dispatch('generateRounds');
      commit('setRaceStatus', 'idle');
    },
    toggleRace({ state, dispatch }: { state: IRootState; dispatch: Function }) {
      if (state.raceStatus === 'running') {
        dispatch('pauseRace');
      } else {
        dispatch('startRace');
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
      return LAP_LABELS[state.currentRound] || '';
    },
    currentHorses(state: IRootState): IHorse[] {
      const round = state.rounds[state.currentRound];
      return round ? round.horses : [];
    },
  }
};

export default createStore(storeOptions); 