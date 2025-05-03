<template>
  <div class="relative">
    <!-- Tombol ikon untuk membuka dialog -->
    <IconButton
      @click="showDialog = true"
      variant="ghost"
      size="sm"
      :title="label"
      class="relative bg-dark-700 text-white rounded-full shadow-sm border border-gray-700 hover:bg-blue-600/20 hover:border-blue-600/50 transition-all duration-200 date-range-filter-button"
    >
      <template #icon>
        <Icon name="Calendar" class="w-5 h-5" />
        <span v-if="hasActiveFilter" class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
      </template>
    </IconButton>

    <!-- Dialog untuk filter tanggal -->
    <div
      v-if="showDialog"
      class="absolute right-0 top-full mt-2 z-50 bg-dark-700 rounded-lg shadow-lg border border-gray-700 w-[600px] overflow-hidden date-range-filter-dialog"
    >
      <div class="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 class="text-lg font-medium text-white">{{ label }}</h3>
        <button @click="showDialog = false" class="text-gray-400 hover:text-gray-300">
          <Icon name="X" class="w-5 h-5" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <!-- Kolom kiri: Pilihan range -->
        <div class="md:col-span-1 border-r border-gray-700 pr-4">
          <div class="space-y-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="selectPeriod(period.value)"
              class="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-600/20 text-blue-400': selectedPeriod === period.value }"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <!-- Kolom kanan: Kalender -->
        <div class="md:col-span-2 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Dari Tanggal</label>
              <div class="bg-dark-800 rounded-md p-2">
                <div class="calendar-container">
                  <div class="calendar-header flex justify-between items-center mb-2">
                    <button @click="prevMonthStart" class="text-gray-400 hover:text-white">
                      <Icon name="ChevronLeft" class="w-4 h-4" />
                    </button>
                    <span class="text-white">{{ startMonthYear }}</span>
                    <button @click="nextMonthStart" class="text-gray-400 hover:text-white">
                      <Icon name="ChevronRight" class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="calendar-grid grid grid-cols-7 gap-1">
                    <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-center text-xs text-gray-500 py-1">
                      {{ day }}
                    </div>
                    <div v-for="(day, index) in startCalendarDays" :key="`start-${index}`"
                      class="text-center py-1 text-sm rounded-md cursor-pointer"
                      :class="getStartDayClasses(day)"
                      @click="selectStartDate(day)"
                    >
                      {{ day.getDate() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Sampai Tanggal</label>
              <div class="bg-dark-800 rounded-md p-2">
                <div class="calendar-container">
                  <div class="calendar-header flex justify-between items-center mb-2">
                    <button @click="prevMonthEnd" class="text-gray-400 hover:text-white">
                      <Icon name="ChevronLeft" class="w-4 h-4" />
                    </button>
                    <span class="text-white">{{ endMonthYear }}</span>
                    <button @click="nextMonthEnd" class="text-gray-400 hover:text-white">
                      <Icon name="ChevronRight" class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="calendar-grid grid grid-cols-7 gap-1">
                    <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-center text-xs text-gray-500 py-1">
                      {{ day }}
                    </div>
                    <div v-for="(day, index) in endCalendarDays" :key="`end-${index}`"
                      class="text-center py-1 text-sm rounded-md cursor-pointer"
                      :class="getEndDayClasses(day)"
                      @click="selectEndDate(day)"
                    >
                      {{ day.getDate() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-400 italic">
            <p v-if="selectedPeriod !== 'custom'">
              Periode: {{ selectedPeriodLabel }}
            </p>
            <p v-else>
              {{ formatDateRange(tempRange.start_date, tempRange.end_date) }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-gray-700">
        <BaseButton
          @click="resetFilter"
          variant="ghost"
          size="sm"
          class="mr-2 text-gray-300 hover:bg-gray-700"
        >
          Reset
        </BaseButton>
        <BaseButton
          @click="applyFilter"
          variant="primary"
          size="sm"
          class="bg-blue-600 hover:bg-blue-700"
        >
          Terapkan
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Icon from '@/components/ui/Icon.vue'

// Tambahkan event listener untuk menutup dialog saat klik di luar
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  const dialogElement = document.querySelector('.date-range-filter-dialog')
  const buttonElement = document.querySelector('.date-range-filter-button')

  if (showDialog.value && dialogElement && !dialogElement.contains(event.target) && !buttonElement.contains(event.target)) {
    showDialog.value = false
  }
}

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ start_date: null, end_date: null })
  },
  label: {
    type: String,
    default: 'Filter Tanggal'
  },
  defaultPeriod: {
    type: String,
    default: 'month', // 'today', 'week', 'month', 'year', 'custom', or null
    validator: (value) => ['today', 'week', 'month', 'year', 'custom', null].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// State
const showDialog = ref(false)
const selectedPeriod = ref(props.defaultPeriod || null)
const tempRange = ref({ ...props.modelValue })

// Calendar state
const startCalendarDate = ref(new Date())
const endCalendarDate = ref(new Date())

// Computed
const hasActiveFilter = computed(() => {
  return props.modelValue.start_date || props.modelValue.end_date
})

// Daftar periode yang tersedia
const periods = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'year', label: 'Tahun Ini' },
  { value: 'custom', label: 'Kustom' }
]

