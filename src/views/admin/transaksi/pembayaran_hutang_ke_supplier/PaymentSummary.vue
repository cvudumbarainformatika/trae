<template>
  <div class="mt-6 bg-gray-50 p-4 rounded-lg shadow space-y-4">
    <h2 class="font-semibold text-lg">Ringkasan Pembayaran</h2>

    <div>
      <label class="text-sm font-medium">Metode Pembayaran</label>
      <select v-model="metode" class="w-full border px-3 py-2 rounded mt-1">
        <option disabled value="">-- Pilih metode --</option>
        <option value="tunai">Tunai</option>
        <option value="transfer">Transfer</option>
        <option value="giro">Giro</option>
      </select>
    </div>

    <div>
      <label class="text-sm font-medium">Keterangan (Opsional)</label>
      <textarea v-model="keterangan" class="w-full border px-3 py-2 rounded mt-1" rows="2"
        placeholder="Contoh: Pembayaran sebagian via BCA"></textarea>
    </div>

    <div>
      <h3 class="font-medium">Faktur yang Dibayar:</h3>
      <ul class="list-disc ml-5 text-sm mt-1">
        <li v-for="item in fakturDibayar" :key="item.id">
          {{ item.no_faktur }} - {{ formatRupiah(item.bayar) }}
        </li>
      </ul>
    </div>

    <div class="text-right font-semibold">
      Total Bayar: {{ formatRupiah(totalBayar) }}
    </div>

    <button @click="submit" class="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      :disabled="!metode || totalBayar === 0">
      Simpan Pembayaran
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ fakturList: Array })
const emit = defineEmits(['submit'])

const metode = ref('')
const keterangan = ref('')

const fakturDibayar = computed(() =>
  props.fakturList.filter(f => f.bayar && f.bayar > 0)
)

const totalBayar = computed(() =>
  fakturDibayar.value.reduce((sum, f) => sum + f.bayar, 0)
)

const formatRupiah = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

const submit = () => {
  if (!metode.value || totalBayar.value <= 0) return

  emit('submit', {
    faktur: fakturDibayar.value,
    total: totalBayar.value,
    metode: metode.value,
    keterangan: keterangan.value
  })
}
</script>
