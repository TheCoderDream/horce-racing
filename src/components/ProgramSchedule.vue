<template>
  <div>
    <h2>Program & Results</h2>
    <div v-for="(_, idx) in rounds" :key="idx" class="program-result-pair">
      <div class="tables-row">
        <div class="program-table">
          <h3>{{ programTitles[idx] }}</h3>
          <BaseTable :columns="columns" :rows="programRowsList[idx]">
            <template #body-cell-position="{ value }">
              {{ value + 1 }}
            </template>
          </BaseTable>
        </div>
        <div class="result-table">
          <h3>Results</h3>
          <BaseTable v-if="resultRowsList[idx]" :columns="columns" :rows="resultRowsList[idx]">
            <template #body-cell-position="{ value }">
              {{ value + 1 }}
            </template>
          </BaseTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseTable from './BaseTable.vue'
import {getOrdinal} from "../utils/index.js";
const store = useStore()
const rounds = computed(() => store.state.rounds)
const results = computed(() => store.state.results)
const columns = [
  { name: 'position', label: 'Position', field: 'position', align: 'left', required: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
]

const programTitles = computed(() =>
  rounds.value.map((round, idx) => `${idx + 1}${getOrdinal(idx + 1)} Lap - ${round.distance}m`)
)
const programRowsList = computed(() =>
  rounds.value.map(round => round.horses.map((horse, idx) => ({ position: idx, name: horse.name })))
)
const resultRowsList = computed(() =>
  results.value.map(result => result.map((horse, idx) => ({ position: idx, name: horse.name })))
)
</script>

<style scoped>
.program-result-pair {
  margin-bottom: 2rem;
}
.tables-row {
  display: flex;
  gap: 2rem;
}
.program-table, .result-table {
  flex: 1 1 0;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 2px 6px;
  text-align: left;
}
</style> 