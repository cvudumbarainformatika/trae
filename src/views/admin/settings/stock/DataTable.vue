<template>
  <div>
    <div v-if="data.length" class="relative w-full flex flex-col h-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        printable-area
      ">

      <div class="flex-1 min-h-0 overflow-auto">
        <table class="min-w-full table-auto  border-collapse text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th class="text-left  p-3 ">Barcode</th>
              <th class="text-left  p-3 ">Nama</th>
              <th class="text-left  p-3 ">Rak</th>
              <th class="text-right  p-3 ">Tgl Mutasi Trkhir</th>
              <th class="text-right  p-3 ">Stock System</th>
              <th class="text-right  p-3 ">Stock Fisik</th>
              <th class="text-right  p-3 ">Selisih</th>
              <th class="text-right  p-3 ">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in data" :key="item.id">

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="border border-gray-800 dark:border-gray-500 p-3  font-medium text-gray-800 dark:text-white">
                  {{ item?.barcode
                  }}</td>
                <td class="border border-gray-800 dark:border-gray-500 p-3  text-gray-700 dark:text-gray-300">{{
                  item?.name || '-' }}
                  ({{ item?.satuan_name
                  }})
                </td>
                <td class="border border-gray-800 dark:border-gray-500 p-3  text-left text-gray-700 dark:text-gray-300">
                  {{ item?.rak }}
                </td>
                <td
                  class="border border-gray-800 dark:border-gray-500 p-3  text-right text-gray-700 dark:text-gray-300">
                  <div v-if="item?.tanggal">{{ formatDateIndo(item?.tanggal)
                    }}, {{ formatTimeIndo(item?.tanggal) }}</div>
                  <div v-else>-</div>
                </td>
                <td
                  class="border border-gray-800 dark:border-gray-500 p-3  text-right text-gray-700 dark:text-gray-300">
                  {{
                    item?.stock_akhir }}</td>
                <td
                  class="border border-gray-800 dark:border-gray-500 p-3  text-right text-gray-700 dark:text-gray-300 flex justify-end">
                  <base-input v-model="item.stock_fisik" type="number" style="width: 100px"
                    @update:modelValue="val => val !== null && val !== '' && updateSelisih(index)" :debounce="500" />
                </td>
                <td
                  class="border border-gray-800 dark:border-gray-500 p-3  text-right text-gray-700 dark:text-gray-300">
                  {{
                    item?.selisih }}</td>
                <td
                  class="border border-gray-800 dark:border-gray-500 p-3  text-right text-gray-700 dark:text-gray-300">
                  <div class="flex items-center justify-end gap-2">
                    <button v-if="item?.isEdited" class="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                      @click="emit('update:modelValue', item, index)">
                      <Icon size="16" name="hard-drive-download" class="cursor-pointer" />
                    </button>
                    <button v-if="item?.isEdited" class="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      @click="emit('cancel', item, index)">
                      <Icon size="16" name="ban" class="cursor-pointer" />
                    </button>
                    <button class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-1 rounded"
                      @click="emit('detail', item)">
                      <Icon size="16" name="eye" class="cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package"
        action-label="Add Product" />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { formatDateIndo, formatTimeIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['update:modelValue', 'detail', 'cancel'])

function updateSelisih(index) {
  const item = props.data[index]
  if (item.stock_fisik === null || item.stock_fisik === '') return
  // console.log('item', item);

  item.selisih = item.stock_fisik - item.stock_akhir
  // emit('update:modelValue', item)
  item.isEdited = true
}

// watch(
//   () => props.data,
//   (newVal) => {
//     newVal.forEach((item, i) => {
//       updateSelisih(i)
//     })
//   },
//   { deep: true }
// )


</script>

<style scoped>
@media print {
  .printable-area {
    color: black !important;
    background: white !important;
  }
}
</style>
