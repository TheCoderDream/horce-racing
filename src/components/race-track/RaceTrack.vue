<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import Lane from './Lane.vue'
const store = useStore()
const lapLabel = computed(() => store.getters.lapLabel)
const currentHorses = computed(() => store.getters.currentHorses)
</script>

<template>
  <div class="race-track">
    <Lane v-for="(horse, idx) in currentHorses" :key="horse.id" :horse="horse" :laneNumber="idx + 1"></Lane>
    <div class="lap-info">{{ lapLabel }}</div>
    <div class="finish"></div>
  </div>
</template>

<style scoped>
.race-track {
  position: relative;
  width: 100%;
  min-height: 400px;
  border-radius: 8px;
}
.lap-info {
  margin-top: 1rem;
  font-weight: bold;
  color: #c0392b;
}
.finish {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #c0392b;
}
</style> 