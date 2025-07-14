<template>
  <HorseIcon :color="color" :position="position"/>
  <span class="horse-name">{{ name }}</span>
</template>

<script setup lang="ts">
import HorseIcon from "./HorseIcon.vue";

defineProps<{ color: string; name: string; position: number }>()
</script>

<style scoped>
.horse-name {
  margin-left: 60px;
}
</style> 