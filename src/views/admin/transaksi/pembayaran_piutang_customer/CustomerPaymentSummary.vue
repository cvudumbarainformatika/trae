<template>
  <div
    class="mt-6 bg-gray-50 dark:bg-secondary-800 text-secondary-700 dark:text-gray-50 p-4 rounded-lg shadow space-y-4">
    <h2 class="font-semibold text-lg">Ringkasan Pembayaran Piutang</h2>

    <div>
      <label class="text-sm font-medium">Metode Pembayaran</label>
      <select v-model="metode" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white ">
        <option disabled value="">-- Pilih metode --</option>
        <option value="tunai">Tunai</option>
        <option value="transfer">Transfer</option>
        <option value="qris">Qris</option>
      </select>
    </div>

    <div>
      <label class="text-sm ">Bayar {{ formatRupiah(dibayar) || '' }}</label>
      <BaseInput class="w-full" v-model.number="dibayar" type="number" />
    </div>

    <div>
      <label class="text-sm font-medium">Keterangan (Opsional)</label>
      <textarea v-model="keterangan" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white " rows="2" placeholder="Contoh: Pembayaran via transfer Mandiri"></textarea>
    </div>

    <div>
      <div class="text-sm">Sisa yang seharusnya Dibayar : </div>
      {{ formatRupiah(sisaBayar) }}
    </div>

    <div class="text-right font-semibold">
      Total Dibayar: {{ formatRupiah(totalBayar) }}
    </div>

    <button @click="saved" class="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      :disabled="loading">
      <span>Simpan Pembayaran</span>
      <!-- Spinner -->
      <svg v-if="loading" class="animate-spin h-5 w-5 text-white absolute right-3" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ invoiceList: { type: Array, default: () => [] }, loading: { type: Boolean, default: false }, data: { type: Object, default: null } })
const emit = defineEmits(['submit'])

const metode = ref('')
const dibayar = ref(0)
const keterangan = ref('')

const invoiceDibayar = computed(() =>
  props.invoiceList.filter(i => i.dibayar > 0)
)

const totalBayar = computed(() =>
  invoiceDibayar.value.reduce((sum, i) => sum + i.dibayar, 0) + dibayar.value
)

const sisaBayar = computed(() =>
  props.invoiceList[props.invoiceList.length - 1]?.sisa || 0
)

const formatRupiah = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

const saved = () => {
  // console.log('submit', props.data);
  // console.log('log', invoiceDibayar.value, totalBayar.value, props.invoiceList);

  if (!metode.value) {
    alert('Pilih metode pembayaran terlebih dahulu')
    return
  }

  if (!dibayar.value) {
    alert('Masukkan jumlah pembayaran')
    return
  }
  if (dibayar.value > sisaBayar.value) {
    alert(`Pembayaran tidak boleh melebihi sisa hutang` + formatRupiah(sisaBayar.value))
    return
  }

  emit('submit', {
    sale_id: props.data.id,
    customer_id: props.data.customer_id,
    metode_pembayaran: metode.value,
    dibayar: dibayar.value,
    total: dibayar.value,
    keterangan: keterangan.value
  })
}
</script>
