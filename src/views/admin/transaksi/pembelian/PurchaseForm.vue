<template>
  <BasePage title="Buat Pembelian" subtitle="Buat transaksi pembelian baru">
    <template #actions>
      <div class="flex space-x-2">
        <BaseButton
          @click="goBack"
          variant="secondary"
          size="md"
        >
          <template #icon-left>
            <Icon name="ArrowLeft" class="w-4 h-4" />
          </template>
          Kembali
        </BaseButton>
        <BaseButton
          @click="submitForm"
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Dasar</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Supplier Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
              <div v-if="purchaseOrderId">
                <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ form.supplier?.name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Dari Purchase Order</p>
                </div>
              </div>
              <div v-else>
                <div class="relative">
                  <BaseInput
                    v-model="supplierSearch"
                    placeholder="Cari supplier..."
                    @focus="showSupplierResults = true"
                  />
                  <div v-if="showSupplierResults && supplierSearch" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <SearchDropdown
                      v-model="supplierSearch"
                      api-url="/api/v1/suppliers"
                      :loading="supplierLoading"
                      @select="selectSupplier"
                      @items-loaded="onSuppliersLoaded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Date Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
              <BaseInput
                v-model="form.date"
                type="date"
              />
            </div>

            <!-- Invoice Number Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Invoice</label>
              <BaseInput
                v-model="form.invoice_number"
                placeholder="Nomor invoice"
              />
            </div>

            <!-- Purchase Order Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Order</label>
              <div v-if="purchaseOrderId">
                <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ purchaseOrderData?.order_number || purchaseOrderId }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">PO terkait</p>
                </div>
              </div>
              <div v-else>
                <BaseInput
                  placeholder="Tidak ada PO terkait"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Items Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Item Pembelian</h3>
            <div v-if="!purchaseOrderId" class="flex space-x-2">
              <BaseButton
                @click="openBarcodeScanner"
                variant="secondary"
                size="sm"
              >
                <template #icon-left>
                  <Icon name="Barcode" class="w-4 h-4" />
                </template>
                Scan Barcode
              </BaseButton>
              <div class="relative">
                <BaseInput
                  v-model="productSearch"
                  placeholder="Cari produk..."
                  @focus="showProductResults = true"
                  ref="productSearchRef"
                />
                <div v-if="showProductResults && productSearch" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  <SearchDropdown
                    v-model="productSearch"
                    api-url="/api/v1/products"
                    :loading="productLoading"
                    @select="addProductToOrder"
                    @items-loaded="onProductsLoaded"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produk</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Harga</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subtotal</th>
                  <th v-if="!purchaseOrderId" scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="form.items.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center py-6">
                      <Icon name="Package" class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                      <p>Belum ada item. {{ purchaseOrderId ? 'Memuat item dari PO...' : 'Tambahkan item terlebih dahulu.' }}</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="(item, index) in form.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product?.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap">
                    <BaseInput
                      v-model.number="item.price"
                      type="number"
                      class="w-24 text-right"
                      min="0"
                      @input="updateSubtotal(item)"
                    />
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap">
                    <BaseInput
                      v-model.number="item.quantity"
                      type="number"
                      class="w-20 text-right"
                      min="1"
                      @input="updateSubtotal(item)"
                    />
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal) }}
                  </td>
                  <td v-if="!purchaseOrderId" class="px-4 py-3 text-right whitespace-nowrap">
                    <button @click="removeItem(index)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <Icon name="Trash" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Total</td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal()) }}
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
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ calculateTotalQuantity() }}</span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal()) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Diskon</span>
              <div class="flex items-center">
                <BaseInput
                  v-model.number="form.discount"
                  type="number"
                  class="w-20 text-right"
                  min="0"
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
                />
                <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div class="flex justify-between items-center">
              <span class="text-base font-medium text-gray-900 dark:text-white">Total</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateGrandTotal()) }}</span>
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
          @scan-success="handleBarcodeScan"
          @scan-error="(error) => console.error('Scan error:', error)"
          @close="showScanner = false"
        />
      </template>
    </BaseDialog>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import Icon from '@/components/ui/Icon.vue'
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import { api } from '@/services/api'

const router = useRouter()
const route = useRoute()
const purchaseOrderId = ref(route.query.purchaseOrderId || null)
const fromPage = ref(route.query.from || null)
const purchaseOrderData = ref(null)

// Form state
const form = ref({
  supplier_id: null,
  supplier: null,
  date: new Date().toISOString().split('T')[0],
  invoice_number: '',
  purchase_order_id: purchaseOrderId.value,
  items: [],
  discount: 0,
  tax: 0,
  notes: '',
  status: 'pending'
})

