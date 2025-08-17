<template>
  <base-dialog fullscreen :title="`Kartu Stock ${data?.name}`">
    <div class="p-4 space-y-4 text-gray-800 dark:text-gray-100 w-full h-full flex flex-col">
      <!-- head -->
      <div class="flex flex-row gap-2 items-center">
        <div class="flex">
          Kartu Stock Product Berdasarkan Periode &nbsp; &nbsp;
          <!-- <b> {{ formatDateIndo(store.params.start_date) }} s/d {{ formatDateIndo(store.params.end_date) }}</b> -->
        </div>
        <div class="flex-1">
          <div class="flex-1 flex justify-end no-print">
            <BaseDateRangeFilter v-model="params" @change="store.fetchStockById(data.id)" default-period="month" />
          </div>
        </div>
      </div>

      <!-- body -->

      <div class="flex-1 overflow-y-scroll">
        <div v-if="store?.productMutations?.length" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        printable-area
      ">

          <table class="min-w-full h-full border border-gray-300 dark:border-gray-700 text-sm mt-2"
            style="margin-top: 10px; margin-bottom: 10px;">
            <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr>
                <th class="text-left border p-3 ">Tanggal</th>
                <th class="text-left border p-3 ">Catatan</th>
                <th class="text-left border p-3 ">Type</th>
                <th class="text-right border p-3 ">Stok Awal</th>
                <th class="text-right border p-3 ">Qty</th>
                <th class="text-right border p-3 ">Stock Akhir</th>
              </tr>
            </thead>
            <tbody class=" overflow-y-scroll">
              <template v-for="item in store?.productMutations" :key="item.id">

                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="border p-3  font-medium text-gray-800 dark:text-white">{{ formatDateIndo(item?.created_at)
                    }}, {{
                      formatTimeIndo(item?.created_at)
                    }}
                  </td>
                  <td class="border p-3  text-gray-700 dark:text-gray-300">{{ item?.notes || '-' }}
                  </td>
                  <td class="border p-3  text-left text-gray-700 dark:text-gray-300">{{ item?.mutation_type }}</td>
                  <td class="border p-3  text-right text-gray-700 dark:text-gray-300">{{ item?.stock_before }}</td>
                  <td class="border p-3  text-right text-gray-700 dark:text-gray-300">{{ item?.qty }}</td>
                  <td class="border p-3  text-right text-gray-700 dark:text-gray-300">
                    {{ item?.stock_after }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-else>
          <NoData
            :message="`Tidak Ada Data Pada Periode ${formatDateIndo(params.start_date)} s/d ${formatDateIndo(params.end_date)}`"
            description="Coba Cari Data Periode Tanggal Yang Lain" icon="Package" action-label="Add Product" />
        </div>
      </div>

      <!-- <div class="flex justify-end gap-4"> -->
      <BasePagination v-if="store?.productMutationMeta?.total > 0" v-model:current-page="params.page"
        :total-items="store?.productMutationMeta?.total" :items-per-page="params.per_page"
        @update:current-page="handlePageChange" />
      <!-- </div> -->

    </div>
  </base-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStockGudangStore } from '@/stores/gudangs/penyesuaian'
import { formatDateIndo, formatTimeIndo, getMonthStartDate, getMonthEndDate } from '@/utils/dateHelper'


const store = useStockGudangStore()

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})


const params = ref({
  start_date: null,
  end_date: null,
  page: 1,
  per_page: 100,

})

onMounted(() => {
  // console.log('props', props.data);
  params.value.start_date = getMonthStartDate()
  params.value.end_date = getMonthEndDate()

  Promise.all([
    store.fetchStockById(props.data.id, params.value)
  ])

})

function handlePageChange(page) {
  params.value.page = page
  store.fetchStockById(props.data.id, params.value)
}
</script>
