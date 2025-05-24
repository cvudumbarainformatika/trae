<template>
  <BaseList
    :items="data"
    empty-icon="ShoppingCart"
    empty-title="Belum Ada Penjualan"
    empty-description="Belum ada transaksi penjualan yang tersedia. Klik tombol 'Tambah Penjualan' untuk membuat transaksi baru."
  >
    <template #item="{ item }">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-1 h-1 md:h-auto"
               :class="{
                 'bg-green-500': item.status === 'tunai',
                 'bg-yellow-500': item.status === 'kredit',
               }">
          </div>
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                  <Icon name="User" class="w-4 h-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                  {{ item.customer_name || 'Customer tidak diketahui' }}
                </h3>
                <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3">
                  <div class="flex items-center">
                    <Icon name="Calendar" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ new Date(item.date).toLocaleDateString() }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ShoppingCart" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ item.items?.length || 0 }} items</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total || 0) }}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2">
              <div class="flex gap-x-4 items-center text-gray-500 dark:text-gray-400">
                <div class="flex space-x-1 items-center">
                  <Icon name="Receipt" class="w-4 h-4" />
                  <div class="text-base">{{ item.invoice_number || `INV-${item.id}` }}</div>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.status === 'tunai',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.status === 'kredit',
                    }">
                  {{ item.status === 'tunai' ? 'Tunai' : 'Kredit' }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <BaseButton size="sm" color="primary" @click="$emit('detail', item)">
                  Detail
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseList>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseList from '@/components/ui/BaseList.vue'
import Icon from '@/components/ui/Icon.vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<!-- Tambahkan filter currency di main.js jika belum ada -->
