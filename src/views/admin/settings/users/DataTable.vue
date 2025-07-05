<template>
  <BaseList :items="data" empty-icon="Users" empty-title="Belum Ada Data Pengguna"
    empty-description="Belum ada Data Pengguna. Klik tombol '+ Pengguna' untuk menambahkan pengguna Baru.">
    <template #item="{ item }">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
        <div class="flex flex-col md:flex-row">
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                  <Icon name="User" class="w-5 h-5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                  {{ item?.name }}
                </h3>
                <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3">
                  <div class="flex items-center">
                    <Icon name="Calendar" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ formatDateIndo(item?.created_at) }}</span>
                  </div>
                  <!-- <div class="flex items-center">
                    <Icon name="ShoppingCart" class="w-3.5 h-3.5 mr-2" />
                    <span>{{ item.items?.length || 0 }} items</span>
                  </div> -->
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ item?.role }}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center mt-0">
              <div class="flex gap-x-4 items-center text-gray-500 dark:text-gray-400">
                <div class="flex space-x-1 items-center">
                  <!-- <Icon name="Receipt" class="w-4 h-4" />
                  <div class="text-base">{{ item.unique_code || `INV-${item.id}` }}</div> -->

                </div>
              </div>
              <div class="flex items-center gap-3">
                <BaseButton size="sm" color="primary" @click="$emit('detail', item)">
                  Detail
                </BaseButton>
                <!-- <BaseButton size="sm" color="primary" @click="$emit('detail', item)">
                  Edit
                </BaseButton> -->
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
import { formatDateIndo } from '@/utils/dateHelper'
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
