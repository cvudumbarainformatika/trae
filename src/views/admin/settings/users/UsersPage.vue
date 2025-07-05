<template>
  <BasePage title="Data Pengguna" subtitle="Manage Data Pengguna Aplikasi">

    <template #actions>
      <div class="flex items-center gap-2">
        <BaseButton @click="store.showCreateDialog = true" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
          <template #icon-left>
            <Icon name="Plus" class="w-4 h-4" />
          </template>
          Pengguna
        </BaseButton>
      </div>
    </template>
    <template #search>
      <div class="flex items-center justify-between gap-2 w-full">
        <!-- Search Input (dengan lebar yang cukup) -->
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" placeholder="Cari Pengguna ..." type="text" clearable :debounce="500"
            @update:model-value="store.fetchData" />
        </div>

        <!-- Filter Periode -->
        <!-- <div class="flex-1 flex justify-end">
          <BaseDateRangeFilter v-model="store.dateRange" @change="store.fetchData" default-period="month" />
        </div> -->

      </div>
    </template>


    <DataTable :data="store.items" @detail="handleEdit" />

    <BasePagination v-if="store.paginationInfo.totalItems > 0" v-model:current-page="store.pagination.page"
      :total-items="store.paginationInfo.totalItems" :items-per-page="store.pagination.itemsPerPage"
      @update:current-page="store.handlePageChange" />

    <div v-if="store.showCreateDialog">
      <DialogForm v-model="store.showCreateDialog" @close="store.showCreateDialog = false" />
    </div>
    <div v-if="storeForm.showEditDialog">
      <DialogEdit v-model="storeForm.showEditDialog" @close="storeForm.showEditDialog = false" />
    </div>

  </BasePage>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useUsersStore } from '@/stores/settings/users'
import { useUsersFormStore } from '@/stores/settings/users/form'

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))
const DialogForm = defineAsyncComponent(() => import('./DialogForm.vue'))
const DialogEdit = defineAsyncComponent(() => import('./DialogEdit.vue'))

const store = useUsersStore()
const storeForm = useUsersFormStore()


function handleEdit(item) {
  // console.log('handleEdit', item);

  storeForm.item = item
  storeForm.showEditDialog = true
}


onMounted(() => {
  Promise.all([
    store.fetchData()
  ])
})
</script>