// Computed untuk label periode yang dipilih
const selectedPeriodLabel = computed(() => {
  const period = periods.find(p => p.value === selectedPeriod.value)
  return period ? period.label : 'Pilih Periode'
})

// Calendar computeds
const startMonthYear = computed(() => {
  const options = { month: 'long', year: 'numeric' }
  return startCalendarDate.value.toLocaleDateString('id-ID', options)
})

const endMonthYear = computed(() => {
  const options = { month: 'long', year: 'numeric' }
  return endCalendarDate.value.toLocaleDateString('id-ID', options)
})

const startCalendarDays = computed(() => {
  return generateCalendarDays(startCalendarDate.value)
})

const endCalendarDays = computed(() => {
  return generateCalendarDays(endCalendarDate.value)
})

// Calendar methods
function generateCalendarDays(date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Array to hold all calendar days
  const days = []

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1)
    days.push(prevMonthDay)
  }

  // Add all days of the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  // Add empty slots for days after the last day of the month to complete the grid
  const remainingSlots = 42 - days.length // 6 rows x 7 days = 42
  for (let i = 1; i <= remainingSlots; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
}

function prevMonthStart() {
  const date = new Date(startCalendarDate.value)
  date.setMonth(date.getMonth() - 1)
  startCalendarDate.value = date
}

function nextMonthStart() {
  const date = new Date(startCalendarDate.value)
  date.setMonth(date.getMonth() + 1)
  startCalendarDate.value = date
}

function prevMonthEnd() {
  const date = new Date(endCalendarDate.value)
  date.setMonth(date.getMonth() - 1)
  endCalendarDate.value = date
}

function nextMonthEnd() {
  const date = new Date(endCalendarDate.value)
  date.setMonth(date.getMonth() + 1)
  endCalendarDate.value = date
}

function selectStartDate(day) {
  const dateStr = day.toISOString().split('T')[0]
  tempRange.value.start_date = dateStr
  selectedPeriod.value = 'custom'

  // If end date is before start date, set end date to start date
  if (tempRange.value.end_date && tempRange.value.end_date < dateStr) {
    tempRange.value.end_date = dateStr
  }
}

function selectEndDate(day) {
  const dateStr = day.toISOString().split('T')[0]
  tempRange.value.end_date = dateStr
  selectedPeriod.value = 'custom'

  // If start date is after end date, set start date to end date
  if (tempRange.value.start_date && tempRange.value.start_date > dateStr) {
    tempRange.value.start_date = dateStr
  }
}

function getStartDayClasses(day) {
  const dateStr = day.toISOString().split('T')[0]
  const isCurrentMonth = day.getMonth() === startCalendarDate.value.getMonth()
  const isSelected = dateStr === tempRange.value.start_date
  const isInRange = tempRange.value.start_date && tempRange.value.end_date &&
                    dateStr >= tempRange.value.start_date && dateStr <= tempRange.value.end_date

  return {
    'text-gray-500': !isCurrentMonth,
    'text-white': isCurrentMonth && !isSelected && !isInRange,
    'bg-blue-600 text-white': isSelected,
    'bg-blue-600/20 text-blue-300': !isSelected && isInRange,
    'hover:bg-gray-700': !isSelected
  }
}

