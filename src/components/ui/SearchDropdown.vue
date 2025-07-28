<template>
  <div class="relative">
    <BaseInput v-model="searchQuery" :placeholder="placeholder" class="pr-10" :debounce="debounce"
      @update:model-value="onSearch" @keydown="handleKeydown" ref="inputRef">
      <template #append>
        <i :class="[isLoading ? 'ri-loader-4-line animate-spin' : 'ri-search-line', 'text-secondary-400']"></i>
      </template>
    </BaseInput>

    <!-- Results Dropdown -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <div v-if="showResults"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-dark-700 rounded-md shadow-lg max-h-60 overflow-auto border border-secondary-200 dark:border-secondary-700">
        <div v-if="isLoading" class="p-4 text-center text-secondary-500 dark:text-secondary-400">
          <div class="flex justify-center items-center space-x-2">
            <i class="ri-loader-4-line animate-spin text-xl"></i>
            <span>Mencari...</span>
          </div>
        </div>
        <div v-else-if="displayItems.length > 0">
          <div v-for="(item, index) in displayItems" :key="getItemKey(item, index)" @click="onItemSelect(item)"
            @mouseover="selectedIndex = index"
            class="search-dropdown-item p-3 hover:bg-secondary-100 dark:hover:bg-secondary-700 cursor-pointer transition-colors duration-150 border-b border-secondary-100 dark:border-secondary-700 last:border-0"
            :class="{ 'selected bg-secondary-100 dark:bg-secondary-700': selectedIndex === index }">
            <slot name="item" :item="item">
              <div class="font-medium text-secondary-900 dark:text-white">{{ getItemLabel(item) }}</div>
            </slot>
          </div>
        </div>
        <div v-else-if="searchQuery.length >= minSearchLength"
          class="p-4 text-center text-secondary-500 dark:text-secondary-400">
          <i class="ri-search-line text-xl mb-2 block"></i>
          <p>{{ notFoundText }}</p>
          <div v-if="showAddButton" class="mt-3 flex flex-col gap-2">
            <p class="text-xs">{{ notFoundSubtext }}</p>
            <button @click="onAddNew"
              class="mt-1 text-sm px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5 mx-auto">
              <i class="ri-add-line"></i> {{ addButtonText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
// import BaseInput from '@/components/ui/BaseInput.vue'
import { api } from '@/services/api'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  debounce: {
    type: Number,
    default: 300
  },
  minSearchLength: {
    type: Number,
    default: 3
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  itemLabel: {
    type: String,
    default: 'name'
  },
  notFoundText: {
    type: String,
    default: 'No results found'
  },
  notFoundSubtext: {
    type: String,
    default: 'Try different keywords or add a new item'
  },
  addButtonText: {
    type: String,
    default: 'Add New Item'
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Tambahkan prop baru untuk URL API
  apiUrl: {
    type: String,
    default: ''
  },
  // Parameter tambahan untuk API
  apiParams: {
    type: Object,
    default: () => ({})
  },
  // Path untuk mengakses data dari respons API
  apiResponsePath: {
    type: String,
    default: 'data'
  },
  // Apakah menggunakan API internal
  useApi: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'select', 'add-new', 'items-loaded'])

const searchQuery = ref(props.modelValue)
const showResults = ref(false)
const inputRef = ref(null)
const internalLoading = ref(false)
const internalItems = ref([])
// Tambahkan state untuk melacak item yang dipilih
const selectedIndex = ref(-1)


// Computed untuk menentukan items yang akan ditampilkan
const displayItems = computed(() => {
  return props.useApi ? internalItems.value : props.items
})

// Computed untuk menentukan status loading
const isLoading = computed(() => {
  return props.useApi ? internalLoading.value : props.loading
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Watch for internal changes to searchQuery
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    showResults.value = false
  }
})

// Watch for changes in items to ensure smooth transitions
watch(() => props.items, () => {
  if (searchQuery.value.length >= props.minSearchLength) {
    showResults.value = true
  }
}, { deep: true })

// Fungsi untuk fetch data dari API
const fetchFromApi = async (query) => {
  if (!props.apiUrl || query.length < props.minSearchLength) return

  internalLoading.value = true

  try {
    const params = {
      ...props.apiParams,
      q: query
    }

    const response = await api.get(props.apiUrl, { params })

    // Ekstrak data dari respons berdasarkan apiResponsePath
    let data = response
    // console.log('response', response);

    const pathSegments = props.apiResponsePath.split('.')
    // console.log('pathSegments', pathSegments);

    for (const segment of pathSegments) {
      // console.log('segment', segment);
      data = data[segment]
      // console.log('data', data);
      if (!data) break
    }

    internalItems.value = Array.isArray(data) ? data : []
    // console.log('internalItems', internalItems);
    emit('items-loaded', internalItems.value)
  } catch (error) {
    console.error(`Error fetching data from ${props.apiUrl}:`, error)
    internalItems.value = []
  } finally {
    internalLoading.value = false
  }
}

const onSearch = () => {
  if ((searchQuery.value.length >= props.minSearchLength) && searchQuery.value.trim()) {
    if (props.useApi) {
      fetchFromApi(searchQuery.value)
    } else {
      emit('search', searchQuery.value)
    }
    showResults.value = true
  } else {
    showResults.value = false
  }
}

const onItemSelect = (item) => {
  emit('select', item)
  showResults.value = false
}

const onAddNew = () => {
  emit('add-new', searchQuery.value)
  showResults.value = false
}

const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}

