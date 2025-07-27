<template>
  <BaseList :items="data" empty-icon="ShoppingCart" empty-title="Belum Ada Transaksi Arus Kas"
    empty-description="Belum ada transaksi Arus Kas Dari Kasir. Klik tombol 'Arus Kas' untuk membuat transaksi baru.">
    <template #item="{ item }">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
        <div class="flex flex-col md:flex-row">
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                  <Icon name="User" class="w-4 h-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                  {{ item?.tipe === 'out' ? 'Pengeluaran' : 'Pemasukan' }}, Kas {{ item?.kas?.nama }}
                </h3>
                <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3">
                  <div class="flex items-center">
                    <Icon name="Calendar" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ new Date(item.tanggal).toLocaleDateString() }} | </span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="user" class="w-3.5 h-3.5 mr-2" />
                    <span>{{ item.kasir?.name || '-' }} </span>
                  </div>

                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID').format(item?.jumlah || 0) }}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2">
              <div class="flex gap-x-4 items-center text-gray-500 dark:text-gray-400">
                <!-- <div class="flex space-x-1 items-center">
                  <Icon name="Receipt" class="w-4 h-4" />
                  <div class="text-base">{{ item.user?.name }}</div>
                </div> -->
              </div>
              <div class="flex items-center gap-2">
                <!-- <BaseButton size="sm" color="primary" @click="$emit('detail', item)">
                  Detail
                </BaseButton> -->
                <div class="flex space-x-1 items-center text-gray-900 dark:text-white">
                  <Icon name="Receipt" class="w-4 h-4" />
                  <div class="text-base">{{ item.user?.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseList>
</template>

<script setup>
import { onMounted } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  console.log('props', props.data);
})

</script>
