<template>
  <div>
    <div v-if="items.length"
      class="overflow-x-auto rounded-lg shadow relative border border-secondary-200 dark:border-secondary-700">

      <div class="p-4 bg-gray-50 dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700">
        <div class="flex justify-between text-sm">
          <div class="text-secondary-500 dark:text-secondary-400">
            <div>{{ data?.unique_code }}</div>
            <div>{{ data?.customer_name || 'Penjualan Umum' }}</div>
          </div>
          <div class=" text-secondary-500 dark:text-secondary-400">
            <div>{{ data?.cashier_name || '-' }}</div>
            <div>Rp {{ data?.total }}</div>
          </div>
        </div>
      </div>

      <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-secondary-700 w-full text-sm ">
        <thead class="bg-gray-100 dark:bg-secondary-900 text-gray-200 dark:text-gray-500">
          <tr>
            <th class="px-4 py-2">Barang</th>
            <th class="px-4 py-2 text-center">Jumlah</th>
            <th class="px-4 py-2 text-center">Jml Retur</th>
            <th class="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="text-gray-200 dark:text-gray-500">
          <tr v-for="item in items" :key="item.id" class="border-t border-gray-200 dark:border-secondary-700">
            <td class="px-4 py-2">{{ item.product.name }}</td>
            <td class="px-4 py-2 text-center">{{ item.qty }}</td>
            <td class="px-4 py-2 text-center">
              <BaseInput v-model.number="item.return_qty" type="number" min="0" placeholder="0" />
            </td>
            <td class="px-4 py-2 text-center">
              <div class="flex items-center justify-center gap-4">
                <label class="flex items-center gap-1 cursor-pointer">
                  <input type="radio" :name="`status-${item.id}`" value="baik" v-model="item.status"
                    class="text-green-500 focus:ring-green-500" />
                  <span class="text-sm">Baik</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer">
                  <input type="radio" :name="`status-${item.id}`" value="rusak" v-model="item.status"
                    class="text-red-500 focus:ring-red-500" />
                  <span class="text-sm">Rusak</span>
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <hr class="border-secondary-200 dark:border-secondary-700 " />

      <div class="p-4 flex justify-end">

        <button type="button" @click="handleReturn" :disabled="loading"
          class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 flex items-center space-x-2">
          <span class="material-icons text-sm"></span>
          <span>Simpan Return Penjualan</span>
          <!-- Spinner -->
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white absolute right-3"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </button>

      </div>

    </div>

    <!-- <div v-else> -->
    <NoData v-else message="Belum Ada Product" description="Harap Cari Data By Invoice Atau Data Product Telebih Dahulu"
      icon="Package" action-label="Add Product" />
    <!-- </div> -->
  </div>
</template>

<script setup>
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


const handleReturn = () => {
  console.log('handleReturn')
  for (const item of props.items) {
    if (item.return_qty > item.qty) {
      alert(`Return untuk ${item.product.name} melebihi jumlah!`)
      return // Stop eksekusi
    }
  }

  const header = {
    nota: props.data.unique_code,
    sales_id: props.data.id,
    customer_id: props.data.customer_id,
    keterangan: 'Return Penjualan '
  }

  const returnData = props.items.filter(item => item.return_qty > 0).map(item => ({

    product_id: item.product.id,
    qty: item.return_qty,
    harga: parseFloat(item.price),
    subtotal: parseInt(item.return_qty) * parseFloat(item.price),
    status: item.status,
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
