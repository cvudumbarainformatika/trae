<!-- components/InfoRow.vue -->
<template>
  <div class="flex justify-between border-b py-1">
    <span class="font-medium">{{ label }}</span>
    <span class="font-semibold text-right">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
})
</script>
