<template>
  <Suspense>
    <template #default>
      <AsyncComp mode="gudang" />
    </template>
    <template #fallback>
      <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">Loading chart...</div>
    </template>
  </Suspense>
</template>

<script setup>
import AsyncComp from '../../master/products/Products.vue'
</script>
