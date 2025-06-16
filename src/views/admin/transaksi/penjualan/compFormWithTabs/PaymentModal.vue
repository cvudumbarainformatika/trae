<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    @keydown="handleKeydown" tabindex="0" ref="modalRef">
    <div class="bg-gray-800 p-4 rounded-xl w-full max-w-xl text-white space-y-6 animate-slide-up">
      <div class="p-8 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">

        <form @submit.prevent="submit" class="space-y-4">
          <!-- Metode Pembayaran -->
          <div>
            <label class="block mb-2 font-semibold">Metode Pembayaran</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.payment_method" value="cash" name="payment" />
                Cash <span class="text-xs text-gray-400">(Ctrl+1)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.payment_method" value="qris" name="payment" />
                QRIS <span class="text-xs text-gray-400">(Ctrl+2)</span>
              </label>
              <label v-if="item.category !== 'umum'" class="flex items-center gap-2">
                <input type="radio" v-model="form.payment_method" value="kredit" name="payment" />
                Kredit <span class="text-xs text-gray-400">(Ctrl+3)</span>
              </label>
            </div>
          </div>

          <!-- Separator -->
          <hr class="border-gray-600" />

          <!-- Diskon dan Pajak -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block mb-1">
                Diskon <span class="text-xs text-gray-400"> (Rp. {{ formatCurrency(form.discount) }})</span>
              </label>
              <input v-model="formattedDiscount" @input="onCurrencyInput('discount', $event)" ref="diskonRef"
                type="text" class="w-full p-2 rounded bg-gray-700 focus:outline focus:outline-2 focus:outline-white"
                placeholder="0" />
            </div>
            <div class="flex-1">
              <label class="block mb-1">
                Pajak <span class="text-xs text-gray-400"> ({{ form.tax }}%)</span>
              </label>
              <input v-model="form.tax" ref="pajakRef" type="number"
                class="w-full p-2 rounded bg-gray-700 focus:outline focus:outline-2 focus:outline-white"
                placeholder="0" />
            </div>
          </div>

          <!-- Separator -->
          <hr class="border-gray-600" />



          <!-- Pembayaran / DP / Kembali -->
          <div class="space-y-2">
            <div v-if="form.payment_method === 'cash' || form.payment_method === 'qris'">
              <label class="block mb-1">Pembayaran</label>
              <input v-model="formattedPembayaran" @input="onCurrencyInput('pembayaran', $event)" ref="bayarRef"
                type="text"
                class="w-full text-2xl p-3 rounded bg-gray-700 focus:outline focus:outline-2 focus:outline-white"
                placeholder="0" />
              <!-- <div class="mt-1">Kembali: Rp. {{ kembali >= 0 ? formatCurrency(kembali) : '0' }}</div> -->
              <div v-if="kembali >= 0" class="mt-2 text-green-400 font-semibold">
                Kembali: Rp. {{ formatCurrency(kembali) }}
              </div>
              <div v-if="kembali < 0" class="mt-2 text-red-400 font-semibold">
                Pembayaran kurang: Rp. {{ formatCurrency(Math.abs(kembali)) }}
              </div>
            </div>

            <div v-else-if="form.payment_method === 'kredit'">
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block mb-1">DP</label>
                  <input v-model="formattedDP" @input="onCurrencyInput('dp', $event)" type="text" ref="dpRef"
                    class="w-full p-2 rounded bg-gray-700 focus:outline focus:outline-2 focus:outline-white"
                    placeholder="0" />
                </div>
                <div class="flex-1">
                  <label class="block mb-1">Tempo (hari)</label>
                  <input v-model.number="form.tempo" type="number"
                    class="w-full p-2 rounded bg-gray-700 focus:outline focus:outline-2 focus:outline-white" />
                </div>
              </div>
              <div class="mt-2">Sisa Pembayaran: Rp. {{ formatCurrency(totalBayar - form.dp) }}</div>
            </div>
          </div>


          <!-- Separator -->
          <hr class="border-gray-600" />

          <!-- Rincian Total -->
          <div class="text-right">
            <div>Total Awal : Rp. {{ formatCurrency(totalAwal) }}</div>
            <div>Diskon : <span class="text-red-400">Rp. {{ formatCurrency(form.discount) }}</span></div>
            <div>Pajak : <span class="text-emerald-400">Rp. {{ formatCurrency(pajakNilai) }}</span></div>
            <div class="text-lg font-bold">Total Bayar : <span class="text-emerald-400">Rp. {{
              formatCurrency(totalBayar) }}</span></div>
          </div>


          <!-- Separator -->
          <hr class="border-gray-600" />

          <!-- Tombol -->
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="bg-red-600 px-4 py-2 rounded" @click="batal">
              Batal <span class="text-xs text-gray-100">(Esc)</span>
            </button>
            <button type="submit"
              class="bg-emerald-500 px-4 py-2 rounded disabled:opacity-50 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-white"
              :class="{
                'animate-pulse': bolehBayar,
                'cursor-pointer': bolehBayar,
                'cursor-not-allowed': !bolehBayar
              }" :disabled="!bolehBayar || loading">
              <!-- Bayar <span class="text-xs text-gray-100">(Ctrl+Enter)</span> -->
              <span v-if="!loading">Bayar <span class="text-xs text-gray-100">(Ctrl+Enter)</span></span>
              <span v-else class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memproses...
              </span>



            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'




