<template>
  <div class="flex flex-wrap items-end gap-4 mb-6">
    <div>
      <label class="text-sm font-medium">Dari Tanggal</label>
      <input type="date" v-model="filter.startDate" class="border rounded px-3 py-2" />
    </div>
    <div>
      <label class="text-sm font-medium">Sampai Tanggal</label>
      <input type="date" v-model="filter.endDate" class="border rounded px-3 py-2" />
    </div>
    <div>
      <label class="text-sm font-medium">Kasir (Opsional)</label>
      <select v-model="filter.kasir" class="border rounded px-3 py-2">
        <option value="">Semua</option>
        <option v-for="kasir in kasirList" :key="kasir.id" :value="kasir.id">
          {{ kasir.nama }}
        </option>
      </select>
    </div>
    <button @click="apply" class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">
      Tampilkan
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['filter'])

const filter = reactive({
  startDate: '',
  endDate: '',
  kasir: ''
})

const kasirList = [
  { id: 'kasir_andi', nama: 'Kasir Andi' },
  { id: 'kasir_rina', nama: 'Kasir Rina' },
  { id: 'kasir_budi', nama: 'Kasir Budi' }
]

const apply = () => {
  emit('filter', { ...filter })
}
</script>

<style scoped></style>
