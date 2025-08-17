<template>
  <BaseDialog v-model="showDialog"
    :title="store.editMode ? `Edit Distribusi #${store.purchaseOrder?.reference_no}` : 'Distribusi Produk'"
    max-width="6xl" :is-edit-dialog="store.editMode" @close="handleClose">



    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">


      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="md:col-span-1 space-y-4">
          <!-- Header Section -->
          <div
            class="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
            <div class="space-y-1">
              <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400">
                {{ store.editMode ? 'Edit Distribusi Produk' : 'Distribusi Produk' }}
              </h2>
              <p class="text-secondary-500 dark:text-secondary-400 text-sm">
                {{ store.editMode ? 'Edit Distribusi Produk Anda Ke Toko'
                  : 'Distribusi Produk gudang Ke Toko' }}
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

          <div>
            <label for="out_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal <span class="text-red-500">*</span>
            </label>
            <BaseInput id="out_at" v-model="store.form.out_at" type="date" class="w-full" aria-required="true" />
          </div>

          <!-- Notes -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan
            </label>
            <textarea id="notes" v-model="store.form.notes" rows="3"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Tambahkan catatan jika diperlukan..."></textarea>
          </div>


        </div>

        <div class="md:col-span-2">
          <ProductList :items="store.form?.items" v-model:productSearch="productSearch" @add-product="addProductToOrder"
            @remove-item="removeItem" @update-quantity="updateItemQuantity" @update-price="updateItemPrice"
            @products-loaded="onProductsLoaded" @open-scanner="showScanner = true" @barcode-scan="handleBarcodeScan" />
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex justify-end gap-3 mt-4">
        <BaseButton variant="secondary" @click="handleClose">
          Batal
        </BaseButton>
        <BaseButton variant="primary" :loading="store.loadingSave" :disabled="!canSubmitForm" @click="submitForm">
          <Icon name="Save" class="w-4 h-4 mr-1" /> {{ store.editMode ? 'Simpan Perubahan' : 'Simpan Distribusi' }}
        </BaseButton>
      </div>
    </div>

  </BaseDialog>
</template>

<script setup>

import { ref, computed, onMounted, onUnmounted, watch, nextTick, defineAsyncComponent } from 'vue'
import { useDistributionGudangStore } from '@/stores/gudangs/distributions'
import { useNotification } from '@/composables/useNotification'


const ProductList = defineAsyncComponent(() => import('./ProductList.vue'))


const store = useDistributionGudangStore()

const emit = defineEmits(['close'])

const { notify } = useNotification()


const productSearch = ref('')
const showScanner = ref(false)



const canSubmitForm = computed(() => {
  return !!store.form.out_at && store.form.items.length > 0;
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

const handleClose = () => {
  if (store.editMode) {
    // Reset edit mode
    store.resetForm()
  }
  emit('close')
}



const onProductsLoaded = (products) => {
  // console.log('Products loaded:', products);

  // Jika hanya ada satu produk dan itu hasil dari scan barcode, tambahkan langsung
  // if (products.length === 1 && productSearch.value.length > 5) {
  //   addProductToOrder(products[0])
  // }
}

// Fungsi untuk menambahkan produk ke order
const addProductToOrder = (product) => {
  // console.log('addProductToOrder', product);

  store.addItem({
    product_id: product.id,
    product: product,
    qty: 1,
    price: product.hargabeli || 0
  })
  productSearch.value = ''
}

// Fungsi untuk menghapus item
const removeItem = (index) => {
  // console.log('removeItem', index);

  store.removeItem(index)
}

// Fungsi untuk mengupdate kuantitas item
const updateItemQuantity = ({ index, qty }) => {
  store.updateItemQuantity(index, qty)
}

// Fungsi untuk mengupdate harga item
const updateItemPrice = ({ index, price }) => {
  console.log('updateItemPrice', index, price);
  // store.form.items[index].price = price
  // store.form.items[index].total = price * store.form.items[index].quantity
}
const handleBarcodeScan = (barcode) => {
  productSearch.value = barcode
}


const submitForm = () => {
  // if (!canSubmitForm.value) {

  if (store.form.items.length === 0) {
    // alert('Silakan tambahkan minimal satu item')
    notify({
      title: 'Peringatan !',
      message: 'Silakan tambahkan minimal satu item',
      type: 'error'
    })
    return
  }
  //   return
  // }

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

</script>
