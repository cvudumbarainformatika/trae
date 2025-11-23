<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm py-4 px-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
      <Icon name="ShoppingCart" class="w-6 h-6 mr-4 text-primary-500" />
      Daftar Produk
    </h3>
    <ProductSearch ref="productSearchRef" v-model="productSearch" @add-product="handleAddProduct"
      @open-scanner="showScanner = true" @products-loaded="onProductsLoaded" :add-not-found-product="false"
      :isi-tab="store?.isiTab" :disabled="isProductSearchDisabled" :placeholder="productSearchPlaceholder" />
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[35%]">
              Produk
            </th>
            <th scope="col"
              class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[25%]">
              Harga
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
              Jumlah
            </th>
            <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
              Subtotal
            </th>
            <th scope="col"
              class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[5%]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="store?.isiTab?.items?.length === 0">
            <td colspan="5" class="px-6 py-8">
              <div class="flex flex-col items-center justify-center">
                <Icon name="ShoppingCart" class="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Produk</h3>
                <p class="text-gray-500 dark:text-gray-400">Belum ada produk yang ditambahkan ke daftar penjualan.</p>
              </div>
            </td>
          </tr>
          <tr v-for="(item, index) in store?.isiTab?.items" :key="index"
            class="hover:bg-gray-50 dark:hover:bg-gray-950">
            <td class="px-3 py-4 whitespace-nowrap w-[35%]">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ item.product?.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right w-[25%]">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                formatRupiah(getItemPrice(item?.product))
              }}</span>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right w-[15%]">
              <div class="flex items-center justify-end gap-2">
                <button @click="decreaseQty(index)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <Icon name="Minus" class="w-4 h-4" />
                </button>
                <input type="number" min="1" v-model.number="item.qty" @input="updateItemSubtotal(index)"
                  class="w-12 text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                <button @click="increaseQty(index)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <Icon name="Plus" class="w-4 h-4" />
                </button>
              </div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white w-[20%]">
              {{ formatRupiah(item?.subtotal) }}
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right text-sm w-[5%]">
              <button @click="removeItem(index)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Hapus item">
                <Icon name="Trash" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="space-y-2">
        <div v-if="!store.isiTab?.items?.length" class="py-8">
          <div class="flex flex-col items-center justify-center">
            <Icon name="ShoppingCart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Produk</h3>
            <p class="text-gray-500 dark:text-gray-400">Belum ada produk yang ditambahkan ke daftar penjualan.</p>
          </div>
        </div>
        <div v-for="(item, index) in store.isiTab?.items" :key="index"
          class="rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          :class="['transition-all', store.existingItemHighlighted === item.product_id ? 'bg-blink animate-pulse' : 'bg-white dark:bg-gray-900 ']">
          <div class="flex justify-between items-start mb-1 ">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                {{ item?.product?.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item?.product?.barcode }}</div>
            </div>
            <button @click="removeItem(index)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label="Hapus item">
              <Icon name="Trash" class="w-4 h-4" />
            </button>
          </div>
          <div class="flex items-center justify-between gap-3 mt-2">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.price) }}</span>
            <div class="flex items-center gap-2">
              <button @click="decreaseQty(index)"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <Icon name="Minus" class="w-4 h-4" />
              </button>
              <input type="number" min="1" v-model.number="item.qty" @input="updateItemSubtotal(index)"
                class="w-12 text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
              <button @click="increaseQty(index)"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <Icon name="Plus" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal:</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item?.subtotal) }}</span>
          </div>
        </div>
      </div> -->
    </div>





    <!-- Delete Confirmation Modal -->
    <Modal v-model="store.isiTab.showDeleteConfirm" title="Konfirmasi Hapus Product" @close="handleCancelDeleteItem"
      persistent>
      <div class="p-4">
        <p class="text-gray-700 dark:text-gray-300">
          Benar akan Menghapus product ini dari List Penjualan ?
        </p>
        <p class="font-semibold text-primary-300 dark:text-primary-300">
          {{ store?.isiTab?.items[store?.isiTab?.itemIndexOnDelete]?.product?.name }}
        </p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Jika Iya product ini akan terhapus dari list penjualan.
        </p>
        <div class="border-b dark:border-gray-700 my-6"></div>
        <div class="flex justify-end space-x-4">
          <base-button label="Cancel" variant="ghost" @click="handleCancelDeleteItem" />
          <base-button label="Hapus !" variant="danger" @click="handleDeleteItem" />
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import ProductSearch from './ProductSearch.vue'
// import BaseInput from '@/components/ui/BaseInput.vue'
// import Icon from '@/components/ui/Icon.vue'
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs'
import { storeToRefs } from 'pinia'

