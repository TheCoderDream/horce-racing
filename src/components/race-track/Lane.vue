<template>
  <div class="lane">
    <span class="lane-number">{{ laneNumber }}</span>
    <Horse :color="horse.color" :name="horse.name" :position="horse.position ?? 0" />
  </div>
</template>

<script setup lang="ts">

import Horse from "./Horse.vue";
import {IHorse} from "../../types/index.js";

defineProps<{ horse: IHorse; laneNumber: number }>()
</script>

<style scoped>
.lane {
  position: relative;
  height: 40px;
  border-bottom: 1px dashed #aaa;
  display: flex;
  align-items: center;
}
.lane-number {
  width: 24px;
  font-weight: bold;
}
</style> 