<template>
  <div class="profit-loss-info-row flex justify-between items-center py-2">
    <span class="profit-loss-info-row-label text-sm text-gray-600 dark:text-gray-300">{{ label }}</span>
    <span class="profit-loss-info-row-value text-sm font-mono font-semibold" :class="[isNegative ? 'negative' : '', valueClass]">
      {{ formatRupiah(value) }}
    </span>
  </div>
</template>

<script setup>
import { formatRupiah } from '@/utils/uangHelper'

defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  isNegative: {
    type: Boolean,
    default: false
  },
  valueClass: {
    type: String,
    default: ''
  }
})
</script>