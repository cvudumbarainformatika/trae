<template>
  <BasePage title="Penjualan" subtitle="Kelola transaksi penjualan ke customer">
    <template #actions>
      <BaseButton color="primary" @click="goToTambah">
        <template #icon-left>
          <Icon name="Plus" class="w-4 h-4" />
        </template>
        Tambah Penjualan
      </BaseButton>
      <BaseButton color="secondary" @click="goToKasir">
        <template #icon-left>
          <Icon name="LightningBolt" class="w-4 h-4" />
        </template>
        Penjualan Cepat
      </BaseButton>
    </template>

    <div class="flex items-center justify-between gap-2 w-full mb-4">
      <div class="relative rounded-full shadow-lg w-3/4">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="Search" class="w-5 h-5 text-indigo-400" />
        </div>
        <BaseInput
          v-model="params.q"
          placeholder="Cari penjualan..."
          type="text"
          clearable
          :debounce="500"
          @update:model-value="fetchSales"
        />
      </div>
      <!-- Filter Periode, jika diperlukan -->
      <!-- <BaseDateRangeFilter v-model="dateRange" @change="handleDateRangeChange" default-period="month" /> -->
    </div>
    <div class="flex flex-wrap gap-2 mb-4 mt-2">
      <BaseButton
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
        :class="{ 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700': params.status === 'semua' }"
        @click="params.status = 'semua'"
      >
        <span class="relative z-10">Semua</span>
        <span class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton
        @click="params.status = 'tunai'"
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300"
        :class="{ 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700': params.status === 'tunai' }"
      >
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
          Tunai
        </span>
        <span class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton
        @click="params.status = 'kredit'"
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
        :class="{ 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700': params.status === 'kredit' }"
      >
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Kredit
        </span>
        <span class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
    </div>
    <SalesTable :data="sales" />
  </BasePage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/transaksi/penjualan/index'
import SalesTable from './SalesTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePage from '@/components/ui/BasePage.vue'
import Icon from '@/components/ui/Icon.vue'

const router = useRouter()
const salesStore = useSalesStore()
const sales = ref([])
const params = ref({ q: '', status: 'semua' })

onMounted(async () => {
  await salesStore.fetchSales()
  sales.value = salesStore.sales
})

function fetchSales() {
  // TODO: fetch sales with params
}
function goToTambah() {
  router.push({ path: '/admin/transaksi/penjualan/tambah' })
}
function goToKasir() {
  router.push({ path: '/admin/transaksi/penjualan/kasir' })
}
</script>
