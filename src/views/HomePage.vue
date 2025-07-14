<script setup lang="ts">
import { useStore } from 'vuex'
import {computed, onMounted} from 'vue'
import HorseList from '../components/HorseList.vue'
import RaceTrack from '../components/race-track/RaceTrack.vue'
import ProgramSchedule from '../components/ProgramSchedule.vue'
import MainLayout from '../layouts/MainLayout.vue'

const store = useStore()
const raceStatus = computed(() => store.state.raceStatus)

function handleGenerate() {
  store.dispatch('generateAll')
}

function handleStartPause() {
  store.dispatch('toggleRace')
}

const startPauseLabel = computed(() => store.getters.startPauseLabel)

onMounted(() => {
  handleGenerate();
})
</script>

<template>
  <MainLayout>
    <template #controls>
      <button @click="handleGenerate">Generate Program</button>
      <button @click="handleStartPause" :disabled="raceStatus === 'finished'">{{ startPauseLabel }}</button>
    </template>
    <template #sidePanelLeft>
      <HorseList />
    </template>
    <template #mainArea>
      <RaceTrack />
    </template>
    <template #sidePanelRight>
      <ProgramSchedule />
    </template>
  </MainLayout>
</template>
