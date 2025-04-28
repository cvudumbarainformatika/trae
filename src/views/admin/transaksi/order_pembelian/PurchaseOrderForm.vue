<template>
  <BaseDialog 
    v-model="showDialog" 
    title="Order Pembelian Baru"
    fullscreen
    @close="store.resetForm"
  >
    <div class="h-full flex flex-col lg:flex-row gap-6 p-4">
      <!-- Form Section -->
      <div class="flex-1 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseSelect 
            v-model="store.form.supplier_id" 
            label="Supplier" 
            :options="store.suppliers"
            option-label="name"
            option-value="id"
            required
          />
          
          <BaseInput 
            v-model="store.form.po_number" 
            label="Nomor PO" 
            required
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseDatePicker 
            v-model="store.form.date" 
            label="Tanggal Order" 
            required
          />
          
          <BaseDatePicker 
            v-model="store.form.due_date" 
            label="Jatuh Tempo" 
            required
            :min="store.form.date"
          />
        </div>
      </div>

      <!-- Items List Section -->
      <div class="flex-1 border-t lg:border-t-0 lg:border-l border-secondary-200 dark:border-secondary-700 pt-6 lg:pt-0 lg:pl-6">
        <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4">Items</h3>
        <!-- Items list content -->
      </div>
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'

const store = usePurchaseOrderStore()

onMounted(() => {
  store.fetchSuppliers()
  store.fetchProducts()
})
</script>
