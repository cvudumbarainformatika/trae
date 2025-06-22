<template>
  <div class="flex gap-2 items-end">
    <div>
      <label class="text-sm font-medium">No. Faktur Pembelian</label>
      <input v-model="invoice" @keydown.enter="search" placeholder="Masukkan no faktur"
        class="border px-3 py-2 rounded-lg w-64 shadow-sm" />
    </div>
    <button @click="search" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80">
      Cari
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['searched'])

const invoice = ref('')

const search = () => {
  if (invoice.value.trim()) {
    emit('searched', invoice.value.trim())
  }
}
</script>
