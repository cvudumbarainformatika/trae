<template>
  <div class="flex flex-col h-full space-y-4 md:flex-row gap-4">
    <div class="w-full md:w-1/3 rounded shadow space-y-4">
        <!-- Supplier Selection ini ganti dengan customer nanti-->
        <CustomerAndKasirSection/>
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

const ProductListSection = defineAsyncComponent(()=> import('./compQuickForm/ProductListSection.vue'));
const CustomerAndKasirSection = defineAsyncComponent(()=> import('./compQuickForm/CustomerAndKasirSection.vue'));

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
