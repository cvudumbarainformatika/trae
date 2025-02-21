<script setup>
import { computed } from 'vue'
import Card from '../../ui/Card.vue'
import IconButton from '../../ui/IconButton.vue'
import Icon from '../../ui/Icon.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const getStockStatusClass = (product) => {
  if (product.currentStock === 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  if (product.currentStock <= product.minStock) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getStockStatus = (product) => {
  if (product.currentStock === 0) return 'out-of-stock'
  if (product.currentStock <= product.minStock) return 'low-stock'
  return 'in-stock'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}
</script>

<template>
  <!-- <Card class="overflow-hidden" no-padding> -->
    <div class="overflow-auto rounded-lg shadow relative">
      <table class="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">

        <thead class="bg-gray-50 dark:bg-dark-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Stock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full object-cover" :src="product.image || '/placeholder.jpg'" :alt="product.name">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ product.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ product.barcode }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="truncate">{{ product.category }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
              <div class="truncate">{{ formatCurrency(product.regularPrice) }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <div class="truncate">{{ product.currentStock }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStockStatusClass(product)]">
                {{ getStockStatus(product) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <IconButton
                @click="emit('edit', product)"
                variant="primary"
                size="sm"
              >
                <template #icon>
                  <Icon name="Edit" class="w-4 h-4" />
                </template>
              </IconButton>
              <IconButton
                @click="emit('delete', product)"
                variant="danger"
                size="sm"
              >
                <template #icon>
                  <Icon name="Trash" class="w-4 h-4" />
                </template>
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  <!-- </Card> -->
</template>