const props = defineProps({
  show: Boolean,
  items: Array,
  customerId: Number,
  uniqueCode: String,
  item: Object,
  loading: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['close', 'submit'])
const modalRef = ref(null)
const diskonRef = ref(null)
const pajakRef = ref(null)
const bayarRef = ref(null)
const dpRef = ref(null)

const form = ref({
  payment_method: 'cash',
  discount: props.item.discount || 0,
  tax: props.item.tax || 0,
  pembayaran: 0,
  dp: 0,
  tempo: 30
})

const totalAwal = props.items.reduce((sum, item) => sum + item.qty * item.price, 0)
const pajakNilai = computed(() => totalAwal * (form.value.tax / 100))
const totalBayar = computed(() => Math.max(0, totalAwal - form.value.discount + pajakNilai.value))
const kembali = computed(() => form.value.pembayaran - totalBayar.value)
const bolehBayar = computed(() => {
  if (form.value.payment_method === 'cash' || form.value.payment_method === 'qris') {
    return form.value.pembayaran >= totalBayar.value
  }
  if (form.value.payment_method === 'kredit') {
    return form.value.dp >= 0 && form.value.tempo > 0
  }
  return false
})

const formattedPembayaran = computed({
  get: () => formatCurrency(form.value.pembayaran),
  set: val => form.value.pembayaran = parseCurrency(val)
})
const formattedDiscount = computed({
  get: () => formatCurrency(form.value.discount),
  set: val => form.value.discount = parseCurrency(val)
})
const formattedDP = computed({
  get: () => formatCurrency(form.value.dp),
  set: val => form.value.dp = parseCurrency(val)
})

function handleKeydown(e) {
  const focusableSelector = 'input:not([type=hidden]), button, select'
  const focusables = modalRef.value?.querySelectorAll(focusableSelector)
  const list = Array.from(focusables)
  const current = document.activeElement
  const index = list.findIndex(el => el === current)

  if (e.key === 'Enter' && !e.ctrlKey) {
    e.preventDefault()
    const next = list[index + 1]
    if (next) next.focus()
  }

  if (e.ctrlKey) {
    if (e.key === '1') form.value.payment_method = 'cash'
    if (e.key === '2') form.value.payment_method = 'qris'
    if (e.key === '3' && props.item.category === 'pelanggan') form.value.payment_method = 'kredit'
    if (e.key === 'Enter' && bolehBayar.value) submit()
    if (e.key === 'd') nextTick(() => diskonRef.value?.focus())
    if (e.key === 'p') nextTick(() => pajakRef.value?.focus())
  }

  if (e.key === 'Escape') batal()
}

function formatCurrency(value) {
  return value.toLocaleString('id-ID')
}
function parseCurrency(value) {
  return parseInt(value.replace(/[^\d]/g, '')) || 0
}

function onCurrencyInput(field, event) {
  form.value[field] = parseCurrency(event.target.value)
  event.target.value = formatCurrency(form.value[field])
}

function submit() {
  console.log('submit', form.value);

  emit('submit', { ...form.value, total: totalBayar.value, kembali: kembali.value })
  // emit('close')
}
function batal() {
  // console.log('batal');

  emit('close')
}

function triggerShake() {
  shake.value = true
  setTimeout(() => shake.value = false, 600)
}

onMounted(() => {
  console.log('props', props.item);
  initForm()

  nextTick(() => bayarRef.value?.focus())
})

function initForm() {
  form.value.discount = props.item.discount || 0
  form.value.tax = props.item.tax || 0
  form.value.payment_method = 'cash'

  form.value.pembayaran = 0
  form.value.dp = 0
  form.value.tempo = 30
}

watch(
  () => form.value.payment_method,
  (val) => {
    console.log('form.value.payment_method', val);

    nextTick().then(() => {
      if ((val === 'cash' || val === 'qris') && bayarRef.value) {
        bayarRef.value.focus()
      } else if (val === 'kredit' && dpRef.value) {
        dpRef.value?.focus()
      } else {
        bayarRef.value?.focus()
      }
    })
  },
  { immediate: true }
)

watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick(() => bayarRef.value?.focus())
    }
  },
  { immediate: true }
)


</script>

<style scoped>
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #ffffff;
  box-shadow: 0 0 10px #ffffff80;
}



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



@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-8px);
  }

  40%,
  80% {
    transform: translateX(8px);
  }
}

.animate-shake {
  animation: shake 0.6s ease;
}
</style>
