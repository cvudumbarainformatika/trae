<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatRupiah } from '@/utils/uangHelper'
import Card from '@/components/ui/Card.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Icon from '@/components/ui/Icon.vue'
import noImage from '@/assets/no-image.svg'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete'])

const isTableView = ref(true)
const checkScreenSize = () => {
  isTableView.value = window.innerWidth >= 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const getStockStatusClass = (status) => {
  if (status === 'out-of-stock') {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  } else if (status === 'low-stock') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getStockStatus = (product) => {
  const stock = props.mode === 'gudang' ? product?.stock_akhir_gudang || 0 : product?.stock_akhir || 0
  if (stock <= 0) return 'out-of-stock'
  if (stock <= product.minstock && stock > 0) return 'low-stock'
  return 'in-stock'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}
</script>

<template>
  <div>
    <!-- Table View -->
    <div v-if="isTableView" class="overflow-x-auto rounded-lg shadow relative">
      <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">

        <thead class="bg-gray-50 dark:bg-dark-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Details
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Price
            </th>
            <th scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Stock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Status
            </th>
            <th scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-dark-700" v-html-safe="{
            data: {
              name: product.name,
              barcode: product.barcode,
              'category.name': product.category?.name
            },
            fields: ['name', 'barcode', 'category.name'],
            searchQuery: searchQuery
          }">
            <td class="px-6 py-4 lg:whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full object-cover" :src="product.image || noImage" :alt="product.name">
                </div>
                <div class="ml-4">
                  <div data-field="name" class="text-sm font-medium text-gray-900 dark:text-white lg:truncate">{{
                    product.name }}</div>
                  <div data-field="barcode" class="text-sm text-gray-500 dark:text-gray-400 lg:truncate">{{
                    product.barcode }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 lg:whitespace-nowrap">
              <div data-field="category.name" class="lg:truncate">{{ product.category?.name || '-' }}</div>
              <div class="lg:truncate"> Rak {{ product.rak || '-' }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white lg:whitespace-nowrap text-right">
              <div class="truncate"> <span class="text-gray-400">BL :</span> {{ formatRupiah(product?.hargabeli) }}
              </div>
              <div class="truncate"><span class="text-gray-400">UMUM :</span> {{ formatRupiah(product?.hargajual) }}
              </div>
              <div class="truncate"><span class="text-gray-400">CUST :</span> {{ formatRupiah(product?.hargajualcust) }}
              </div>
              <div class="truncate"><span class="text-gray-400">ANTAR :</span> {{ formatRupiah(product?.hargajualantar)
                }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 lg:whitespace-nowrap text-right">
              <div class="truncate">{{ mode === 'gudang' ? product?.stock_akhir_gudang || 0 : product?.stock_akhir || 0
                }}</div>
            </td>
            <td class="px-6 py-4 lg:whitespace-nowrap">
              <span
                :class="['px-2 py-1 text-xs font-medium rounded-full', getStockStatusClass(getStockStatus(product))]">
                {{ getStockStatus(product) }}
              </span>
            </td>
            <td class="px-6 py-4 lg:whitespace-nowrap text-right text-sm font-medium space-x-2">
              <IconButton @click="emit('edit', product)" variant="primary" size="sm">
                <template #icon>
                  <Icon name="Edit" class="w-4 h-4" />
                </template>
              </IconButton>
              <IconButton @click="emit('delete', product)" variant="danger" size="sm">
                <template #icon>
                  <Icon name="Trash" class="w-4 h-4" />
                </template>
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card v-for="product in products" :key="product.id" class="h-full" no-padding>
        <div class="p-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-16 w-16">
              <img class="h-16 w-16 rounded-lg object-cover" :src="product.image || noImage" :alt="product.name">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ product.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ product.barcode }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ product?.category?.name }}</p>
            </div>
            <div class="text-right text-xs font-semibold text-gray-900 dark:text-white">
              <div class="truncate"> <span class="text-gray-400">BL :</span> {{ formatRupiah(product?.hargabeli) }}
              </div>
              <div class="truncate"><span class="text-gray-400">UMUM :</span> {{ formatRupiah(product?.hargajual) }}
              </div>
              <div class="truncate"><span class="text-gray-400">CUST :</span> {{ formatRupiah(product?.hargajualcust) }}
              </div>
              <div class="truncate"><span class="text-gray-400">ANTAR :</span> {{ formatRupiah(product?.hargajualantar)
                }}</div>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStockStatusClass(getStockStatus(product))]">
              {{ getStockStatus(product) }}
            </span>


            <div class="space-x-2">
              <IconButton @click="emit('edit', product)" variant="primary" size="sm">
                <template #icon>
                  <Icon name="Edit" class="w-4 h-4" />
                </template>
              </IconButton>
              <IconButton @click="emit('delete', product)" variant="danger" size="sm">
                <template #icon>
                  <Icon name="Trash" class="w-4 h-4" />
                </template>
              </IconButton>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