import { formatRupiah } from '@/utils/uangHelper'



const productSearchRef = ref(null)
const productSearch = ref('')
const store = useSalesFormWitTabsStore()

const isProductSearchDisabled = computed(() => {
  return !store.isiTab?.customer_id;
});

const productSearchPlaceholder = computed(() => {
  return isProductSearchDisabled.value ? 'Pilih customer terlebih dahulu' : 'Cari produk untuk ditambahkan...';
});


defineExpose({
  focus: () => {
    productSearchRef?.value?.focus?.()
  }
})

onMounted(async () => {
  await nextTick()
  // console.log('Ref setelah render di product list:', productSearchRef.value);

  productSearchRef.value?.focus()
})


const { increaseQty, decreaseQty, removeItem, updateItemSubtotal, confirmDeleteItem, cancelDeleteItem } = store
// const { isiTab } = storeToRefs(store)


const handleDeleteItem = (index) => {
  confirmDeleteItem()
  productSearchRef?.value?.focus?.()
}

const handleCancelDeleteItem = () => {
  cancelDeleteItem()
  productSearchRef?.value?.focus?.()
}


function handleAddProduct(product, qty) {
  // Normalisasi data sebelum masuk ke store.items


  // console.log('🔥 addProduct dipanggil', qty, performance.now())


  const item = {
    product_id: product?.id ?? product?.product_id ?? null,
    product: product,
    harga_modal: StringToNumber(product?.hargabeli) ?? 0,
    qty,
    price: getItemPrice(product),
    subtotal: getItemPrice(product) * qty,
  }

  // console.log('item', item);

  store.addItem(item)
}
function onProductsLoaded(products) {
  // Optional: handle after products loaded
}

const showScanner = ref(false)


function getItemPrice(item) {
  const customer = store.isiTab.customer;
  const defaultPrice = StringToNumber(item?.hargajual) ?? 0;

  // Price is determined by selected customer's category.
  if (customer && customer.category) {
    switch (customer.category.toUpperCase()) {
      case 'RUMAH':
        return StringToNumber(item?.hargajualrumah) ?? defaultPrice;
      case 'TOKO':
        return StringToNumber(item?.hargajualtoko) ?? defaultPrice;
      case 'DEPOT':
        return StringToNumber(item?.hargajualdepot) ?? defaultPrice;
      case 'KHUSUS':
        return StringToNumber(item?.hargajualkhusus) ?? defaultPrice;
      case 'UMUM':
      default:
        return defaultPrice;
    }
  }

  // If no customer is selected, always return the general price.
  // The UI should prevent adding products if a customer is required but not selected.
  return defaultPrice;
}


function StringToNumber(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num
}

watch(
  () => store.isiTab?.customer,
  () => {
    if (store.isiTab?.items.length > 0) {
      store.isiTab.items.forEach((item, index) => {
        const newPrice = getItemPrice(item.product)
        const newItem = {
          ...item,
          price: newPrice,
          subtotal: newPrice * item.qty,
        }
        store.updateItem(index, newItem)
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
@keyframes blink-bg {

  0%,
  100% {
    background-color: #b1ae9b4b;
    /* blue-300 */
  }

  50% {
    background-color: #000000f2;
    /* red-400 */
  }
}

.bg-blink {
  animation: blink-bg 1s infinite;
}
</style>
