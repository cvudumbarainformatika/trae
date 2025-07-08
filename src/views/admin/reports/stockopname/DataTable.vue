<template>
  <div>
    <div v-if="data.length" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        p-4 printable-area
      ">

      <div class="">
        <div class="text-xl font-medium">Laporan Stok Opname</div>
        <div><strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </div>
      </div>




      <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm mt-4" style="margin-top: 10px;">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="border p-2">Tanggal</th>
            <th class="border p-2">Produk</th>
            <th class="border p-2 text-right">Sistem</th>
            <th class="border p-2 text-right">Fisik</th>
            <th class="border p-2 text-right">Selisih</th>
            <th class="border p-2 text-right">Jenis</th>
            <th class="border p-2">Petugas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td class="border p-2">{{ formatDateIndo(item.created_at) }}</td>
            <td class="border p-2">{{ item.product_name || '-' }}</td>
            <td class="border p-2 text-right">{{ parseFloat(item.stock_sistem || 0) }}</td>
            <td class="border p-2 text-right">{{ parseFloat(item?.stock_fisik || 0) }}</td>
            <td class="border p-2 text-right">{{ parseFloat(item?.selisih || 0) }}</td>
            <td class="border p-2 text-right">{{ item?.mutation_type === 'in' ? 'Plus' : 'Min' }}</td>
            <td class="border p-2">{{ item.user_name }}</td>
          </tr>
        </tbody>
      </table>


    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package"
        action-label="Add Product" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: null
  }

})



</script>
