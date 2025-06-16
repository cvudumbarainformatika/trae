<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white relative animate-slide-up"
        @keydown.prevent.stop="handleKeyDown" tabindex="0" ref="modalContainer">
        <h2 class="text-xl font-semibold mb-4 text-center border-b border-gray-700 pb-2">
          Pembayaran Transaksi
        </h2>

        <form @submit.prevent="submitPayment" class="space-y-4">
          <!-- Payment Method Radio -->
          <div>
            <label class="block mb-2 text-sm font-medium">Metode Pembayaran</label>
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-3">
                <input ref="el => registerRef(el)" type="radio" value="cash" v-model="form.payment_method"
                  class="form-radio text-emerald-500 focus:ring-2 focus:ring-emerald-400" />
                <span>Cash</span>
              </label>
              <label class="flex items-center gap-3">
                <input ref="el => registerRef(el)" type="radio" value="qris" v-model="form.payment_method"
                  class="form-radio text-emerald-500 focus:ring-2 focus:ring-emerald-400" />
                <span>QRIS</span>
              </label>
              <label class="flex items-center gap-3">
                <input ref="el => registerRef(el)" type="radio" value="kredit" v-model="form.payment_method"
                  class="form-radio text-emerald-500 focus:ring-2 focus:ring-emerald-400" />
                <span>Kredit</span>
              </label>
            </div>
          </div>

          <!-- QRIS -->
          <div v-if="form.payment_method === 'qris'" class="bg-gray-700 p-3 rounded">
            <p class="text-sm text-gray-300">Scan QR Code untuk membayar:</p>
            <div class="mt-3 flex justify-center">
              <img src="/public/images/qris.png" alt="QRIS QR Code" class="w-32 h-32 rounded" />
            </div>
          </div>

          <!-- Kredit -->
          <div v-if="form.payment_method === 'kredit'" class="bg-gray-700 p-3 rounded space-y-2">
            <div>
              <label class="text-sm block mb-1">Nomor Kartu Kredit</label>
              <input ref="el => registerRef(el)" type="text"
                class="w-full p-2 rounded bg-gray-600 text-white focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label class="text-sm block mb-1">Jumlah Cicilan</label>
              <select ref="el => registerRef(el)"
                class="w-full p-2 rounded bg-gray-600 text-white focus:ring-2 focus:ring-emerald-400">
                <option value="3">3x</option>
                <option value="6">6x</option>
                <option value="12">12x</option>
              </select>
            </div>
          </div>

          <!-- Diskon -->
          <div>
            <label class="block mb-1 text-sm">Diskon (Rp)</label>
            <input ref="el => registerRef(el)" v-model.number="form.discount" type="number"
              class="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-emerald-400" />
          </div>

          <!-- Pajak -->
          <div>
            <label class="block mb-1 text-sm">Pajak (Rp)</label>
            <input ref="el => registerRef(el)" v-model.number="form.tax" type="number"
              class="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-emerald-400" />
          </div>

          <!-- Notes -->
          <div>
            <label class="block mb-1 text-sm">Catatan</label>
            <textarea ref="el => registerRef(el)" v-model="form.notes" rows="2"
              class="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-emerald-400"></textarea>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center border-t border-gray-600 pt-4">
            <span>Total Dibayar:</span>
            <span class="text-lg font-bold text-emerald-400">
              Rp {{ totalWithAdjustments.toLocaleString() }}
            </span>
          </div>
        </form>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <button ref="el => registerRef(el)" type="button" @click="closeModal"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
            Batal (Esc)
          </button>
          <button ref="el => registerRef(el)" type="submit" @click="submitPayment"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white">
            Bayar (Enter)
          </button>
        </div>

        <!-- Close X -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: Boolean,
  items: Array,
  customerId: Number,
  uniqueCode: String,
  item: Object
})

const emit = defineEmits(['close', 'submit'])

const modalContainer = ref(null)
const focusableRefs = ref([])

const registerRef = (el) => {
  if (el && !focusableRefs.value.includes(el)) {
    focusableRefs.value.push(el)
  }
}

const form = ref({
  cashier_id: null,
  category: 'pelanggan',
  customer_id: props.customerId,
  date: null,
  discount: 0,
  items: props.items,
  notes: '',
  paid: 0,
  payment_method: 'cash',
  tax: 0,
  unique_code: props.uniqueCode,
})

const total = computed(() =>
  form.value.items.reduce((sum, item) => sum + item.qty * item.price, 0)
)

const totalWithAdjustments = computed(() =>
  total.value - Number(form.value.discount || 0) + Number(form.value.tax || 0)
)

const submitPayment = () => {
  form.value.paid = totalWithAdjustments.value
  form.value.date = new Date().toISOString()
  emit('submit', { ...form.value })
  emit('close')
}

const closeModal = () => {
  emit('close')
}

const handleKeyDown = (e) => {
  // console.log('Key pressed:', e.key);

  if (e.key === 'Enter') {
    e.preventDefault()
    focusNext()
  }

  if (e.key === 'Escape') {
    closeModal()
  }

  if (e.ctrlKey) {
    switch (e.key) {
      case '1':
        form.value.payment_method = 'cash'
        break
      case '2':
        form.value.payment_method = 'qris'
        break
      case '3':
        form.value.payment_method = 'kredit'
        break
    }
  }
}

const focusNext = () => {
  const active = document.activeElement
  // console.log('Active element:', active);

  const i = focusableRefs.value.findIndex((el) => el === active)
  if (i !== -1 && focusableRefs.value[i + 1]) {
    focusableRefs.value[i + 1].focus()
  }
}

onMounted(() => {
  nextTick(() => {
    modalContainer.value?.focus()
  })
})

onBeforeUnmount(() => {
  focusableRefs.value = []
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
