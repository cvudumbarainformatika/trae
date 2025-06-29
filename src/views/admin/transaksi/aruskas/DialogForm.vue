<template>
  <BaseDialog title="Arus Kas Baru" max-width="3xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">

          <form @submit.prevent="submit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                <input type="date" v-model="form.tanggal"
                  class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  required />
              </div>

              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tipe</label>
                <select v-model="form.tipe" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white " required>
                  <option value="in">Masuk</option>
                  <option value="out">Keluar</option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Kas</label>
                <select v-model="form.kas_id" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white " required>
                  <option v-for="kas in kasList" :key="kas.id" :value="kas.id">{{ kas.nama }} ({{ kas.tipe }})
                  </option>
                </select>
              </div>

              <div v-if="selectedKas?.tipe === 'kasir'">
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Kasir</label>
                <select v-model="form.kasir_id" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white" required>
                  <option v-for="kasir in kasirList" :key="kasir.id" :value="kasir.id">{{ kasir.nama }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
                <input type="number" v-model.number="form.jumlah" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white " min="0" required />
              </div>

              <!-- <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                <input type="text" v-model="form.kategori" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white input" />
              </div> -->

              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
                <textarea v-model="form.keterangan" class="w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-900
         text-gray-800 dark:text-white input"></textarea>
              </div>

              <div class="pt-4">
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  :disabled="storeForm.loading">
                  <span>Simpan </span>
                  <!-- Spinner -->
                  <svg v-if="storeForm.loading" class="animate-spin h-5 w-5 text-white absolute right-3"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>

                </button>
              </div>
            </div>
          </form>



        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
// import ReturnSummary from './ReturnSummary.vue'
import { useCashFlowFormStore } from '@/stores/transaksi/aruskas/form'
import { useKasStore } from '@/stores/admin/kas'
import { useUsersStore } from '@/stores/admin/users'


const storeForm = useCashFlowFormStore()
const storeKas = useKasStore()
const storeUsers = useUsersStore()
const emit = defineEmits(['close'])


const kasList = computed(() => storeKas.items.sort((a, b) => a.id - b.id))

const selectedKas = computed(() => {
  return kasList.value.find(k => k.id === form.value.kas_id) || null
})

const kasirList = computed(() => storeUsers.items.filter(u => u.role === 'kasir'))

const form = ref({
  tanggal: new Date().toISOString().slice(0, 10),
  tipe: 'keluar',
  kas_id: 1,
  kasir_id: null,
  jumlah: 0,
  kategori: '',
  keterangan: '',
})


const submit = () => {
  // console.log('Kas flowa:', form.value)
  // Kirim ke backend
  storeForm.simpan(form.value)
}




const closeDialog = () => {
  storeForm.item = null
  emit('close')
}


</script>