const getItemLabel = (item) => {
  return item[props.itemLabel] || 'Unnamed'
}

// Fungsi untuk memfokuskan input
const focus = () => {
  if (inputRef.value && inputRef.value.$el) {
    // Jika inputRef adalah komponen (BaseInput), coba akses elemen input di dalamnya
    const inputElement = inputRef.value.$el.querySelector('input')
    if (inputElement) {
      inputElement.focus()
      return
    }
  }

  // Fallback: coba fokus langsung jika inputRef adalah elemen DOM
  if (inputRef.value && typeof inputRef.value.focus === 'function') {
    inputRef.value.focus()
  }
}

const closeDropdown = () => {
  showResults.value = false
  selectedIndex.value = -1
}

// Tambahkan handler keyboard
const handleKeydown = (event) => {
  // Jika dropdown tidak ditampilkan dan tombol panah bawah ditekan, tampilkan dropdown
  if (!showResults.value) {
    if (event.key === 'ArrowDown') {
      if (searchQuery.value.length >= props.minSearchLength) {
        showResults.value = true
        event.preventDefault()
      }
    }
    return
  }

  const items = displayItems.value

  switch (event.key) {
    case 'ArrowDown':
      // Navigasi ke bawah
      event.preventDefault()
      if (items.length > 0) {
        selectedIndex.value = (selectedIndex.value + 1) % items.length
        scrollToSelectedItem()
      }
      break
    case 'ArrowUp':
      // Navigasi ke atas
      event.preventDefault()
      if (items.length > 0) {
        selectedIndex.value = selectedIndex.value <= 0 ? items.length - 1 : selectedIndex.value - 1
        scrollToSelectedItem()
      }
      break
    case 'Enter':
      // Pilih item yang dipilih
      event.preventDefault()

      if (items.length === 1) {
        onItemSelect(items[0])

      } else if (selectedIndex.value > -1 && items.length > selectedIndex.value) {
        onItemSelect(items[selectedIndex.value])
      }
      break
    case 'Escape':
      // Tutup dropdown
      event.preventDefault()
      showResults.value = false
      selectedIndex.value = -1
      break
  }
}

// Fungsi untuk scroll ke item yang dipilih
const scrollToSelectedItem = () => {
  nextTick(() => {
    const selectedElement = document.querySelector('.search-dropdown-item.selected')
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Reset selectedIndex saat hasil pencarian berubah
watch(displayItems, () => {
  selectedIndex.value = -1
})

// Reset selectedIndex saat dropdown ditutup
watch(showResults, (newValue) => {
  if (!newValue) {
    selectedIndex.value = -1
  }
})

// Expose methods to parent component
defineExpose({
  focus,
  closeDropdown,
  fetchFromApi
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
