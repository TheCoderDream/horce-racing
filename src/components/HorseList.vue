<template>
  <div>
    <h2>Horse List (1 - 20)</h2>
    <BaseTable :columns="HORSE_LIST_COLUMNS" :rows="horses">
      <template #body-cell-color="{ value }">
        <span class="content" :style="{ backgroundColor: value }"></span>
        {{ value }}
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseTable from './BaseTable.vue'
import { HORSE_LIST_COLUMNS } from '../constants/table.js';
const store = useStore()
const horses = computed(() => store.state.horses)
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

.content {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>