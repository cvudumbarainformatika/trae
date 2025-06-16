<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
      <Icon name="ShoppingCart" class="w-5 h-5 mr-2 text-primary-500" />
      DAFTAR PRODUK
    </h3>
    <ProductSearch ref="productSearchRef" v-model="productSearch" @add-product="addProduct"
      @open-scanner="showScanner = true" @products-loaded="onProductsLoaded" />
    <div class="overflow-x-auto">
      <!-- <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
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
            <th scope="col"
              class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
              Jumlah
            </th>
            <th scope="col"
              class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%]">
              Subtotal
            </th>
            <th scope="col"
              class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[5%]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
          <tr v-if="store.isiTab.items?.length === 0">
            <td colspan="5" class="px-3 py-8">
              <div class="flex flex-col items-center justify-center">
                <Icon name="ShoppingCart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Produk</h3>
                <p class="text-gray-500 dark:text-gray-400">Belum ada produk yang ditambahkan ke daftar penjualan.</p>
              </div>
            </td>
          </tr>
          <tr v-for="(item, index) in store.isiTab.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-3 py-4 whitespace-nowrap w-[35%]">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ item.product?.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right w-[25%]">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(getItemPrice(item))
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
              {{ formatCurrency(item.subtotal) }}
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-right text-sm w-[5%]">
              <button @click="removeItem(index)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Hapus item">
                <Icon name="Trash" class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table> -->
      <div class="space-y-4">
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
          <div class="flex justify-between items-start mb-2 ">
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
      </div>
    </div>





    <!-- Delete Confirmation Modal -->
    <Modal v-model="isiTab.showDeleteConfirm" title="Konfirmasi Hapus Product"
      @close="isiTab.showDeleteConfirm = false">
      <div class="p-4">
        <p class="text-gray-700 dark:text-gray-300">
          Benar akan Menghapus product ini dari List Penjualan ?
        </p>
        <p class="font-semibold text-primary-300 dark:text-primary-300">
          {{ isiTab.items[isiTab.itemIndexOnDelete]?.product?.name }}
        </p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Jika Iya product ini akan terhapus dari list penjualan.
        </p>
        <div class="border-b dark:border-gray-700 my-6"></div>
        <div class="flex justify-end space-x-4">
          <base-button label="Cancel" variant="ghost" @click="cancelDeleteItem" />
          <base-button label="Hapus !" variant="danger" @click="confirmDeleteItem" />
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProductSearch from '@/components/admin/transaksi/pembelian/ProductSearch.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Icon from '@/components/ui/Icon.vue'
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs'
import { storeToRefs } from 'pinia'

const productSearchRef = ref(null)
const productSearch = ref('')
const store = useSalesFormWitTabsStore()

defineExpose({
  focus: () => {
    if (productSearchRef.value) {
      productSearchRef.value.focus()
    }
  }
})


const { increaseQty, decreaseQty, removeItem, updateItemSubtotal, confirmDeleteItem, cancelDeleteItem } = store
const { isiTab } = storeToRefs(store)

function addProduct(product) {
  // Normalisasi data sebelum masuk ke store.items
  const item = {
    product_id: product.id ?? product.product_id ?? null,
    product: product,
    qty: 1,
    price: getItemPrice(product),
    subtotal: getItemPrice(product) * 1,
  }
  store.addItem(item)
}
function onProductsLoaded(products) {
  // Optional: handle after products loaded
}
function formatCurrency(value) {
  // console.log(value);

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
}
const showScanner = ref(false)


function getItemPrice(item) {
  console.log('item', item.hargajual, item.hargajualcust, store.isiTab);

  if (store.isiTab.category === 'umum') {
    return StringToNumber(item.hargajual) ?? 0
  } else if (store.isiTab.category === 'pelanggan') {
    return StringToNumber(item.hargajualcust) ?? 0
  }
  // return item.price
}

function StringToNumber(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num
}
// watch(store.isiTab.items, (newItems) => {
//   console.log('Items changed:', newItems)
// })
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
