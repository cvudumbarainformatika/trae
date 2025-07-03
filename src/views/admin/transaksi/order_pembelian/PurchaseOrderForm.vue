<template>
  <div>
    <BaseDialog v-model="showDialog"
      :title="store.editMode ? `Edit Order Pembelian #${store.purchaseOrder?.unique_code}` : 'Order Pembelian Baru'"
      max-width="6xl" :is-edit-dialog="store.editMode" @close="closeDialog">
      <div
        class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
        <!-- Header Section -->
        <div
          class="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400">
              {{ store.editMode ? 'Edit Order Pembelian' : 'Order Pembelian Baru' }}
            </h2>
            <p class="text-secondary-500 dark:text-secondary-400 text-sm">
              {{ store.editMode ? 'Edit order pembelian untuk inventaris Anda'
                : 'Buat order pembelian baru untuk inventaris Anda' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="store.editMode" class="flex flex-col">
              <span class="text-xs text-secondary-500 dark:text-secondary-400 mb-2">Status</span>
              <span
                class="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs font-medium rounded-full">
                {{ store.form.status || 'Draft' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Kolom Kiri - Supplier (1/3 lebar) -->
          <div class="md:col-span-1 space-y-4">
            <SupplierSelection v-model:supplierId="store.form.supplier_id" v-model:supplierSearch="supplierSearch"
              v-model:date="store.form.date" v-model:dueDate="store.form.due_date" :status="store.form.status"
              :suppliers="store.suppliers" :supplier="store.form.supplier" @add-supplier="openAddSupplierDialog"
              @suppliers-loaded="onSuppliersLoaded" />
          </div>

          <!-- Kolom Kanan - Items (2/3 lebar) -->
          <div class="md:col-span-2">
            <ProductList :items="store.form.items" v-model:productSearch="productSearch"
              @add-product="addProductToOrder" @remove-item="removeItem" @update-quantity="updateItemQuantity"
              @update-price="updateItemPrice" @products-loaded="onProductsLoaded" @open-scanner="showScanner = true"
              @barcode-scan="handleBarcodeScan" />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="secondary" @click="handleClose">
            Batal
          </BaseButton>
          <BaseButton variant="primary" :loading="store.loading" :disabled="!canSubmitForm" @click="submitForm">
            <Icon name="Save" class="w-4 h-4 mr-1" /> {{ store.editMode ? 'Simpan Perubahan' : 'Simpan Order' }}
          </BaseButton>
        </div>
      </div>
    </BaseDialog>
    <SupplierForm v-if="showSupplierForm" v-model="showSupplierForm" :supplier="null" :is-edit="false"
      @close="supplierStore.setShowSupplierForm(false)" @submit="handleSupplierSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, defineAsyncComponent } from 'vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'
import SupplierForm from '@/components/admin/suppliers/SupplierForm.vue'
import { useSupplierStore } from '@/stores/admin/supplier'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useNotification } from '@/composables/useNotification'


const SupplierSelection = defineAsyncComponent(() => import('@/components/admin/transaksi/order_pembelian/SupplierSelection.vue'))
const ProductList = defineAsyncComponent(() => import('@/components/admin/transaksi/order_pembelian/ProductList.vue'))

// Props & emits
const emit = defineEmits(['update:modelValue', 'success', 'close', 'loading'])


const { notify } = useNotification()


// Store
const store = usePurchaseOrderStore()
const supplierStore = useSupplierStore()
const router = useRouter()

// State
const supplierSearch = ref('')
const productSearch = ref('')
const showSupplierResults = ref(false)
const showProductResults = ref(false)
const filteredSuppliers = ref([])
const filteredProducts = ref([])
let autosaveTimer = null
const AUTOSAVE_DELAY = 30000 // 30 detik
const showScanner = ref(false)
const supplierLoading = ref(false)
const productLoading = ref(false)

// Computed
const showSupplierForm = computed({
  get: () => supplierStore.showSupplierForm,
  set: (value) => supplierStore.setShowSupplierForm(value)
})

const showDialog = computed({
  get: () => store.showCreateDialog,
  set: (value) => {
    store.showCreateDialog = value
    if (!value) {
      handleClose()
    }
  }
})

const canSaveDraft = computed(() =>
  store.form.supplier_id && store.form.items.length > 0
)

const selectedSupplierDetails = computed(() =>
  store.suppliers.find(s => s.id === store.form.supplier_id) || null
)

const isFormValid = computed(() =>
  store.form.supplier_id &&
  store.form.items.length > 0
)

const canSubmitForm = computed(() => {
  return !!store.form.supplier_id && store.form.items.length > 0;
})

// Methods
const handleClose = () => {
  if (store.editMode) {
    // Reset edit mode
    store.resetForm()
  }
  emit('close')
}

const closeDialog = handleClose

const openAddSupplierDialog = () => {
  showSupplierForm.value = true
  showSupplierResults.value = false
}

const handleSupplierSubmit = async (formData) => {
  try {
    const newSupplier = await supplierStore.addSupplier(formData)
    showSupplierForm.value = false

    // Otomatis pilih supplier yang baru ditambahkan
    if (newSupplier?.id) {
      store.form.supplier_id = newSupplier.id
    }
  } catch (error) {
    console.error('Error adding supplier:', error)
    notify({
      title: 'Gagal',
      message: 'Gagal Saat menambahkan supplier',
      type: 'error'
    })
  }
}

// Fungsi untuk menangani hasil scan barcode
const handleBarcodeScan = (barcode) => {
  productSearch.value = barcode
}

// Handler untuk event items-loaded
const onSuppliersLoaded = (suppliers) => {
  filteredSuppliers.value = suppliers
}

const onProductsLoaded = (products) => {
  // Jika hanya ada satu produk dan itu hasil dari scan barcode, tambahkan langsung
  if (products.length === 1 && productSearch.value.length > 5) {
    addProductToOrder(products[0])
  }
}

// Fungsi untuk menambahkan produk ke order
const addProductToOrder = (product) => {
  store.addItem({
    product_id: product.id,
    product: product,
    quantity: 1,
    price: product.hargabeli || 0
  })
  productSearch.value = ''
}

// Fungsi untuk menghapus item
const removeItem = (index) => {
  store.removeItem(index)
}

// Fungsi untuk mengupdate kuantitas item
const updateItemQuantity = ({ index, quantity }) => {
  store.updateItemQuantity(index, quantity)
}

// Fungsi untuk mengupdate harga item
const updateItemPrice = ({ index, price }) => {
  store.form.items[index].price = price
  store.form.items[index].total = price * store.form.items[index].quantity
}

const formatNumber = (value) =>
  new Intl.NumberFormat('id-ID').format(value)

const submitForm = () => {
  if (!isFormValid.value) {
    if (!store.form.supplier_id) {
      // alert('Silakan pilih supplier terlebih dahulu')
      notify({
        title: 'Peringatan !',
        message: 'Silakan pilih supplier terlebih dahulu',
        type: 'error'
      })
      return
    }
    if (store.form.items.length === 0) {
      // alert('Silakan tambahkan minimal satu item')
      notify({
        title: 'Peringatan !',
        message: 'Silakan tambahkan minimal satu item',
        type: 'error'
      })
      return
    }
    return
  }

  store.submitForm()
    .then(() => {
      // console.log('Form submitted successfully')
      emit('success')
      // alert('Order berhasil disimpan')
      notify({
        title: 'Berhasil',
        message: 'Order berhasil disimpan',
        type: 'success'
      })
    })
    .catch(error => {
      console.error('Error submitting form:', error)
      // alert('Terjadi kesalahan saat menyimpan order. Silakan coba lagi.')
      notify({
        title: 'Gagal',
        message: 'Gagal saat menyimpan order. Silakan coba lagi.',
        type: 'error'
      })
    })
}

// Watchers
watch(supplierSearch, (newVal) => {
  if (!newVal) showSupplierResults.value = false
})

watch(productSearch, (newVal) => {
  if (!newVal) showProductResults.value = false
})

// Fungsi untuk memuat supplier
const loadSuppliers = async () => {
  try {
    supplierLoading.value = true
    // Gunakan fungsi fetchSuppliers dari store jika tersedia
    if (typeof store.fetchSuppliers === 'function') {
      await store.fetchSuppliers()
    } else {
      // Fallback ke API call langsung
      const response = await api.get('/api/v1/suppliers')
      if (response.data && Array.isArray(response.data.data)) {
        store.suppliers = response.data.data
      }
    }
  } catch (error) {
    console.error('Error loading suppliers:', error)
  } finally {
    supplierLoading.value = false
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Load suppliers when component mounts
  await loadSuppliers()

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-dropdown')) {
      // Close dropdowns if needed
    }
  })

  // Log untuk debugging
  // console.log('PurchaseOrderForm mounted, editMode:', store.editMode)
  // console.log('Supplier ID:', store.form.supplier_id)
  // console.log('Available suppliers:', store.suppliers)
})

onUnmounted(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  document.removeEventListener('click', () => { })
})

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sembunyikan tombol default increment/decrement pada input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  /* Firefox */
}
</style>
