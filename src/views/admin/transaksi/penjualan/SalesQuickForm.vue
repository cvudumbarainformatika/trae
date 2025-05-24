<template>
  <div class="flex flex-col h-full space-y-4 md:flex-row gap-4">
    <div class="w-full md:w-1/3 rounded shadow space-y-4">
        <!-- Supplier Selection ini ganti dengan customer nanti-->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mt-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="User" class="w-5 h-5 mr-2 text-primary-500" />
              Pelanggan
            </h3>
              <label for="supplier-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier <span class="text-red-500">*</span>
              </label>
              <div class="relative w-full">
                <SearchDropdown
                  id="supplier-search"
                  v-model="customersearch"
                  placeholder="Cari supplier..."
                  :debounce="300"
                  :min-search-length="3"
                  item-key="id"
                  item-label="name"
                  not-found-text="Supplier tidak ditemukan"
                  not-found-subtext="Coba kata kunci lain atau tambahkan supplier baru"
                  add-button-text="Tambah Supplier Baru"
                  api-url="/api/v1/suppliers"
                  api-response-path="data.data"
                  :use-api="true"
                  @select="handleSupplierSelect"
                  @add-new="openAddSupplierDialog"
                  @items-loaded="onSuppliersLoaded"
                >
                  <template #item="{ item }">
                    <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                      <span>{{ item.phone || 'Tidak ada telepon' }}</span>
                    </div>
                  </template>
                </SearchDropdown>
              </div>
            </div>


            <!-- informasi kasir saat ini    -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">

              Informasi Data Kasir saat ini
              dan
              <div>informasi Info Daftar Product atau informasi apa saja saat ini</div>
            </div>
    </div>
     <!-- Grid Produk -->
     <div class="w-full md:w-2/3 rounded shadow space-y-4">
        <ProductListSection/>
     </div>
     <!-- Grid summary -->
     <div class="w-full md:w-1/3 space-y-4 bg-white rounded shadow">
        ssss
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
const customersearch = ref('');

const ProductListSection = defineAsyncComponent(()=> import('./compQuickForm/ProductListSection.vue'));

</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
