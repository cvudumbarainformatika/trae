<template>
  <div ref="printContainer" v-if="isOpen"
    class="fixed inset-0 bg-white text-black z-50 w-[280px] print:w-full  print-area">
    <div ref="printArea" class="p-4 font-mono w-full print:w-full">
      <div class="text-center mb-[8px]">
        <div class="text-[10x] font-bold">TOKO MAJU JAYA</div>
        <div class="text-[8px]">Jl. Merdeka No.123, Jakarta</div>
        <div class="text-[8px]">Telp: 021-12345678</div>
        <hr class="my-[8px] border-dashed border-gray-400">
      </div>

      <div class="mb-[8px]">
        <div class="flex justify-between text-[8px]">
          <span>No: {{ data?.unique_code }}</span>
          <span>{{ data?.created_at }}</span>
        </div>
        <div class="flex justify-between text-[8px]">
          <span>Kasir: {{ data.kasir_name || '-' }}</span>
          <span>Jam: {{ data?.jam || '-' }}</span>
        </div>
      </div>

      <table class="w-full mb-[8px] text-[8px] leading-[1]">
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
      </table>

      <div class="border-t border-dashed border-gray-400 pt-2 text-[8px]">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ format(data?.total) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Diskon</span>
          <span>{{ format(data.discount) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Pajak</span>
          <span>{{ format(data.tax) }}</span>
        </div>
        <div class="flex justify-between font-bold">
          <span>Total</span>
          <span>{{ format(data?.total) }}</span>
        </div>
        <div class="flex justify-between mt-[8px]">
          <span>Bayar</span>
          <span>{{ format(data.bayar) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Kembali</span>
          <span>{{ format(data.kembali) }}</span>
        </div>
      </div>

      <div class="text-center text-[8px] mt-[20px]">
        <div>~ Terima Kasih ~</div>
        <div>Barang yang sudah dibeli</div>
        <div>tidak dapat dikembalikan</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, nextTick, onMounted } from 'vue'

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

watchEffect(() => {
  if (isOpen.value) {
    nextTick(() => {
      // Delay kecil agar browser sempat render ke layar
      setTimeout(() => {
        window.print()

        // Setelah print, tutup dialog
        setTimeout(() => {
          isOpen.value = false
        }, 500)
      }, 300) // ← delay 300ms penting agar tidak blank
    })
  }
})

onMounted(() => {
  console.log('🟢 Komponen Struk ter-mount')
})

const nota = {
  no: 'TRX-0001',
  tanggal: '2025-06-20',
  jam: '19:45',
  kasir: 'Admin',
  items: [
    { nama: 'Indomie Goreng', qty: 2, harga: 3500 },
    { nama: 'Teh Botol', qty: 1, harga: 4000 },
    { nama: 'Roti Tawar', qty: 1, harga: 8000 },
  ],
  subtotal: 19000,
  diskon: 1000,
  total: 18000,
  bayar: 20000,
  kembali: 2000,
}

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

.print-area {
  width: 58mm;
  padding: 0;
  margin: 0;
}
</style>

<style>
@media print {
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

}
</style>
