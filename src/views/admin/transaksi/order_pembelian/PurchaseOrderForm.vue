<template>
  <div>
    <BaseDialog
      v-model="showDialog"
      title="Order Pembelian Baru"
      max-width="6xl"
      @close="closeDialog"
    >
      <div class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400">Order Pembelian Baru</h2>
            <p class="text-secondary-500 dark:text-secondary-400 text-sm">Buat order pembelian baru untuk inventaris Anda</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex flex-col">
              <span class="text-xs text-secondary-500 dark:text-secondary-400 mb-2">Nomor PO</span>
              <span class="px-3 py-1 bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-100 text-sm font-medium rounded-md">
                Otomatis
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-secondary-500 dark:text-secondary-400 mb-2">Status</span>
              <span class="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs font-medium rounded-full">Draft</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Kolom Kiri - Supplier (1/3 lebar) -->
          <div class="md:col-span-1 space-y-4">
            <!-- Supplier Search Card -->
            <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
              <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
                <Icon name="User" class="mr-2 text-primary-500" /> Informasi Supplier
              </h3>

              <!-- Supplier Search -->
              <div class="relative mb-4">
                <SearchDropdown
                  v-model="supplierSearch"
                  placeholder="Cari supplier..."
                  :debounce="300"
                  :min-search-length="3"
                  item-key="id"
                  item-label="name"
                  not-found-text="Supplier tidak ditemukan"
                  not-found-subtext="Coba kata kunci lain atau tambahkan supplier baru"
                  add-button-text="Tambah Supplier Baru"
                  api-url="/api/v1/suppliers"
                  api-response-path="data.data"
                  :use-api="true"
                  @select="selectSupplier"
                  @add-new="openAddSupplierDialog"
                  @items-loaded="onSuppliersLoaded"
                >
                  <template #item="{ item }">
                    <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                      <Icon name="Phone" class="w-4 h-4" /> {{ item.phone || 'Tidak ada telepon' }}
                      <span class="mx-1">•</span>
                      <Icon name="Mail" class="w-4 h-4" /> {{ item.email || 'Tidak ada email' }}
                    </div>
                  </template>
                </SearchDropdown>
              </div>

              <!-- Selected Supplier Card -->
              <!-- <div v-if="store.form.supplier_id"
                   class="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-secondary-900 dark:text-white">
                      {{ selectedSupplierDetails?.name }}
                    </div>
                    <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                      {{ selectedSupplierDetails?.address || 'Tidak ada alamat' }}
                    </div>
                  </div>
                  <button @click="clearSelectedSupplier"
                          class="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div> -->
            </div>

            <!-- Ganti Dates Card dengan Supplier Info Card saat draft -->
            <div v-if="store.form.supplier_id && store.form.status === 'draft'"
                 class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
              <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
                <Icon name="User" class="mr-2 text-primary-500" /> Detail Supplier
              </h3>

              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-sm text-secondary-500 dark:text-secondary-400">Perusahaan</span>
                  <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.name }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-sm text-secondary-500 dark:text-secondary-400">Kontak</span>
                  <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.phone || 'Tidak ada telepon' }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-sm text-secondary-500 dark:text-secondary-400">Email</span>
                  <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.email || 'Tidak ada email' }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-sm text-secondary-500 dark:text-secondary-400">Alamat</span>
                  <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.address || 'Tidak ada alamat' }}</span>
                </div>
              </div>
            </div>

            <!-- Tampilkan placeholder card jika belum ada supplier -->
            <div v-if="!store.form.supplier_id && store.form.status === 'draft'"
                 class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
              <div class="flex flex-col items-center justify-center py-6 text-center">
                <Icon name="UserSearch" class="w-12 h-12 text-primary-400 mb-3" />
                <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">Belum Ada Supplier</h3>
                <p class="text-secondary-500 dark:text-secondary-400 text-sm max-w-md">
                  Silakan cari dan pilih supplier di atas untuk melanjutkan order pembelian Anda
                </p>
              </div>
            </div>

            <!-- Tampilkan Order Dates jika status bukan draft -->
            <div v-if="store.form.status !== 'draft'"
                 class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
              <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
                <i class="ri-calendar-line mr-2 text-primary-500"></i> Tanggal Order
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseDatePicker
                  v-model="store.form.date"
                  label="Tanggal Order"
                  required
                />

                <BaseDatePicker
                  v-model="store.form.due_date"
                  label="Jatuh Tempo"
                  required
                  :min="store.form.date"
                />
              </div>
            </div>
          </div>

          <!-- Kolom Kanan - Items (2/3 lebar) -->
          <div class="md:col-span-2">
            <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 h-full transition-all duration-300 hover:shadow-md">
              <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center justify-between">
                <span class="flex items-center">
                  <Icon name="ShoppingBasket" class="mr-2 text-primary-500" /> Item Order
                </span>
                <span class="text-sm font-normal text-secondary-500 dark:text-secondary-400">
                  {{ store.form.items.length }} item
                </span>
              </h3>

              <!-- Product Search -->
              <div class="relative mb-4">
                <div class="flex gap-2">
                  <div class="flex-1">
                    <SearchDropdown
                      v-model="productSearch"
                      ref="productSearchRef"
                      placeholder="Cari produk untuk ditambahkan..."
                      :debounce="300"
                      :min-search-length="3"
                      item-key="id"
                      item-label="name"
                      not-found-text="Produk tidak ditemukan"
                      not-found-subtext="Coba kata kunci lain atau tambahkan produk baru"
                      add-button-text="Tambah Produk Baru"
                      api-url="/api/v1/products/search"
                      api-response-path="data.data"
                      :api-params="{ per_page: 10 }"
                      :use-api="true"
                      @select="addProductToOrder"
                      @items-loaded="onProductsLoaded"
                    >
                      <template #item="{ item }">
                        <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                        <div class="flex justify-between text-sm">
                          <span class="text-secondary-500 dark:text-secondary-400">{{ item.barcode || 'Tidak ada barcode' }}</span>
                          <span class="font-medium text-primary-600 dark:text-primary-400">Rp {{ formatNumber(item.hargabeli) }}</span>
                        </div>
                      </template>
                    </SearchDropdown>
                  </div>

                  <!-- Barcode Scanner Button -->
                  <button
                    @click="openBarcodeScanner"
                    class="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
                    title="Scan Barcode"
                  >
                    <Icon name="Scan" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Barcode Scanner Component -->
              <BarcodeScanner
                v-if="showScanner"
                @scan-success="handleBarcodeScan"
                @scan-error="showScanner = false"
                @close="showScanner = false"
              />

              <!-- Selected Products List -->
              <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                <!-- Tampilan saat tidak ada item yang dipilih -->
                <div v-if="store.form.items.length === 0" class="text-center py-12 text-secondary-400 dark:text-secondary-500 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border-2 border-dashed border-secondary-200 dark:border-secondary-700">
                  <Icon name="ShoppingBasket" class="w-16 h-16 mb-3 mx-auto" />
                  <h3 class="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">Belum Ada Item</h3>
                  <p class="text-sm max-w-md mx-auto">
                    Cari dan tambahkan produk ke order pembelian Anda menggunakan kotak pencarian di atas
                  </p>
                  <!-- <div class="mt-4">
                    <button @click="focusProductSearch" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium flex items-center gap-1 mx-auto">
                      <i class="ri-add-line"></i> Tambah Produk
                    </button>
                  </div> -->
                </div>

                <div v-for="(item, index) in store.form.items" :key="index"
                     class="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
                  <!-- Header: Product name, barcode, and delete button -->
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name || 'Tidak ada nama produk' }}</div>
                      <div class="text-xs text-secondary-500 dark:text-secondary-400">
                        {{ item.product?.barcode || 'Tidak ada barcode' }}
                      </div>
                    </div>

                    <button @click="removeItem(index)"
                            class="text-red-500 hover:text-red-600 dark:hover:text-red-400 ml-2">
                      <Icon name="Trash" class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Price and quantity controls in one row -->
                  <div class="flex justify-between items-center mt-1">
                    <div class="flex items-center gap-2">
                      <div class="relative">
                        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-secondary-500 dark:text-secondary-400">Rp</span>
                        <input
                          v-model.number="item.price"
                          type="number"
                          min="0"
                          @input="updateItemTotal(index)"
                          class="w-36 h-7 pl-7 text-sm rounded-l border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-primary-500 text-secondary-900 dark:text-white"
                        />
                      </div>
                      <span class="text-xs text-secondary-500 dark:text-secondary-400">×</span>
                      <div class="flex items-center">
                        <button @click="decrementQuantity(index)"
                                class="w-6 h-6 flex items-center justify-center rounded-l-md bg-secondary-200 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors">
                          <Icon name="Minus" class="w-3 h-3" />
                        </button>
                        <input v-model.number="item.quantity" type="number" min="1"
                               class="w-14 h-6 text-center text-xs border-y border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-primary-500 text-secondary-900 dark:text-white" />
                        <button @click="incrementQuantity(index)"
                                class="w-6 h-6 flex items-center justify-center rounded-r-md bg-secondary-200 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors">
                          <Icon name="Plus" class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div class="font-medium text-primary-600 dark:text-primary-400 text-sm">
                      Rp {{ formatNumber(item.price * item.quantity) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div class="flex justify-between items-center font-medium text-lg">
                  <span class="text-secondary-900 dark:text-white">Total</span>
                  <span class="text-primary-600 dark:text-primary-400">Rp {{ formatNumber(calculateTotal()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="secondary" @click="handleClose">
            Batal
          </BaseButton>
          <BaseButton
            variant="primary"
            :disabled="!canSubmitForm"
            @click="submitForm"
          >
            <Icon name="Save" class="w-4 h-4 mr-1" /> Simpan Order
          </BaseButton>
        </div>
      </div>
    </BaseDialog>
    <SupplierForm
      v-if="showSupplierForm"
      v-model="showSupplierForm"
      :supplier="null"
      :is-edit="false"
      @close="supplierStore.setShowSupplierForm(false)"
      @submit="handleSupplierSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'
import SupplierForm from '@/components/admin/suppliers/SupplierForm.vue'
import { useSupplierStore } from '@/stores/admin/supplier'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'

// Props & emits
const emit = defineEmits(['update:modelValue', 'success'])

// Store
const store = usePurchaseOrderStore()
const supplierStore = useSupplierStore()

// State
const supplierSearch = ref('')
const productSearch = ref('')
const productSearchRef = ref(null)
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
    // Prevent recursion if value hasn't changed
    if (value === store.showCreateDialog) return

    if (!value) {
      handleCloseWithoutSettingDialog()
    } else {
      store.showCreateDialog = value
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
  store.form.date &&
  store.form.due_date &&
  store.form.items.length > 0
)

const canSubmitForm = computed(() => {
  // Untuk debugging
  console.log('canSubmitForm check:', {
    supplier_id: !!store.form.supplier_id,
    items_length: store.form.items.length > 0,
    date: !!store.form.date,
    due_date: !!store.form.due_date
  });

  // Validasi minimal: harus ada supplier dan minimal satu item
  return !!store.form.supplier_id && store.form.items.length > 0;
})

// Methods
const handleCloseWithoutSettingDialog = async () => {
  if (canSaveDraft.value) {
    try {
      store.form.status = 'draft'
      await store.saveDraft()
      emit('success')
    } catch (error) {
      console.error('Error auto-saving draft:', error)
    }
  }

  // Update store directly, not through computed
  store.showCreateDialog = false
}

const handleClose = () => {
  showDialog.value = false
}

const closeDialog = handleClose




const selectSupplier = (supplier) => {
  store.form.supplier_id = supplier.id
  supplierSearch.value = ''
}

const clearSelectedSupplier = () => {
  store.form.supplier_id = null
}


const addProductToOrder = (product) => {
  // Panggil fungsi addItem di store dengan produk yang dipilih
  store.addItem({
    product_id: product.id,
    product: product,
    quantity: 1,
    price: product.hargabeli || 0
  });

  // Reset pencarian
  productSearch.value = '';
}

const incrementQuantity = (index) => {
  const currentQuantity = store.form.items[index].quantity;
  store.updateItemQuantity(index, currentQuantity + 1);
}

const decrementQuantity = (index) => {
  const currentQuantity = store.form.items[index].quantity;
  if (currentQuantity > 1) {
    store.updateItemQuantity(index, currentQuantity - 1);
  }
}

const removeItem = (index) => {
  store.removeItem(index)
}

const calculateTotal = () =>
  store.form.items.reduce((total, item) =>
    total + (item.price * item.quantity), 0)

const formatNumber = (value) =>
  new Intl.NumberFormat('id-ID').format(value)

const submitForm = () => {
  // Tambahkan log untuk debugging
  console.log('Submit form triggered', store.form);

  // Tambahkan validasi sebelum submit
  if (!isFormValid.value) {
    // Tampilkan pesan error jika perlu
    if (!store.form.supplier_id) {
      alert('Silakan pilih supplier terlebih dahulu');
      return;
    }
    if (store.form.items.length === 0) {
      alert('Silakan tambahkan minimal satu item');
      return;
    }


    return;
  }

  // Set status to 'ordered' when submitting
  // store.form.status = 'ordered';

  store.submitForm()
    .then(() => {
      console.log('Form submitted successfully');
      emit('success');
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan order. Silakan coba lagi.');
    });
}

const closeDropdowns = (e) => {
  if (!e.target.closest('.search-dropdown')) {
    productSearchRef.value?.closeDropdown()
  }
}

const focusProductSearch = () => {
  nextTick(() => productSearchRef.value?.focus())
}

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
      selectSupplier(newSupplier)
    }
  } catch (error) {
    console.error('Error adding supplier:', error)
  }
}

// Fungsi untuk navigasi ke halaman produk

// Inisialisasi router
const router = useRouter()

// Fungsi untuk membuka barcode scanner
const openBarcodeScanner = () => {
  showScanner.value = true
}

// Fungsi untuk menangani hasil scan barcode
const handleBarcodeScan = (barcode) => {
  showScanner.value = false;
  productSearch.value = barcode;

  // Gunakan ref untuk memanggil metode fetchFromApi pada komponen SearchDropdown
  if (productSearchRef.value) {
    productSearchRef.value.fetchFromApi(barcode);
  }
}

// Handler untuk event items-loaded
const onSuppliersLoaded = (suppliers) => {
  filteredSuppliers.value = suppliers
}

const onProductsLoaded = (products) => {
  // Jika hanya ada satu produk dan itu hasil dari scan barcode, tambahkan langsung
  if (products.length === 1 && productSearch.value.length > 5) {
    addProductToOrder(products[0]);
  }
}

const updateItemTotal = (index) => {
  const item = store.form.items[index];
  item.total = item.quantity * item.price;
}

// Watchers


watch(supplierSearch, (newVal) => {
  if (!newVal) showSupplierResults.value = false
})

watch(productSearch, (newVal) => {
  if (!newVal) showProductResults.value = false
})

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  document.removeEventListener('click', closeDropdowns)
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
  -moz-appearance: textfield; /* Firefox */
}
</style>
