<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'

import { useThemeStore } from '../../stores/theme'
import { formatRupiah } from '../../utils/uangHelper'
import { formatWaktuLalu } from '../../utils/dateHelper'

import { useDashboardStore } from '../../stores/dashboard'

const LineCart = defineAsyncComponent(() =>
  import('@/components/chart/LineCart.vue')
)
const BarChart = defineAsyncComponent(() =>
  import('@/components/chart/BarCart.vue')
)

const DoughnutCart = defineAsyncComponent(() =>
  import('@/components/chart/DoughnutCart.vue')
)

const store = useDashboardStore()

const themeStore = useThemeStore()

const stats = computed(() => {
  return [
    { title: 'Total Penjualan', value: formatRupiah(store.penjualan?.total_today), change: '+' + store.penjualan?.growth + '%', trend: store.penjualan?.growth > 0 ? 'up' : 'down' },
    { title: 'Trans Penjualan', value: formatRupiah(store.penjualan?.transaksi_today), change: '+' + store.penjualan?.growthTransaksi + '%', trend: store.penjualan?.growth > 0 ? 'up' : 'down' },
    { title: 'Total Pembelian', value: formatRupiah(store.pembelian?.total_today), change: '+' + store.pembelian?.growth + '%', trend: store.pembelian?.growth_status },
    { title: 'Trans Pembelian', value: formatRupiah(store.pembelian?.transaksi_today), change: '+' + store.pembelian?.growth_transaksi + '%', trend: store.pembelian?.growth_transaksi_status },
  ]
})

const bgClasses = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500'
]


const randomIndex = ref(0)

onMounted(() => {



  Promise.all([
    store.fetchPenjualan(),
    store.fetchPembelian(),
    store.fetchActivity(),
    store.fetchCartPenjualan(),
    store.fetchCartPembelian(),
    store.fetchTopProductSales()
      .then(() => {
        // console.log('fetch done');
        topProductsData.value.labels = store.topProductSales?.map(p => p?.name)
        topProductsData.value.datasets[0].data = store.topProductSales?.map(p => p?.total_qty)
        // console.log('topProductsData', topProductsData.value);


        const top5 = store?.topProductSales?.slice(0, 5) || [] // 🔥 ambil hanya 5 pertama
        doughnutData.value.labels = top5?.map(p => p?.name)
        doughnutData.value.datasets[0].data = top5?.map(p => p?.total_qty)

      })
    ,
    store.fetchSalesDaily(),
    store.fetchPurchasesWeekly()
  ])


  const index = Math.floor(Math.random() * bgClasses.length)

  randomIndex.value = index
})

const chartData = computed(() => {
  const labels = store?.cartPenjualan?.labels || []
  // console.log('labels', labels);

  const data = store?.cartPenjualan?.datasets[0]?.data || []

  return {
    labels,
    datasets: [
      {
        label: store?.cartPenjualan?.datasets[0]?.label || 'Penjualan',
        data,
        borderColor: '#3B82F6',
        tension: 0.3,
        fill: false
      }
    ]
  }
})

const chartDataPembelian = computed(() => {
  const labels = store?.cartPembelian?.labels || []
  // console.log('labels', labels);

  const data = store?.cartPembelian?.datasets[0]?.data || []

  return {
    labels,
    datasets: [
      {
        label: store?.cartPembelian?.datasets[0]?.label || 'Pembelian',
        data,
        borderColor: 'oklch(70.5% 0.213 47.604)',
        tension: 0.3,
        fill: false
      }
    ]
  }
})


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Grafik Penjualan'
    }
  }
}


const chartPembelianOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Grafik Pembelian'
    }
  }
}


const topProductsData = ref({
  labels: [],
  datasets: [
    {
      label: 'Jumlah Terjual',
      data: [],
      backgroundColor: [
        '#3b82f6', // biru
        '#22c55e', // hijau
        '#ef4444', // merah
        '#f59e0b', // kuning
        '#8b5cf6', // ungu
        '#14b8a6',  // teal
        'oklch(55.4% 0.046 257.417)',  // gray
        'oklch(55.4% 0.046 257.417)',  // gray
        'oklch(55.4% 0.046 257.417)',  // gray
        'oklch(55.4% 0.046 257.417)',  // gray
      ],
    }
  ]
})

const doughnutData = ref({
  labels: [],
  datasets: [
    {
      label: 'Penjualan',
      data: [],
      backgroundColor: [
        '#3b82f6', // biru
        '#22c55e', // hijau
        '#ef4444', // merah
        '#f59e0b', // kuning
        '#8b5cf6', // ungu
        '#14b8a6'  // teal
      ],
      borderWidth: 1
    }
  ]
})


</script>

<template>
  <div class="flex flex-col h-full space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <BaseButton @click="themeStore.toggleTheme()"
        class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        {{ themeStore.isDark ? '🌞 Light' : '🌙 Dark' }}
      </BaseButton>
    </div>

    <div class="flex-1 h-full space-y-6 overflow-y-auto">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="(stat, index) in stats" :key="index">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</h3>
          <div class="mt-2 flex items-baseline">
            <span class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</span>
            <span class="ml-2 text-sm font-medium" :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'">
              {{ stat.change }}
            </span>
          </div>
        </Card>
      </div>



      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Grafik Penjualan per Bulan">
          <div class="h-80">

            <div v-if="chartData?.labels?.length">
              <LineCart :chart-data="chartData" :chart-options="chartOptions" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data grafik untuk ditampilkan
            </div>
          </div>
        </Card>
        <Card title="Grafik Pembelian per Bulan">
          <div class="h-80">

            <div v-if="chartDataPembelian?.labels?.length">
              <LineCart :chart-data="chartDataPembelian" :chart-options="chartPembelianOptions" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data grafik untuk ditampilkan
            </div>
          </div>
        </Card>


      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Activity -->
        <Card class="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="item in store.activity" :key="item.id" class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white"
                  :class="[bgClasses[Math.floor(Math.random() * store.activity.length)]]">
                  {{ item?.user?.name?.charAt(0) || 'A' }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item?.user?.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item?.action }} <i class="text-gray-600">({{
                  formatWaktuLalu(item?.created_at) }}) </i></p>
              </div>
            </div>


          </div>
        </Card>


        <Card title="Top 10 Products Terlaris Bulan Ini">
          <div class="h-96">

            <div v-if="topProductsData?.labels?.length">
              <BarChart :chart-data="topProductsData" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data untuk ditampilkan
            </div>
          </div>
        </Card>

        <Card title="Top 5 Products Terlaris Bulan Ini">
          <div class="h-96">

            <div v-if="doughnutData?.labels?.length">
              <DoughnutCart :chart-data="doughnutData" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data untuk ditampilkan
            </div>
          </div>
        </Card>

      </div>


      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Grafik Penjualan Harian (12 Hari terakhir)">
          <div class="h-80">

            <div v-if="store.datasetSalesDaily?.labels?.length">
              <LineCart :chart-data="store.datasetSalesDaily" :chart-options="chartOptions" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data grafik untuk ditampilkan
            </div>
          </div>
        </Card>

        <Card title="Grafik Pembelian Harian (12 Hari terakhir)">
          <div class="h-80">

            <div v-if="store.datasetPurchasesWeekly?.labels?.length">
              <LineCart :chart-data="store.datasetPurchasesWeekly" :chart-options="chartPembelianOptions" />
            </div>
            <div v-else class="text-center text-gray-400 text-sm py-8">
              Belum ada data grafik untuk ditampilkan
            </div>
          </div>
        </Card>


      </div>

    </div>
  </div>
</template>
