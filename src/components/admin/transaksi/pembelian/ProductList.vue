<template>
  <!-- ... kode lainnya ... -->
  
  <div v-for="(item, index) in items" :key="index"
       class="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
    <!-- Header: Product name, barcode, and delete button -->
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="font-medium text-secondary-900 dark:text-white">
          {{ item.product?.name || 'Tidak ada nama produk' }}
          <span v-if="item.purchase_order_item_id" class="ml-2 text-xs text-blue-600 dark:text-blue-400">
            (PO Item #{{ item.purchase_order_item_id }})
          </span>
          <span v-if="item.is_additional" class="ml-2 text-xs text-amber-600 dark:text-amber-400">
            (Item Tambahan)
          </span>
        </div>
        <div class="text-xs text-secondary-500 dark:text-secondary-400">
          {{ item.product?.barcode || 'Tidak ada barcode' }}
        </div>
      </div>

      <button @click="removeItem(index)"
              :disabled="!canRemove(item)"
              :class="{'opacity-50 cursor-not-allowed': !canRemove(item)}"
              class="text-red-500 hover:text-red-600 dark:hover:text-red-400 ml-2">
        <Icon name="Trash" class="w-4 h-4" />
      </button>
    </div>
    
    <!-- ... kode lainnya ... -->
  </div>
  
  <!-- ... kode lainnya ... -->
</template>

<script setup>
// ... kode lainnya ...

// Fungsi untuk memeriksa apakah item dapat dihapus
const canRemove = (item) => {
  // Jika item berasal dari PO (memiliki purchase_order_item_id dan bukan item tambahan), 
  // maka tidak dapat dihapus
  return !(item.purchase_order_item_id && !item.is_additional);
}

// ... kode lainnya ...
</script>