// UI state
const loading = ref(false)
const supplierSearch = ref('')
const productSearch = ref('')
const productSearchRef = ref(null)
const showSupplierResults = ref(false)
const showProductResults = ref(false)
const filteredSuppliers = ref([])
const filteredProducts = ref([])
const showScanner = ref(false)
const supplierLoading = ref(false)
const productLoading = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.supplier_id && form.value.items.length > 0
})

// Methods
const calculateTotal = () => {
  return form.value.items.reduce((total, item) => total + (item.subtotal || 0), 0)
}

const calculateTotalQuantity = () => {
  return form.value.items.reduce((total, item) => total + (item.quantity || 0), 0)
}

const calculateGrandTotal = () => {
  const subtotal = calculateTotal()
  const discountAmount = form.value.discount || 0
  const taxAmount = subtotal * (form.value.tax / 100) || 0

  return subtotal - discountAmount + taxAmount
}

const updateSubtotal = (item) => {
  item.subtotal = (item.price || 0) * (item.quantity || 0)
}

const selectSupplier = (supplier) => {
  form.value.supplier_id = supplier.id
  form.value.supplier = supplier
  showSupplierResults.value = false
}

const addProductToOrder = (product) => {
  // Check if product already exists in items
  const existingItemIndex = form.value.items.findIndex(item => item.product_id === product.id)

  if (existingItemIndex !== -1) {
    // Increment quantity if product already exists
    form.value.items[existingItemIndex].quantity += 1
    updateSubtotal(form.value.items[existingItemIndex])
  } else {
    // Add new item if product doesn't exist
    const newItem = {
      product_id: product.id,
      product: product,
      price: product.purchase_price || 0,
      quantity: 1,
      subtotal: product.purchase_price || 0
    }

    form.value.items.push(newItem)
  }

  // Clear search
  productSearch.value = ''
  showProductResults.value = false
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const submitForm = async () => {
  if (!isFormValid.value) {
    alert('Silakan lengkapi form terlebih dahulu')
    return
  }

  loading.value = true

  try {
    // Prepare data for API
    const formData = {
      supplier_id: form.value.supplier_id,
      date: form.value.date,
      invoice_number: form.value.invoice_number,
      purchase_order_id: form.value.purchase_order_id,
      items: form.value.items.map(item => ({
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity
      })),
      discount: form.value.discount,
      tax: form.value.tax,
      notes: form.value.notes,
      status: form.value.status
    }

    // Send data to API
    const { data } = await api.post('/api/v1/purchases', formData)

    // Redirect to purchase list
    router.push('/transaksi/pembelian')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}

// Fetch purchase order data if ID is provided
const fetchPurchaseOrderData = async () => {
  if (!purchaseOrderId.value) return

  loading.value = true

  try {
    const { data } = await api.get(`/api/v1/purchase-orders/${purchaseOrderId.value}`)
    purchaseOrderData.value = data

    // Set supplier from purchase order
    form.value.supplier_id = data.supplier_id
    form.value.supplier = data.supplier

    // Set items from purchase order
    form.value.items = data.items.map(item => ({
      product_id: item.product_id,
      product: item.product,
      price: item.price,
      quantity: item.received_quantity || item.quantity,
      subtotal: (item.price * (item.received_quantity || item.quantity))
    }))
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    alert('Terjadi kesalahan saat memuat data purchase order. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}

// Barcode scanner
const openBarcodeScanner = () => {
  showScanner.value = true
}

const handleBarcodeScan = (barcode) => {
  showScanner.value = false
  productSearch.value = barcode

  // Fetch product by barcode
  api.get('/api/v1/products', {
    params: { barcode }
  }).then(({ data }) => {
    if (data.data && data.data.length > 0) {
      addProductToOrder(data.data[0])
    } else {
      alert(`Produk dengan barcode ${barcode} tidak ditemukan`)
    }
  }).catch(error => {
    console.error('Error fetching product by barcode:', error)
  })
}

// Event handlers
const onSuppliersLoaded = (suppliers) => {
  filteredSuppliers.value = suppliers
}

const onProductsLoaded = (products) => {
  filteredProducts.value = products
}

// Lifecycle hooks
onMounted(() => {
  if (purchaseOrderId.value) {
    fetchPurchaseOrderData()
  }
})

// Watch for changes in purchaseOrderId
watch(() => route.query.purchaseOrderId, (newVal) => {
  if (newVal) {
    purchaseOrderId.value = newVal
    fetchPurchaseOrderData()
  }
}, { immediate: true })

// Fungsi untuk kembali ke halaman sebelumnya
const goBack = () => {
  // Jika ada parameter from, gunakan itu untuk navigasi kembali
  if (fromPage.value === 'po-detail' && purchaseOrderId.value) {
    router.push(`/admin/transaksi/po`)
  }
  else if (fromPage.value === 'po-list') {
    router.push('/admin/transaksi/po')
  }
  // Default kembali ke daftar pembelian
  else {
    router.push('/admin/transaksi/pembelian')
  }
}
</script>
