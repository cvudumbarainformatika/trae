<template>
  <BasePage
    :title="pageTitle"
    :subtitle="pageSubtitle"
  >
    <template #actions>
      <div class="flex space-x-2">
        <BaseButton
          @click="store.goBack(router)"
          variant="secondary"
          size="md"
        >
          <template #icon-left>
            <Icon name="ArrowLeft" class="w-4 h-4" />
          </template>
          Kembali
        </BaseButton>
        <BaseButton
          @click="handleSubmit"
          variant="primary"
          size="md"
          :loading="loading"
          :disabled="!isFormValid || loading"
        >
          <template #icon-left>
            <Icon name="Save" class="w-4 h-4" />
          </template>
          Simpan
        </BaseButton>
      </div>
    </template>

    <!-- Form content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Supplier and Date Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Supplier Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <SearchDropdown
                  v-model="supplierSearch"
                  placeholder="Cari supplier..."
                  :loading="supplierLoading"
                  :items="store.filteredSuppliers"
                  item-text="name"
                  @select="store.selectSupplier"
                  @search="store.searchSuppliers"
                />
              </div>
              <div v-if="form.supplier" class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ form.supplier.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.supplier.phone }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.supplier.address }}</div>
              </div>
            </div>

            <!-- Date and Invoice Number -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.date"
                  type="date"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Faktur
                </label>
                <BaseInput
                  v-model="form.invoice_number"
                  placeholder="Masukkan nomor faktur..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Produk</h3>
            <div class="flex space-x-2" v-if="!purchaseOrderId">
              <BaseButton
                @click="showScanner = true"
                variant="secondary"
                size="sm"
              >
                <template #icon-left>
                  <Icon name="Scan" class="w-4 h-4" />
                </template>
                Scan Barcode
              </BaseButton>
              <BaseButton
                @click="productSearchRef.focus"
                variant="primary"
                size="sm"
              >
                <template #icon-left>
                  <Icon name="Plus" class="w-4 h-4" />
                </template>
                Tambah Produk
              </BaseButton>
            </div>
          </div>

          <!-- Product Search -->
          <div v-if="!purchaseOrderId" class="mb-4">
            <SearchDropdown
              ref="productSearchRef"
              v-model="productSearch"
              placeholder="Cari produk berdasarkan nama atau barcode..."
              :loading="productLoading"
              :items="store.filteredProducts"
              item-text="name"
              @select="store.selectProduct"
              @search="store.searchProducts"
            >
              <template #item="{ item }">
                <div class="flex justify-between items-center w-full">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.barcode }}</div>
                  </div>
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.hargabeli) }}
                  </div>
                </div>
              </template>
            </SearchDropdown>
          </div>

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[35%]">
                    Produk
                  </th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[25%]">
                    Harga
                  </th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                    Qty
                  </th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[25%]">
                    Subtotal
                  </th>
                  <th v-if="!purchaseOrderId" scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[5%]">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="form.items.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada produk yang ditambahkan
                  </td>
                </tr>
                <tr v-for="(item, index) in form.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap w-[35%]">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product?.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap w-[25%]">
                    <BaseInput
                      v-model.number="item.price"
                      type="number"
                      class="w-full text-right"
                      min="0"
                      @input="store.updateSubtotal(item)"
                      style="text-align: right;"
                    />
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap w-[15%]">
                    <BaseInput
                      v-model.number="item.quantity"
                      type="number"
                      class="w-full text-right"
                      min="1"
                      @input="store.updateSubtotal(item)"
                      style="text-align: right;"
                    />
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-[25%]">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal) }}
                  </td>
                  <td v-if="!purchaseOrderId" class="px-4 py-3 text-right whitespace-nowrap w-[5%]">
                    <button
                      @click="store.removeItem(index)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Hapus item"
                    >
                      <Icon name="Trash" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Total</td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(store.calculateTotal()) }}
                  </td>
                  <td v-if="!purchaseOrderId"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Ringkasan</h3>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Jumlah Item</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ form.items.length }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total Qty</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ store.calculateTotalQuantity() }}</span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(store.calculateTotal()) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Diskon</span>
              <div class="flex items-center">
                <BaseInput
                  v-model.number="form.discount"
                  type="number"
                  class="w-20 text-right"
                  min="0"
                  aria-label="Jumlah diskon"
                />
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Pajak</span>
              <div class="flex items-center">
                <BaseInput
                  v-model.number="form.tax"
                  type="number"
                  class="w-20 text-right"
                  min="0"
                  aria-label="Persentase pajak"
                />
                <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div class="flex justify-between items-center">
              <span class="text-base font-medium text-gray-900 dark:text-white">Total</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(store.calculateGrandTotal()) }}</span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan</label>
              <BaseInput
                v-model="form.notes"
                type="textarea"
                placeholder="Tambahkan catatan untuk pembelian ini..."
                rows="3"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barcode Scanner Modal -->
    <BaseDialog v-if="showScanner" @close="showScanner = false">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Scan Barcode</h3>
      </template>
      <template #body>
        <BarcodeScanner
          @scan-success="store.handleBarcodeScan"
          @scan-error="handleScanError"
          @close="showScanner = false"
        />
      </template>
    </BaseDialog>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePurchaseFormStore } from '@/stores/transaksi/pembelian/form'
