<template>
  <!-- Tabs Wrapper -->
  <div class="h-full">
    <base-tabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="(val) => {
      console.log('val', val);

      activeTab = val
    }" @remove-tab="(val) => removeTab(val)" @add-tab="store.generateTabBaru">

      <!-- Tab Content -->
      <template #tab-content>
        <div :key="activeTab" class="flex flex-col space-y-4 md:flex-row gap-4 px-4">
          <div class="w-full md:w-1/4 rounded shadow space-y-4 mt-4">
            <CustomerAndKasirSection :key="activeTab" />
          </div>
          <!-- Grid Produk -->
          <div class="w-full md:w-2/4 rounded shadow space-y-4">
            <ProductListSection :key="activeTab" ref="productListSectionRef" />
          </div>
          <!-- Grid summary -->
          <div class="w-full md:w-1/4 space-y-4 rounded shadow">
            <RiwayatPenjualan />
            <button class="bg-white p-4 text-secondary-900 " @click="store.simpanPenjualan">Coba
              simpanPenjualan</button>
          </div>
        </div>
      </template>
    </base-tabs>

    <PaymentModal :show="isPaymentOpen" :items="isiTab.items" :customer-id="isiTab.customer_id" :unique-code="activeTab"
      @submit="handlePayment" @close="isPaymentOpen = false" :item="isiTab" :loading="loadingSimpan" />

  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue';
import { useSalesFormWitTabsStore } from '../../../../stores/transaksi/penjualan/formwithtabs';
import { storeToRefs } from 'pinia';

// import Icon from '@/components/ui/Icon.vue';




const CustomerAndKasirSection = defineAsyncComponent(() => import('./compFormWithTabs/CustomerAndKasirSection.vue'));
const RiwayatPenjualan = defineAsyncComponent(() => import('./compFormWithTabs/RiwayatPenjualan.vue'));
const ProductListSection = defineAsyncComponent(() => import('./compFormWithTabs/ProductListSection.vue'));
const PaymentModal = defineAsyncComponent(() => import('./compFormWithTabs/PaymentModal.vue'));

const store = useSalesFormWitTabsStore()

const { tabs, activeTab, isiTab, isPaymentOpen, loadingSimpan } = storeToRefs(store)
const { initTabs, removeTab, handlePayment } = store

const productListSectionRef = ref(null)


onMounted(() => {

  // console.log('onMounted', productListSectionRef.value);

  setTimeout(() => {
    productListSectionRef.value?.focus()
  }, 100)
  // productListSectionRef?.focus


  initTabs()
  window.addEventListener('keydown', handleKeydown)
})

// Listener keydown
function handleKeydown(e) {
  if (e.keyCode === 112) { // F1
    // Optional: abaikan jika sedang fokus di input/textarea
    const tag = e.target.tagName
    // if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault() // Hindari efek default browser
    store.generateTabBaru()
    // }
  } else if (e.keyCode === 113) { // F2
    // Optional: abaikan jika sedang fokus di input/textarea
    const tag = e.target.tagName
    // if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault() // Hindari efek default browser
    store.simpanPenjualan()
    // }
  }
}


onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
