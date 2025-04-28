<template>
  <BasePage title="Order Pembelian" subtitle="Manage Order Pemebelian dari Supplier">
    <template #actions>
      <button
        type="button"
        @click="purchaseOrderStore.showCreateDialog = true"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-all duration-200 transform hover:scale-105"
      >
        <i class="ri-add-line mr-2" />
        Tambah Order
      </button>
    </template>

    <template #search>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="ri-search-line text-gray-400" />
        </div>
        <BaseInput
          v-model="purchaseOrderStore.searchQuery"
          placeholder="Cari order pembelian..."
          type="text"
          class="w-full"
          clearable
          :debounce="500"
          @update:model-value="purchaseOrderStore.fetchPurchaseOrders"
        />
      </div>
    </template>

    <!-- Order Table Section with Scroll -->
    <div class="flex-1 overflow-auto relative">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <BaseTable 
              :headers="purchaseOrderStore.headers" 
              :items="purchaseOrderStore.items"
              :loading="purchaseOrderStore.loading"
              :pagination="purchaseOrderStore.pagination"
              @update:pagination="val => { purchaseOrderStore.pagination = val; purchaseOrderStore.fetchPurchaseOrders() }"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <PurchaseOrderForm 
      v-model="showCreateDialog"
      @success="fetchPurchaseOrders"
    />
  </BasePage>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'
import PurchaseOrderForm from './PurchaseOrderForm.vue'

const purchaseOrderStore = usePurchaseOrderStore()

const { showCreateDialog, headers, items, loading, searchQuery, pagination } = purchaseOrderStore
 

// Fetch initial data
onMounted(() => {
  purchaseOrderStore.fetchPurchaseOrders()
})
</script>