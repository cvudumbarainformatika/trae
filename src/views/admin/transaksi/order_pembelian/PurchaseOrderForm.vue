<template>
  <BaseDialog 
    v-model="showDialog" 
    title="Order Pembelian Baru"
    max-width="2xl"
    @close="resetForm"
  >
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseSelect 
          v-model="form.supplier_id" 
          label="Supplier" 
          :options="suppliers"
          option-label="name"
          option-value="id"
          required
        />
        
        <BaseInput 
          v-model="form.po_number" 
          label="Nomor PO" 
          required
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDatePicker 
          v-model="form.date" 
          label="Tanggal Order" 
          required
        />
        
        <BaseDatePicker 
          v-model="form.due_date" 
          label="Jatuh Tempo" 
          required
        />
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Items</h3>
        
        <div 
          v-for="(item, index) in form.items" 
          :key="index"
          class="mb-6 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseSelect 
              v-model="item.product_id" 
              label="Produk" 
              :options="products"
              option-label="name"
              option-value="id"
              required
            />
            
            <BaseInput 
              v-model="item.quantity" 
              label="Jumlah" 
              type="number" 
              min="1"
              required
            />
            
            <BaseInput 
              v-model="item.price" 
              label="Harga" 
              type="number" 
              min="0"
              required
            />
            
            <div class="flex items-end">
              <button 
                type="button" 
                @click="removeItem(index)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="ri-delete-bin-line text-lg" />
              </button>
            </div>
          </div>
        </div>
        
        <button 
          type="button" 
          @click="addItem"
          class="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <i class="ri-add-line mr-1" /> Tambah Item
        </button>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton 
          variant="secondary" 
          @click="showDialog = false"
        >
          Batal
        </BaseButton>
        
        <BaseButton 
          :loading="loading"
          @click="submitForm"
        >
          Simpan
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const loading = ref(false)
const suppliers = ref([])
const products = ref([])

const form = ref({
  supplier_id: '',
  po_number: '',
  date: new Date().toISOString().split('T')[0],
  due_date: '',
  items: [
    { product_id: '', quantity: 1, price: 0 }
  ]
})

const fetchSuppliers = async () => {
  try {
    const { data } = await api.get('/suppliers')
    suppliers.value = data.data
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  }
}

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    products.value = data.data
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const addItem = () => {
  form.value.items.push({ product_id: '', quantity: 1, price: 0 })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    supplier_id: '',
    po_number: '',
    date: new Date().toISOString().split('T')[0],
  due_date: '',
    items: [
      { product_id: '', quantity: 1, price: 0 }
    ]
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    await api.post('/purchase-orders', form.value)
    emit('success')
    showDialog.value = false
  } catch (error) {
    console.error('Error creating purchase order:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSuppliers()
  fetchProducts()
})
</script>