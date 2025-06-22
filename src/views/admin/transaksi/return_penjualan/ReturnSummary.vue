<template>
  <div class="mt-6 bg-gray-50 p-4 rounded-lg shadow">
    <h2 class="font-semibold text-lg mb-2">Ringkasan Retur</h2>
    <ul>
      <li v-for="item in returnedItems" :key="item.id" class="text-sm">
        {{ item.nama }} - {{ item.return_qty }} x {{ formatRupiah(item.harga) }}
      </li>
    </ul>
    <div class="mt-3 font-semibold">
      Total: {{ formatRupiah(total) }}
    </div>
    <button @click="submit" class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      Proses Retur
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: Array
})

const emit = defineEmits(['submit'])

const returnedItems = computed(() =>
  props.items.filter(i => i.return_qty && i.return_qty > 0)
)

const total = computed(() =>
  returnedItems.value.reduce((sum, item) => sum + (item.return_qty * item.harga), 0)
)

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)

const submit = () => {
  if (returnedItems.value.length) {
    emit('submit', returnedItems.value)
  }
}
</script>
