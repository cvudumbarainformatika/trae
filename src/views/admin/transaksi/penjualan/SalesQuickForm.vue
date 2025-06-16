<template>
  <div class="flex flex-col h-full space-y-4 md:flex-row gap-4">
    <div class="w-full md:w-1/3 rounded shadow space-y-4 mt-4">
        <!-- Supplier Selection ini ganti dengan customer nanti-->
        <CustomerAndKasirSection/>
    </div>
     <!-- Grid Produk -->
     <div class="w-full md:w-2/3 rounded shadow space-y-4">
        <ProductListSection />
     </div>
     <!-- Grid summary -->
     <div class="w-full md:w-1/3 space-y-4 rounded shadow">
        <RiwayatPenjualan/>
        <button class="bg-white p-4" @click="store.simpanPenjualan">Coba simpanPenjualan</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue';
import { useSalesFormStore } from '../../../../stores/transaksi/penjualan/form';

const ProductListSection = defineAsyncComponent(()=> import('./compQuickForm/ProductListSection.vue'));
const CustomerAndKasirSection = defineAsyncComponent(()=> import('./compQuickForm/CustomerAndKasirSection.vue'));
const RiwayatPenjualan = defineAsyncComponent(()=> import('./compQuickForm/RiwayatPenjualan.vue'));


const store = useSalesFormStore()

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
});

// Listener keydown
function handleKeydown(e) {
  if (e.keyCode === 113) { // F2
    // Optional: abaikan jika sedang fokus di input/textarea
    const tag = e.target.tagName
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault() // Hindari efek default browser
      store.simpanPenjualan()
    }
  }
}


onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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
