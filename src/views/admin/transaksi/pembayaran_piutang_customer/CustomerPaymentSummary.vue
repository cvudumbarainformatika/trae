<template>
  <div class="mt-6 bg-gray-50 p-4 rounded-lg shadow space-y-4">
    <h2 class="font-semibold text-lg">Ringkasan Pembayaran Piutang</h2>

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
        placeholder="Contoh: Pembayaran via transfer Mandiri"></textarea>
    </div>

    <ul>
      <li v-for="item in invoiceDibayar" :key="item.id" class="text-sm">
        {{ item.no_invoice }} - {{ formatRupiah(item.bayar) }}
      </li>
    </ul>

    <div class="text-right font-semibold">
      Total Dibayar: {{ formatRupiah(totalBayar) }}
    </div>

    <button class="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      :disabled="!metode || totalBayar === 0" @click="submit">
      Simpan Pembayaran
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ invoiceList: Array })
const emit = defineEmits(['submit'])

const metode = ref('')
const keterangan = ref('')

const invoiceDibayar = computed(() =>
  props.invoiceList.filter(i => i.bayar && i.bayar > 0)
)

const totalBayar = computed(() =>
  invoiceDibayar.value.reduce((sum, i) => sum + i.bayar, 0)
)

const formatRupiah = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

const submit = () => {
  emit('submit', {
    invoices: invoiceDibayar.value,
    total: totalBayar.value,
    metode: metode.value,
    keterangan: keterangan.value
  })
}
</script>
