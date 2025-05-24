<template>
  <form class="space-y-4 max-w-xl mx-auto">
    <h2 class="text-lg font-semibold mb-2">Form Penjualan</h2>
    <BaseSelect label="Customer" v-model="form.customer_id" :options="customerOptions" />
    <BaseInput label="Referensi" v-model="form.reference" />
    <BaseInput label="Catatan" v-model="form.notes" />
    <BaseInput label="Diskon" type="number" v-model="form.discount" />
    <BaseInput label="Pajak" type="number" v-model="form.tax" />
    <BaseInput label="Metode Pembayaran" v-model="form.payment_method" />
    <div>
      <label class="block font-medium mb-1">Barang</label>
      <!-- Komponen tabel atau input barang -->
    </div>
    <div class="flex justify-end gap-2">
      <BaseButton color="primary" @click.prevent="submit">Simpan</BaseButton>
      <BaseButton color="secondary" @click.prevent="reset">Reset</BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useSalesFormStore } from '@/stores/transaksi/penjualan/form'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const formStore = useSalesFormStore()
const form = formStore
const customerOptions = ref([]) // TODO: fetch customer list

function submit() {
  // TODO: submit logic
}
function reset() {
  formStore.resetForm()
}
</script>
