<template>
  <div class="space-y-4 bg-gray-50 p-6 rounded shadow max-w-xl mx-auto mt-10">
    <h2 class="text-xl font-bold">Form Pengeluaran Kas</h2>

    <div>
      <label class="block text-sm font-medium">Tanggal</label>
      <input type="date" v-model="form.tanggal" class="border rounded px-3 py-2 w-full" />
    </div>

    <div>
      <label class="block text-sm font-medium">Akun Kas</label>
      <select v-model="form.kas" class="border rounded px-3 py-2 w-full">
        <option disabled value="">-- Pilih akun kas --</option>
        <option value="kas_kecil">Kas Kecil</option>
        <option value="kas_kasir">Kas Kasir</option>
        <option value="bank_bca">Bank BCA</option>
        <option value="bank_mandiri">Bank Mandiri</option>
      </select>
    </div>

    <div v-if="form.kas === 'kas_kasir'">
      <label class="block text-sm font-medium">Pilih Kasir</label>
      <select v-model="form.kasir_id" class="border rounded px-3 py-2 w-full">
        <option disabled value="">-- Pilih kasir --</option>
        <option v-for="kasir in kasirList" :key="kasir.id" :value="kasir.id">
          {{ kasir.nama }}
        </option>
      </select>
    </div>


    <div>
      <label class="block text-sm font-medium">Jenis Pengeluaran</label>
      <select v-model="form.jenis" class="border rounded px-3 py-2 w-full">
        <option disabled value="">-- Pilih jenis --</option>
        <option value="alat_tulis">Alat Tulis Kantor</option>
        <option value="listrik">Listrik</option>
        <option value="air">Air</option>
        <option value="internet">Internet</option>
        <option value="transport">Transport / Uang Jalan</option>
        <option value="lainnya">Lainnya</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium">Jumlah</label>
      <input type="number" v-model.number="form.jumlah" min="0" class="border rounded px-3 py-2 w-full text-right" />
    </div>

    <div>
      <label class="block text-sm font-medium">Keterangan</label>
      <textarea v-model="form.keterangan" class="border rounded px-3 py-2 w-full" rows="2"></textarea>
    </div>

    <div class="flex justify-end">
      <button @click="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Simpan Pengeluaran
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const form = ref({
  tanggal: new Date().toISOString().slice(0, 10),
  kas: '',
  jenis: '',
  jumlah: 0,
  keterangan: ''
})

const kasirList = ref([
  { id: 'kasir_andi', nama: 'Kasir Andi' },
  { id: 'kasir_rina', nama: 'Kasir Rina' },
  { id: 'kasir_budi', nama: 'Kasir Budi' }
])

const submit = () => {
  if (!form.value.kas || !form.value.jenis || form.value.jumlah <= 0) {
    alert('Silakan lengkapi semua data wajib.')
    return
  }

  if (form.value.kas === 'kas_kasir' && !form.value.kasir_id) {
    alert('Silakan pilih nama kasir.')
    return
  }

  emit('submit', { ...form.value })
}

</script>
