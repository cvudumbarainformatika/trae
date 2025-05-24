<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mt-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
      <Icon name="User" class="w-5 h-5 mr-2 text-primary-500" />
      Pelanggan
    </h3>
      <!-- <label for="supplier-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Pelanggan <span class="text-red-500">*</span>
      </label> -->
      <div class="relative w-full">
        <SearchDropdown
          id="customer-search"
          v-model="customersearch"
          placeholder="Cari Customer..."
          :debounce="300"
          :min-search-length="3"
          item-key="id"
          item-label="name"
          not-found-text="Customer tidak ditemukan"
          not-found-subtext="Coba kata kunci lain atau tambahkan Customer baru"
          add-button-text="Tambah Customer Baru"
          api-url="/api/v1/customers"
          api-response-path="data.data"
          :use-api="true"
          @select="handleCustomerSelect"
          @add-new="openAddCustomerDialog"
          @items-loaded="onCustomerLoaded"
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
</template>

<script setup>

</script>
