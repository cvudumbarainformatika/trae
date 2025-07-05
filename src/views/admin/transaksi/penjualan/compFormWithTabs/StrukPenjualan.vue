<template>
  <div ref="printContainer" v-show="isOpen"
    class="fixed inset-0 bg-white text-black z-50 w-[280px] print:w-full  print-area">
    <div ref="printAreaRef" class="p-1 font-mono w-full print:w-full">
      <div class="text-center mb-[5px]">
        <div class="font-bold center bold">TOKO MAJU JAYA</div>
        <div class="center">Jl. Merdeka No.123, Jakarta</div>
        <div class="center">Telp: 021-12345678</div>
        <hr class="border-dashed border-gray-400">
      </div>

      <div class="mb-[8px]">
        <div class="flex justify-between">
          <span>{{ data?.unique_code }}</span>
          <span>{{ formatDateIndo(data?.created_at) }}</span>
        </div>
        <div class="flex justify-between text-[8px]">
          <span> {{ data?.cashier?.name || '-' }}</span>
          <span>Jam: {{ formatTimeIndo(data?.created_at) || '-' }}</span>
        </div>
        <hr class="border-dashed border-gray-400">
      </div>

      <!-- <table class="w-full mb-[8px] text-[8px] leading-[1]">
        <thead>
          <tr class="border-y border-dashed border-gray-400 text-[8px] leading-[1]">
            <th class="text-left whitespace-nowrap">Barang</th>
            <th class="text-right whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data?.items" :key="index" class="text-[8px] leading-[1]">
            <td class="whitespace-nowrap">{{ item?.product?.name }}, {{ item.qty }} X {{ format(item.price) }}</td>
            <td class="text-right whitespace-nowrap">{{ format(item.qty * item.price) }}</td>
          </tr>
        </tbody>
      </table> -->
      <div v-for="(item, index) in data?.items" :key="index" class="item-row">
        <span>{{ item?.product?.name }}</span>
        <span>{{ item?.qty }} X {{ formatRupiah(item?.price || 0) }}</span>
      </div>

      <hr class="border-dashed border-gray-400">
      <div class="border-t border-dashed border-gray-400 pt-2 text-[8px]">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatRupiah(data?.total) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Diskon</span>
          <span>{{ formatRupiah(data?.discount) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Pajak</span>
          <span>{{ formatRupiah(data?.tax) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total</span>
          <span>{{ formatRupiah(data?.total) }}</span>
        </div>
        <div class="flex justify-between mt-[8px]">
          <span>Bayar</span>
          <span>{{ formatRupiah(data?.bayar) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Kembali</span>
          <span>{{ formatRupiah(data?.kembali) }}</span>
        </div>
      </div>
      <hr class="border-dashed border-gray-400">
      <div class="text-center text-[8px] mt-[20px]">
        <div class=" center">~ Terima Kasih ~</div>
        <div class="center">Barang yang sudah dibeli</div>
        <div class="center">tidak dapat dikembalikan</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, nextTick, onMounted } from 'vue'
import { formatDateIndo, formatTimeIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'
import { printHtmlElement } from '@/utils/printing';

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const printAreaRef = ref(null)

defineExpose({ printAreaRef })

// watchEffect(() => {
//   if (isOpen.value) {
//     nextTick(() => {
//       // Delay kecil agar browser sempat render ke layar
//       setTimeout(() => {
//         // window.print()
//         if (printRef.value) {
//           printHtmlElement(printRef.value.$el);
//         }

//         // Setelah print, tutup dialog
//         setTimeout(() => {
//           isOpen.value = false
//         }, 100)
//       }, 300) // ← delay 300ms penting agar tidak blank
//     })
//   }
// })

onMounted(() => {
  // console.log('🟢 Komponen Struk ter-mount', printAreaRef.value)
})



const format = (val) => new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0
}).format(val)
</script>


<style scoped>
body * {
  visibility: hidden;
}

.print-area,
.print-area * {
  visibility: visible;
}

/* .print-area {
  width: 58mm;
  padding: 0;
  margin: 0;
} */
</style>

<style>
/* @media print {
  @page {
    size: 58mm auto;
    margin: 0;
  }

  html,
  body {
    margin: 0 !important;
  }

  .print-area {
    width: 58mm;
  }

  .print-area {
    position: absolute !important;
    top: 0;
    left: 0;
    margin: 0 !important;
    padding: 0 !important;
    background: white;
    font-size: 8px;
    line-height: 1;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    padding: 0;
    margin: 0;
  }

} */
</style>
