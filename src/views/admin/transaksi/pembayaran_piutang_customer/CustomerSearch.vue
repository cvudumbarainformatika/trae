<template>
  <div class="flex gap-2 items-end">
    <div>
      <label class="text-sm font-medium">Nama / Kode Customer</label>
      <input v-model="keyword" @keydown.enter="search" placeholder="Contoh: CUST001 atau Bpk Andi"
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

const keyword = ref('')
const search = () => {
  if (keyword.value.trim()) {
    emit('searched', keyword.value.trim())
  }
}
</script>
