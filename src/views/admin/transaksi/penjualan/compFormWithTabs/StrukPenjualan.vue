<template>
  <div ref="printContainer" v-show="isOpen"
    class="fixed inset-0 bg-white text-black z-50 w-full print:w-full  print-area">
    <div ref="printAreaRef" class="p-1 w-full print:w-full" style="padding-right: 10px !important;">
      <div class="text-center mb-[5px]">
        <div class="font-bold center bold" style="font-size: 10pt !important">{{ bio?.item?.name || 'NAMA TOKO' }}</div>
        <div class="center">{{ bio?.item?.address || 'ALAMAT TOKO' }}</div>
        <div class="center">Telp: {{ bio?.item?.phone || '-' }}</div>
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
      <div v-for="(item, index) in data?.items" :key="index" class="item-row">
        <span class="bold">{{ item?.product?.name }}</span>
        <span>{{ item?.qty }} X {{ formatRupiah(item?.price || 0) }}</span>
      </div>


      <hr class="border-dashed border-gray-400">
      <div class="flex">
        item: {{ data?.items?.length }}
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
import { useCompanyStore } from '@/stores/settings/company'
import { formatRupiah } from '@/utils/uangHelper'
import { printHtmlElement } from '@/utils/printing';

const bio = useCompanyStore()
// const format = (value) => {
//   return formatRupiah(value)
// }

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

onMounted(() => {
  console.log('🟢 Komponen Struk ter-mount', props?.data)
})

</script>


<style scoped>
body * {
  visibility: hidden;
}

.print-area,
.print-area * {
  visibility: visible;
}
</style>

<style></style>