function getEndDayClasses(day) {
  const dateStr = day.toISOString().split('T')[0]
  const isCurrentMonth = day.getMonth() === endCalendarDate.value.getMonth()
  const isSelected = dateStr === tempRange.value.end_date
  const isInRange = tempRange.value.start_date && tempRange.value.end_date &&
                    dateStr >= tempRange.value.start_date && dateStr <= tempRange.value.end_date

  return {
    'text-gray-500': !isCurrentMonth,
    'text-white': isCurrentMonth && !isSelected && !isInRange,
    'bg-blue-600 text-white': isSelected,
    'bg-blue-600/20 text-blue-300': !isSelected && isInRange,
    'hover:bg-gray-700': !isSelected
  }
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return ''

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

// Watch untuk perubahan modelValue
watch(() => props.modelValue, (newValue) => {
  tempRange.value = { ...newValue }
  detectSelectedPeriod()

  // Update calendar views if dates are set
  if (newValue.start_date) {
    startCalendarDate.value = new Date(newValue.start_date)
  }
  if (newValue.end_date) {
    endCalendarDate.value = new Date(newValue.end_date)
  }
}, { deep: true })

// Pilih periode
const selectPeriod = (period) => {
  selectedPeriod.value = period

  if (period !== 'custom') {
    const now = new Date()
    let startDate, endDate

    switch(period) {
      case 'today':
        startDate = now.toISOString().split('T')[0]
        endDate = startDate
        break
      case 'week':
        // Mendapatkan hari Senin dari minggu ini
        const day = now.getDay()
        const diff = now.getDate() - day + (day === 0 ? -6 : 1)
        const weekStart = new Date(new Date(now).setDate(diff))
        startDate = weekStart.toISOString().split('T')[0]
        // Mendapatkan hari Minggu dari minggu ini
        const weekEnd = new Date(new Date(weekStart).setDate(weekStart.getDate() + 6))
        endDate = weekEnd.toISOString().split('T')[0]
        break
      case 'month':
        // Tanggal 1 bulan ini
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        // Tanggal terakhir bulan ini
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'year':
        // 1 Januari tahun ini
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        // 31 Desember tahun ini
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
    }

    tempRange.value = { start_date: startDate, end_date: endDate }

    // Update calendar views
    if (startDate) {
      startCalendarDate.value = new Date(startDate)
    }
    if (endDate) {
      endCalendarDate.value = new Date(endDate)
    }
  }
}

// Terapkan filter
const applyFilter = () => {
  emit('update:modelValue', { ...tempRange.value })
  // Hanya panggil event 'change' setelah model value diupdate
  nextTick(() => {
    emit('change')
    showDialog.value = false
  })
}

// Reset filter
const resetFilter = () => {
  selectedPeriod.value = null
  tempRange.value = { start_date: null, end_date: null }
  emit('update:modelValue', { start_date: null, end_date: null })
  emit('change')
  showDialog.value = false
}

// Deteksi periode yang dipilih berdasarkan tanggal
const detectSelectedPeriod = () => {
  if (!props.modelValue.start_date || !props.modelValue.end_date) {
    selectedPeriod.value = null
    return
  }

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // Cek hari ini
  if (props.modelValue.start_date === today && props.modelValue.end_date === today) {
    selectedPeriod.value = 'today'
    return
  }

  // Cek minggu ini
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(new Date(now).setDate(diff))
  const weekStartStr = weekStart.toISOString().split('T')[0]
  const weekEnd = new Date(new Date(weekStart).setDate(weekStart.getDate() + 6))
  const weekEndStr = weekEnd.toISOString().split('T')[0]

  if (props.modelValue.start_date === weekStartStr && props.modelValue.end_date === weekEndStr) {
    selectedPeriod.value = 'week'
    return
  }

  // Cek bulan ini
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  if (props.modelValue.start_date === monthStart && props.modelValue.end_date === monthEnd) {
    selectedPeriod.value = 'month'
    return
  }

  // Cek tahun ini
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
  const yearEnd = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]

  if (props.modelValue.start_date === yearStart && props.modelValue.end_date === yearEnd) {
    selectedPeriod.value = 'year'
    return
  }

  // Jika tidak cocok dengan periode yang ada, maka custom
  selectedPeriod.value = 'custom'
}

// Inisialisasi
onMounted(() => {
  if (props.defaultPeriod && props.defaultPeriod !== 'custom') {
    selectPeriod(props.defaultPeriod)
  } else {
    detectSelectedPeriod()
  }
})
</script>

<style scoped>
/* Tambahkan animasi untuk dialog */
.absolute {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styling untuk tombol yang aktif */
.bg-blue-600\/20 {
  background-color: rgba(37, 99, 235, 0.2);
}

/* Styling untuk hover state */
.hover\:bg-blue-600\/20:hover {
  background-color: rgba(37, 99, 235, 0.2);
}

.hover\:border-blue-600\/50:hover {
  border-color: rgba(37, 99, 235, 0.5);
}

/* Styling untuk kalender */
.calendar-container {
  user-select: none;
}

.calendar-grid > div {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
