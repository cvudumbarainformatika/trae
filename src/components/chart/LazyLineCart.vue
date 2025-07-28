<script setup>
import { defineAsyncComponent, computed } from 'vue'

const AsyncLineChart = defineAsyncComponent(() =>
  import('./LineCart.vue')
)
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncLineChart />
    </template>
    <template #fallback>
      <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">Loading chart...</div>
    </template>
  </Suspense>
</template>
