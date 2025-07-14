<template>
  <div>
    <h2>Horse List (1 - 20)</h2>
    <BaseTable :columns="columns" :rows="horses">
      <template #body-cell-color="{ value }">
        <span :style="{ backgroundColor: value, display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%' }"></span>
        {{ value }}
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseTable from './BaseTable.vue'
const store = useStore()
const horses = computed(() => store.state.horses)
const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', required: true },
  { name: 'condition', label: 'Condition', field: 'condition', align: 'right' },
  { name: 'color', label: 'Color', field: 'color', align: 'center' },
]
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 4px 8px;
  text-align: left;
}
</style>