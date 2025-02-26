<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters', 'reset'])

const localFilters = ref({
  category: props.filters.category,
  priceRange: {
    min: props.filters.priceRange.min,
    max: props.filters.priceRange.max
  },
  stockLevel: {
    min: props.filters.stockLevel.min,
    max: props.filters.stockLevel.max
  },
  status: props.filters.status
})

watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Category Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
      <BaseSelect
        v-model="localFilters.category"
        :options="[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]">
      </BaseSelect>
    </div>

    <!-- Price Range Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model.number="localFilters.priceRange.min"
          type="number"
          placeholder="Min Price"
        />
        <BaseInput
          v-model.number="localFilters.priceRange.max"
          type="number"
          placeholder="Max Price"
        />
      </div>
    </div>

    <!-- Stock Level Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Level</label>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model.number="localFilters.stockLevel.min"
          type="number"
          placeholder="Min Stock"
        />
        <BaseInput
          v-model.number="localFilters.stockLevel.max"
          type="number"
          placeholder="Max Stock"
        />
      </div>
    </div>

    <!-- Status Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
      <BaseSelect
        v-model="localFilters.status"
        :options="statusOptions">
      </BaseSelect>
    </div>
  </div>
</template>