import { useNotification } from '@/composables/useNotification'
import { PURCHASE_STATUS } from '@/constants/transaction'

// UI Components
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import Icon from '@/components/ui/Icon.vue'
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'

/**
 * Purchase Form Component
 *
 * Handles creation and editing of purchase transactions.
 * Supports creating from scratch or from purchase order.
 */

const router = useRouter()
const route = useRoute()
const productSearchRef = ref(null)
const { notify } = useNotification()

// Route params
const purchaseOrderId = ref(route.query.purchaseOrderId || null)
const fromPage = ref(route.query.from || null)

// Initialize store
const store = usePurchaseFormStore()
const {
  form,
  loading,
  isFormValid,
  showScanner,
  supplierSearch,
  productSearch,
  showSupplierResults,
  showProductResults,
  supplierLoading,
  productLoading,
  purchaseOrderData
} = storeToRefs(store)

// Computed properties
const pageTitle = computed(() =>
  purchaseOrderId.value ? 'Buat Pembelian dari PO' : 'Buat Pembelian'
)

const pageSubtitle = computed(() =>
  purchaseOrderId.value
    ? `Membuat transaksi pembelian dari PO #${purchaseOrderId.value}`
    : 'Buat transaksi pembelian baru'
)

// Methods
const handleSubmit = async () => {
  try {
    await store.submitForm()
    notify({
      title: 'Berhasil',
      message: 'Transaksi pembelian berhasil disimpan',
      type: 'success'
    })
    router.push('/transaksi/pembelian')
  } catch (error) {
    notify({
      title: 'Gagal',
      message: error.message || 'Terjadi kesalahan saat menyimpan transaksi',
      type: 'error'
    })
  }
}

const handleScanError = (error) => {
  notify({
    title: 'Scan Gagal',
    message: error.message || 'Gagal memindai barcode',
    type: 'error'
  })
}

// Lifecycle hooks
onMounted(() => {
  store.setFromPage(fromPage.value)

  if (purchaseOrderId.value) {
    store.setPurchaseOrderId(purchaseOrderId.value)
  }
})

// Watch for changes in purchaseOrderId
watch(() => route.query.purchaseOrderId, (newVal) => {
  if (newVal) {
    purchaseOrderId.value = newVal
    store.setPurchaseOrderId(newVal)
  }
}, { immediate: true })
</script>

<!-- Responsive styling for mobile -->
<style scoped>
@media (max-width: 768px) {
  table th, table td {
    width: auto !important;
  }

  table th:nth-child(1), table td:nth-child(1) {
    width: 40% !important;
  }

  table th:nth-child(2), table td:nth-child(2) {
    width: 25% !important;
  }

  table th:nth-child(3), table td:nth-child(3) {
    width: 15% !important;
  }

  table th:nth-child(4), table td:nth-child(4) {
    width: 20% !important;
  }
}
</style>
