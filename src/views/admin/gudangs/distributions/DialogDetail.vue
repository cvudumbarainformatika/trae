<template>
  <BaseDialog title="Detail Distribusi Gudang Ke Toko" max-width="5xl" @close="closeDialog" @show="handleShow">
    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">


      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Penjualan Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <div class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Informasi Distribusi Gudang
          </div>
          <hr class="my-2" />
          <!-- <div class="text-secondary-900 dark:text-white font-small">
            {{ data?.customer_name || 'Penjualan Umum' }}
          </div> -->
          <!-- <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            Petugas : Masih Kosong
          </div> -->
          <div class="text-sm text-secondary-500 dark:text-secondary-400">
            Petugas : {{ data?.user_name || '-' }}
          </div>

          <div class="gap-2 text-sm">
            <div class="my-2">
              <div class="text-secondary-500 dark:text-gray-100">Referrence : </div>
              <div class="text-secondary-500 dark:text-gray-100">
                {{ data?.reference_no || '-' }}
              </div>
            </div>
            <div class="flex">
              <div class="text-secondary-500 dark:text-secondary-400">Tanggal Distribusi :</div>
              <div class="text-secondary-900 dark:text-white">{{ new
                Date(data?.out_at).toLocaleDateString()?.split('/')?.reverse()?.join('-') }}</div>
            </div>

          </div>

        </div>

        <!-- Order Info -->
        <!-- <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-secondary-500 dark:text-gray-100">Referrence : </div>
            <div class="text-secondary-500 dark:text-gray-100">
              {{ data?.reference_no || '-' }}
            </div>
            <div class="text-secondary-500 dark:text-secondary-400">Tanggal Distribusi :</div>
            <div class="text-secondary-900 dark:text-white">{{ new
              Date(data?.out_at).toLocaleDateString()?.split('/')?.reverse()?.join('-') }}</div>

          </div>
        </div> -->

        <!-- Items Table -->
        <div class="bg-white dark:bg-secondary-700 rounded-xl shadow-sm overflow-hidden col-span-2">
          <h3
            class="p-4 border-b border-secondary-200 dark:border-secondary-700 font-medium text-secondary-900 dark:text-white">
            Daftar Item Distribusi </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead class="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Produk</th>
                  <!-- <th
                  class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Harga</th> -->
                  <th
                    class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Jumlah</th>
                  <!-- <th
                  class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Subtotal</th> -->

                </tr>
              </thead>
              <tbody class="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                <tr v-for="(item, index) in data?.items" :key="index"
                  class="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name }}</div>
                    <div class="text-xs text-secondary-500 dark:text-secondary-400">{{ item.product?.barcode }}</div>
                  </td>
                  <!-- <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item?.harga) }}
                </td> -->
                  <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">{{ item?.qty }}
                    ({{ item?.product?.satuan?.name || '-' }})
                  </td>
                  <!-- <td class="px-4 py-3 text-right whitespace-nowrap font-medium text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item?.harga || 0) *
                    (item?.qty || 0)) }}
                </td> -->

                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>



    </div>



    <!-- Komponen Struk yang akan dicetak -->
    <!-- <StrukPenjualan v-model="printed" :data="data" /> -->
  </BaseDialog>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

// const StrukPenjualan = defineAsyncComponent(() => import('../compFormWithTabs/StrukPenjualan.vue'))

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const printed = ref(false)

const handleShow = () => {
  console.log('show');
  console.log('props', props.data);

}

const calculateTotal = (items) => {
  if (!items?.length) return 0

  return items.reduce((total, item) => {
    return total + ((item?.price || 0) * (item?.qty || 0))
  }, 0)
}


const closeDialog = () => {
  emit('close')
}

const printPenjualan = () => {
  console.log('print penjualan');
  printed.value = true
}

const printAndClose = () => {
  window.print()
  printed.value = false
}

</script>

<style scoped>
@media print {
  body * {
    visibility: hidden !important;
  }

  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    padding: 0 !important;
  }
}
</style>
