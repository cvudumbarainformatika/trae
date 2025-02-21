<script setup>
import { computed } from 'vue'
import Card from '../../ui/Card.vue'
import IconButton from '../../ui/IconButton.vue'
import Icon from '../../ui/Icon.vue'
import noImage from '../../../assets/no-image.svg'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const stockStatus = computed(() => {
  if (props.product.currentStock === 0) return 'out-of-stock'
  if (props.product.currentStock <= props.product.minStock) return 'low-stock'
  return 'in-stock'
})

const stockStatusClass = computed(() => {
  switch (stockStatus.value) {
    case 'out-of-stock':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'low-stock':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
})
</script>

<template>
  <Card class="h-full group hover:shadow-lg transition-shadow duration-300 ease-in-out" :noPadding="true">
    <div class="flex flex-col h-full w-full">
      <div class="relative aspect-square overflow-hidden rounded-t-lg">
        <div class="absolute left-0 right-0 inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
        <img
          :src="product.image || noImage"
          :alt="product.name"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <span 
          :class="[
            'absolute top-3 right-3 z-20 px-3 py-1.5 text-xs font-medium rounded-full shadow-md',
            stockStatusClass
          ]"
        >
          {{ stockStatus }}
        </span>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <div class="space-y-1 mb-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {{ product.name }}
          </h3>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ product.category }}
          </p>
        </div>
        <div class="flex justify-between items-center mb-2">
          <div class="space-y-1">
            <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.regularPrice) }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Stock: {{ product.currentStock }}
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-auto">
          <IconButton
            @click="emit('edit', product)"
            variant="primary"
            size="sm"
            class="shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <template #icon>
              <Icon name="Edit" class="w-4 h-4" />
            </template>
          </IconButton>
          <IconButton
            @click="emit('delete', product)"
            variant="danger"
            size="sm"
            class="shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <template #icon>
              <Icon name="Trash" class="w-4 h-4" />
            </template>
          </IconButton>
        </div>
      </div>
    </div>
  </Card>
</template>