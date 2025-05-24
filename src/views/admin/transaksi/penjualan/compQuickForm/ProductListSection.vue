<template>

  <!-- Product List Section -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
      <Icon name="ShoppingCart" class="w-5 h-5 mr-2 text-primary-500" />
      Daftar Produk
    </h3>

    <!-- Product Search - tetap aktif meskipun dari PO -->
    <ProductSearch
      ref="productSearchRef"
      v-model="productSearch"
      @add-product="addProduct"
      @open-scanner="showScanner = true"
      @products-loaded="onProductsLoaded"
    />

    <!-- Product Table -->
    <div class="overflow-x-auto">
      <!-- Desktop Table (tampil pada layar md ke atas) -->
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[35%]">
              Produk
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[25%]">
              Harga
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
              Jumlah
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%]">
              Subtotal
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[5%]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="form?.items.length === 0">
            <td colspan="5" class="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Belum ada produk yang ditambahkan
            </td>
          </tr>
          <tr v-for="(item, index) in form?.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-3 py-4 whitespace-nowrap w-[35%]">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ item.product?.name }}
                <span
                  v-if="form.purchase_order_id && item.is_additional"
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                >
                  Non-PO
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right w-[25%]">
              <BaseInput
                v-model.number="item.price"
                type="number"
                min="0"
                class="w-full text-right"
                @input="updateItemSubtotal(index)"
              />
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right w-[15%]">
              <BaseInput
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full text-right"
                @input="updateItemSubtotal(index)"
              />
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white w-[20%]">
              {{ formatCurrency(item.subtotal) }}
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right text-sm w-[5%]">
              <button
                v-if="!form.purchase_order_id || item.is_additional"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Hapus item"
              >
                <Icon name="Trash" class="w-4 h-4" />
              </button>
              <span
                v-else
                class="inline-flex items-center justify-center p-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                title="Item dari Purchase Order tidak dapat dihapus"
              >
                <Icon name="Lock" class="w-4 h-4" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Card View (tampil pada layar kecil) -->
      <div class="md:hidden space-y-4">
        <div v-if="form?.items.length === 0" class="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          Belum ada produk yang ditambahkan
        </div>

        <div
          v-for="(item, index) in form?.items"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          :class="{ 'border-l-4 border-l-amber-500': form.purchase_order_id && item.is_additional }"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                {{ item.product?.name }}
                <span
                  v-if="form.purchase_order_id && item.is_additional"
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                >
                  Non-PO
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
            </div>
            <button
              v-if="!form.purchase_order_id || item.is_additional"
              @click="removeItem(index)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Hapus item"
            >
              <Icon name="Trash" class="w-4 h-4" />
            </button>
            <span
              v-else
              class="inline-flex items-center justify-center p-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              title="Item dari Purchase Order tidak dapat dihapus"
            >
              <Icon name="Lock" class="w-4 h-4" />
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Harga</label>
              <BaseInput
                v-model.number="item.price"
                type="number"
                min="0"
                class="w-full text-right"
                @input="updateItemSubtotal(index)"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah</label>
              <BaseInput
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full text-right"
                @input="updateItemSubtotal(index)"
              />
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.subtotal) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import ProductSearch from '@/components/admin/transaksi/pembelian/ProductSearch.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Icon from '@/components/ui/Icon.vue'

const productSearchRef = ref(null)
const productSearch = ref('')

// Props
const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:form'])

// Methods
function addProduct(product) {
  props.store.addProduct(product)
  emit('update:form', props.form)
}
function removeItem(index) {
  props.store.removeItem(index)
  emit('update:form', props.form)
}
function updateItemSubtotal(index) {
  props.store.updateItemSubtotal(index)
  emit('update:form', props.form)
}
function onProductsLoaded(products) {
  // Optional: handle after products loaded
}
const showScanner = ref(false)
</script>
