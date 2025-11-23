<template>
  <div>
    <div v-if="data" class="profit-loss-report relative w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-2xl shadow-lg printable-area print-container">
      
      <div class="mb-8 text-center print-header">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white print-title">{{ header.title }}</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400 print-subtitle" v-html="header.periode" />
      </div>

      <div class="space-y-6">
        <!-- PENDAPATAN -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-3 section-title">Pendapatan</h3>
          <div class="space-y-2">
            <InfoRow label="Penjualan Tunai" :value="data.pendapatan.penjualan_tunai" />
            <InfoRow label="Penjualan Kredit" :value="data.pendapatan.penjualan_kredit" />
            <InfoRow label="Total Penjualan" :value="data.pendapatan.total_penjualan" class="font-semibold" />
            <InfoRow label="Retur Penjualan" :value="data.pendapatan.retur_penjualan" is-negative />
          </div>
          <div class="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 section-total">
            <InfoRow label="Pendapatan Bersih" :value="data.pendapatan.pendapatan_bersih" class="font-bold text-lg" value-class="text-green-600 dark:text-green-400 green" />
          </div>
        </div>

        <!-- HPP -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-3 section-title">Harga Pokok Penjualan (HPP)</h3>
           <div class="space-y-2">
            <InfoRow label="Total HPP" :value="data.hpp.hpp" is-negative />
          </div>
          <div class="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 section-total">
            <InfoRow label="Laba Kotor" :value="data.hpp.laba_kotor" class="font-bold text-lg" value-class="text-yellow-600 dark:text-yellow-400 yellow" />
          </div>
        </div>

        <!-- Biaya Operasional -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-1 mb-1 section-title">Biaya Operasional</h3>
          <div class="space-y-1">
            <InfoRow label="Total Biaya" :value="data.operasional.biaya_operasional" is-negative />
          </div>
        </div>

        <!-- LABA BERSIH -->
        <div class="mt-1 pt-1 border-t-4 border-double border-gray-300 dark:border-gray-600 final-total">
          <InfoRow label="Laba Bersih" :value="data.laba_bersih" class="font-extrabold text-xl" :value-class="data.laba_bersih >= 0 ? 'text-blue-600 dark:text-blue-400 blue' : 'text-red-600 dark:text-red-400'" />
        </div>
      </div>

    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package" />
    </div>
  </div>
</template>

<script setup>
import InfoRow from './InfoRow.vue'

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  params: {
    type: Object,
    default: null
  },
  header: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
/* Scoped styles are not applied in print iframe, but keeping them for consistency */
@media print {
  .printable-area {
    color: black !important;
    background: white !important;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
  .dark\:text-white { color: black !important; }
  .dark\:text-gray-200 { color: #374151 !important; }
  .dark\:text-gray-300 { color: #374151 !important; }
  .dark\:text-gray-400 { color: #6b7280 !important; }
  .dark\:border-gray-700 { border-color: #d1d5db !important; }
  .dark\:border-gray-600 { border-color: #d1d5db !important; }
}
</style>
