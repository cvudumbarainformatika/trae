<template>
  <!-- Tabs Wrapper -->
  <div class="h-full">
    <base-tabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="(val) => {
      activeTab = val
    }" @remove-tab="(val) => removeTab(val)" @add-tab="store.generateTabBaru">

      <!-- Tab Content -->
      <template #tab-content>
        <!-- <div :key="activeTab" class="flex flex-col space-y-4 md:flex-row gap-4 px-4">
          <div class="w-full md:w-1/4 rounded shadow space-y-4 mt-4">
            <CustomerAndKasirSection />
          </div>
          <div class="w-full md:w-2/4 rounded shadow space-y-4">
            <ProductListSection ref="productListSectionRef" />
          </div>
          <div class="w-full md:w-1/4 space-y-4 rounded shadow">
            <RiwayatPenjualan />
          </div>
        </div> -->

        <div :key="activeTab" class="grid grid-cols-12 gap-4 p-4">
          <div class="col-span-2 rounded shadow space-y-4">
            <CustomerAndKasirSection ref="customerAndKasirSectionRef" />
          </div>
          <div class="col-span-7 rounded shadow space-y-4">
            <ProductListSection ref="productListSectionRef" :isi-tab="isiTab" />
          </div>
          <div class="col-span-3 rounded shadow space-y-4">
            <!-- <CustomerAndKasirSection ref="customerAndKasirSectionRef" /> -->
            <InfoPenjualan ref="infoPenjualanRef" />
            <RiwayatPenjualan ref="riwayatPenjualanRef" />
          </div>
        </div>
      </template>
    </base-tabs>

    <PaymentModal :show="isPaymentOpen" :items="isiTab?.items || []" :customer-id="isiTab?.customer_id || null"
      :unique-code="activeTab" @submit="handleSubmit" @close="handleClosePaymentModal" :item="isiTab"
      :loading="loadingSimpan" />

    <StrukPenjualan ref="printRef" v-model="printing" :data="isiPrint" />


  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs';
import { printReceiptElement } from '@/utils/printing';
import { storeToRefs } from 'pinia';

// import Icon from '@/components/ui/Icon.vue';
import ProductListSection from './compFormWithTabs/ProductListSection.vue';
import InfoPenjualan from './compFormWithTabs/InfoPenjualan.vue';



const CustomerAndKasirSection = defineAsyncComponent(() => import('./compFormWithTabs/CustomerAndKasirSection.vue'));
const RiwayatPenjualan = defineAsyncComponent(() => import('./compFormWithTabs/RiwayatPenjualan.vue'));
// const ProductListSection = defineAsyncComponent(() => import('./compFormWithTabs/ProductListSection.vue'));
const PaymentModal = defineAsyncComponent(() => import('./compFormWithTabs/PaymentModal.vue'));
const StrukPenjualan = defineAsyncComponent(() => import('./compFormWithTabs/StrukPenjualan.vue'));
const printRef = ref(null)

const store = useSalesFormWitTabsStore()

const { tabs, activeTab, isiTab, isPaymentOpen, loadingSimpan, printing, isiPrint } = storeToRefs(store)
const { initTabs, removeTab, handlePayment } = store

const productListSectionRef = ref(null)


onMounted(async () => {
  await nextTick()
  console.log('Ref setelah render di sales quick form:', productListSectionRef.value);
  productListSectionRef?.value?.focus?.()

  // setTimeout(() => { // delay 1 frame biar child pasti siap
  //   productListSectionRef?.value?.focus()
  // }, 50)


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
  } else if (e.ctrlKey) {
    if (e.key === '1') {
      e.preventDefault()
      // console.log('cc', store.isiTab);
      store.isiTab.category = 'umum'
      // jenisPenjualan.value = 'umum'
    }
    if (e.key === '2') {
      e.preventDefault()
      store.isiTab.category = 'pelanggan'
    }
    if (e.key === '3') {
      e.preventDefault()
      store.isiTab.category = 'antar'
    }
  }// F3
}

function handleSubmit(val) {
  handlePayment(val)
    .then(() => {
      if (printRef.value?.printAreaRef) {
        printReceiptElement(printRef.value.printAreaRef, () => {
          console.log('print selesai');

          printing.value = false
          isiPrint.value = null
          productListSectionRef?.value?.focus?.()
        })
        // .then(() => {
        // console.log('print selesai with then', isiPrint.value);

        printing.value = false
        isiPrint.value = null
        // })

      }
    })
}

function handleClosePaymentModal() {
  isPaymentOpen.value = false
  productListSectionRef?.value?.focus?.()
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
