<template>
  <BaseDialog title="Detail Return Pembelian" max-width="5xl" @close="closeDialog" @show="handleShow">
    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">


      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Penjualan Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Informasi Supplier & Admin
          </h3>
          <div class="text-secondary-900 dark:text-white font-small">
            {{ data?.supplier_name || '-' }}
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            Kasir : Masih Kosong
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400">
            Petugas : {{ data?.user_name || '-' }}
          </div>
        </div>

        <!-- Order Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Informasi Return Pembelian
          </h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-secondary-500 dark:text-secondary-400">Nota Pembelian : </div>
            <div>
              {{ data?.nota }}
            </div>
            <div class="text-secondary-500 dark:text-secondary-400">Tanggal Return Pembelian:</div>
            <div class="text-secondary-900 dark:text-white">{{ new
              Date(data?.created_at).toLocaleDateString()?.split('/')?.reverse()?.join('-') }}</div>
            <div class="text-secondary-500 dark:text-secondary-400">Tanggal Harga Retur:</div>
            <div class="text-secondary-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency:
                'IDR'
            }).format(data?.total || 0) }}</div>
          </div>
        </div>


        <!-- Summary -->
        <!-- <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Ringkasan Penjualan</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-secondary-500 dark:text-secondary-400">Total Nilai:</div>
            <div class="font-medium text-secondary-900 dark:text-white">
              {{ new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR'
              }).format(calculateTotal(data?.items)) }}
            </div>
            <div class="text-secondary-500 dark:text-secondary-400">Discount:</div>
            <div class="text-secondary-900 dark:text-white">{{ data?.discount || 0 }}</div>
            <div class="text-secondary-500 dark:text-secondary-400">Ppn:</div>
            <div class="text-secondary-900 dark:text-white">{{ data?.tax || 0 }}</div>
            <div class="text-secondary-500 dark:text-secondary-400">Bayar:</div>
            <div class="text-secondary-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency:
                'IDR'
            }).format(data?.bayar || 0) }}</div>
            <div class="text-secondary-500 dark:text-secondary-400">Kembail:</div>
            <div class="text-secondary-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency:
                'IDR'
            }).format(data?.kembali || 0) }}</div>

          </div>
        </div> -->
      </div>

      <!-- Items Table -->
      <div class="bg-white dark:bg-secondary-900 rounded-xl shadow-sm overflow-hidden">
        <h3
          class="p-4 border-b border-secondary-200 dark:border-secondary-700 font-medium text-secondary-900 dark:text-white">
          Daftar Item Return Pembelian </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead class="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Produk</th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Harga</th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Jumlah</th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Subtotal</th>

              </tr>
            </thead>
            <tbody class="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
              <tr v-for="(item, index) in data?.items" :key="index"
                class="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name }}</div>
                  <div class="text-xs text-secondary-500 dark:text-secondary-400">{{ item.product?.barcode }}</div>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item?.harga) }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">{{ item?.qty }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap font-medium text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item?.harga || 0) *
                    (item?.qty || 0)) }}
                </td>

              </tr>
            </tbody>
          </table>
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
