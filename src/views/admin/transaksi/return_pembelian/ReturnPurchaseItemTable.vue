<template>
  <div>
    <div v-if="items.length > 0"
      class="overflow-x-auto rounded-lg shadow relative border border-secondary-200 dark:border-secondary-700">
      <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-secondary-700 w-full text-sm ">
        <thead class="bg-gray-100 dark:bg-secondary-900 text-gray-200 dark:text-gray-500">
          <tr>
            <th class="px-4 py-2">Barang</th>
            <th class="px-4 py-2 text-center">Jumlah</th>
            <th class="px-4 py-2 text-center">Retur</th>
            <th class="px-4 py-2 text-left">Alasan Retur</th>
          </tr>
        </thead>
        <tbody class="text-gray-200 dark:text-gray-500">
          <tr v-for="item in items" :key="item.id" class="border-t border-gray-200 dark:border-secondary-700">
            <td class="px-4 py-2">{{ item?.product?.name }}</td>
            <td class="px-4 py-2 text-center">{{ item.qty }}</td>
            <td class="px-4 py-2 text-center">
              <BaseInput class="w-20" v-model.number="item.return_qty" type="number" min="0" placeholder="0" />
            </td>
            <td class="px-4 py-2">
              <!-- <input v-model="item.reason" type="text" placeholder="Misal: rusak"
                class="w-full border px-2 py-1 rounded" /> -->
              <BaseInput class="w-full" v-model="item.alasan" type="text" placeholder="Misal: rusak" />
            </td>
          </tr>
        </tbody>
      </table>


      <hr class="border-secondary-200 dark:border-secondary-700 " />


      <div class=" bg-gray-50 dark:bg-secondary-800 p-6 rounded-lg shadow text-gray-800 dark:text-gray-200">
        <h2 class="font-semibold text-lg mb-2">Ringkasan Retur Pembelian</h2>
        <ul>
          <li v-for="ret in returnedItems" :key="ret.id" class="text-sm">
            <span class="text-primary-500">{{ ret?.product?.name }}</span> - {{ ret.return_qty }} x {{
              formatRupiah(ret.price) }} ( {{ ret.alasan || `Tanpa
            alasan` }} )
          </li>
        </ul>
        <div class="mt-3 font-semibold">
          Total : Rp. {{ formatRupiah(total || 0) }}
        </div>
        <button type="button" :disabled="loading" @click="handleReturn"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <span>Simpan Return Pembelian</span>
          <!-- Spinner -->
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white absolute right-3"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </button>
      </div>

    </div>

    <div v-else>
      <NoData message="Belum Ada Product" description="Harap Cari Data By Invoice Atau Data Product Telebih Dahulu"
        icon="Package" action-label="Add Product" />
    </div>
  </div>
</template>

<script setup>
import { watch, computed } from 'vue'
import { formatRupiah } from '@/utils/uangHelper'


const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onReturn'])

const total = computed(() => {
  return props.items.reduce((total, item) => {
    return total + (parseFloat(item?.price || 0) * parseInt(item?.return_qty || 0))
  }, 0)
})

const returnedItems = computed(() =>
  props.items.filter(i => i.return_qty && i.return_qty > 0)
)


watch(() => props.items, (newVal) => {
  console.log('newVal', newVal);

})


const handleReturn = () => {
  for (const item of props.items) {
    if (item.return_qty > item.qty) {
      alert(`Return untuk ${item.product.name} melebihi jumlah!`)
      return // Stop eksekusi
    }
  }


  console.log('handleReturn', props.data);

  const header = {
    nota: props.data.unique_code,
    purchase_id: props.data.id,
    supplier_id: props.data.supplier_id,
    keterangan: 'Return Pembelian ',
    total: total.value

  }

  const returnData = props.items.filter(item => item.return_qty > 0).map(item => ({

    product_id: item.product.id,
    qty: item.return_qty,
    harga: parseFloat(item.price),
    subtotal: parseInt(item.return_qty) * parseFloat(item.price),
    alasan: item.alasan,
  }))



  if (returnData.length === 0) {
    alert('Tidak ada barang yang diretur.')
    return
  }

  const form = {
    ...header,
    items: returnData
  }

  // Kirim returnData ke server, misalnya:
  // console.log('Return data ready to send:', form)
  emit('onReturn', form)
}

</script>
