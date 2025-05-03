<template>
  <BaseDialog
    v-model="showDialog"
    :title="`Detail Order Pembelian #${purchaseOrder?.order_number || ''}`"
    max-width="4xl"
    @close="closeDialog"
  >
    <div class="flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Header with Actions -->
      <div class="flex justify-between items-center p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
        <div>
          <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400">
            Order #{{ purchaseOrder?.unique_code || purchaseOrder?.id }}
          </h2>
          <p class="text-secondary-500 dark:text-secondary-400 text-sm">
            {{ new Date(purchaseOrder?.date).toLocaleDateString() }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <BaseButton
            v-if="purchaseOrder?.status === 'draft'"
            @click="editPurchaseOrder"
            variant="primary"
            size="sm"
          >
            <template #icon-left>
              <Icon name="Edit" class="w-4 h-4" />
            </template>
            <div class="ml-2">Edit Order</div>
          </BaseButton>
          <BaseButton @click="printPurchaseOrder" variant="secondary" size="sm">
            <template #icon-left>
              <Icon name="Printer" class="w-4 h-4" />
            </template>
            <div class="ml-2">Cetak</div>
          </BaseButton>

          <!-- Tombol untuk membuat pembelian aktual (hanya muncul jika status received) -->
          <BaseButton
            v-if="purchaseOrder?.status === 'received'"
            @click="createPurchase"
            variant="primary"
            size="sm"
          >
            <template #icon-left>
              <Icon name="ShoppingBag" class="w-4 h-4" />
            </template>
            <div class="ml-2">Buat Pembelian</div>
          </BaseButton>

          <!-- Tombol untuk mengubah status PO -->
          <BaseButton
            v-if="purchaseOrder?.status === 'ordered'"
            @click="prepareReceiveItems"
            variant="success"
            size="sm"
          >
            <template #icon-left>
              <Icon name="CheckCircle" class="w-4 h-4" />
            </template>
            <div class="ml-2">Terima Barang</div>
          </BaseButton>

          <BaseButton
            v-if="purchaseOrder?.status === 'draft'"
            @click="updateStatus('ordered')"
            variant="primary"
            size="sm"
          >
            <template #icon-left>
              <Icon name="Send" class="w-4 h-4" />
            </template>
            <div class="ml-2">Proses Order</div>
          </BaseButton>

          <BaseButton
            v-if="['draft', 'ordered'].includes(purchaseOrder?.status)"
            @click="updateStatus('cancelled')"
            variant="danger"
            size="sm"
          >
            <template #icon-left>
              <Icon name="XCircle" class="w-4 h-4" />
            </template>
            <div class="ml-2">Batalkan</div>
          </BaseButton>

          <!-- Tombol untuk mengubah status PO kembali ke draft -->
          <BaseButton
            v-if="purchaseOrder?.status === 'ordered'"
            @click="updateStatus('draft')"
            variant="warning"
            size="sm"
          >
            <template #icon-left>
              <Icon name="Edit" class="w-4 h-4" />
            </template>
            <div class="ml-2">Kembalikan ke Draft</div>
          </BaseButton>
        </div>
      </div>

      <!-- Status Timeline -->
      <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
        <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-4">Status Order</h3>
        <div class="flex items-center">
          <div class="flex-1 flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="purchaseOrder?.status === 'draft' ? 'bg-yellow-500 text-white' :
                         (purchaseOrder?.status === 'ordered' || purchaseOrder?.status === 'received' || purchaseOrder?.status === 'cancelled') ? 'bg-yellow-500 text-white' :
                         'bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400'">
              <Icon name="Edit" class="w-4 h-4" />
            </div>
            <div class="text-xs mt-1 text-center text-secondary-900 dark:text-white font-medium">Draft</div>
          </div>

          <div class="flex-1 h-1 bg-secondary-200 dark:bg-secondary-700"
               :class="(purchaseOrder?.status === 'ordered' || purchaseOrder?.status === 'received') ? 'bg-blue-500 dark:bg-blue-500' : ''"></div>

          <div class="flex-1 flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="purchaseOrder?.status === 'ordered' ? 'bg-blue-500 text-white' :
                         purchaseOrder?.status === 'received' ? 'bg-blue-500 text-white' :
                         'bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400'">
              <Icon name="ShoppingCart" class="w-4 h-4" />
            </div>
            <div class="text-xs mt-1 text-center text-secondary-900 dark:text-white font-medium">Ordered</div>
          </div>

          <div class="flex-1 h-1 bg-secondary-200 dark:bg-secondary-700"
               :class="purchaseOrder?.status === 'received' ? 'bg-green-500 dark:bg-green-500' : ''"></div>

          <div class="flex-1 flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="purchaseOrder?.status === 'received' ? 'bg-green-500 text-white' :
                         'bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400'">
              <Icon name="Package" class="w-4 h-4" />
            </div>
            <div class="text-xs mt-1 text-center text-secondary-900 dark:text-white font-medium">Received</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Supplier Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Supplier</h3>
          <div class="text-secondary-900 dark:text-white font-medium">
            {{ purchaseOrder?.supplier?.name }}
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ purchaseOrder?.supplier?.email }}
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400">
            {{ purchaseOrder?.supplier?.phone }}
          </div>
        </div>

        <!-- Order Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Informasi Order</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-secondary-500 dark:text-secondary-400">Status:</div>
            <div>
              <span class="px-2 py-0.5 rounded-full text-xs"
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': purchaseOrder?.status === 'draft',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': purchaseOrder?.status === 'ordered',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': purchaseOrder?.status === 'received',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': purchaseOrder?.status === 'cancelled'
                    }">
                {{ purchaseOrder?.status === 'draft' ? 'Draft' :
                   purchaseOrder?.status === 'ordered' ? 'Ordered' :
                   purchaseOrder?.status === 'received' ? 'Received' : 'Cancelled' }}
              </span>
            </div>
            <div class="text-secondary-500 dark:text-secondary-400">Tanggal Order:</div>
            <div class="text-secondary-900 dark:text-white">{{ new Date(purchaseOrder?.date).toLocaleDateString() }}</div>
            <!-- <div class="text-secondary-500 dark:text-secondary-400">Jatuh Tempo:</div> -->
            <!-- <div class="text-secondary-900 dark:text-white">{{ purchaseOrder?.due_date ? new Date(purchaseOrder.due_date).toLocaleDateString() : '-' }}</div> -->
          </div>
        </div>

        <!-- Summary -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Ringkasan</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-secondary-500 dark:text-secondary-400">Total Item:</div>
            <div class="text-secondary-900 dark:text-white">{{ purchaseOrder?.items?.length || 0 }}</div>
            <div class="text-secondary-500 dark:text-secondary-400">Total Nilai:</div>
            <div class="font-medium text-secondary-900 dark:text-white">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal()) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm overflow-hidden">
        <h3 class="p-4 border-b border-secondary-200 dark:border-secondary-700 font-medium text-secondary-900 dark:text-white">Daftar Item</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead class="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Produk</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Harga</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Qty Pesanan</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Subtotal</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
                <!-- Kolom untuk jumlah diterima jika status received -->
                <th v-if="purchaseOrder?.status === 'received'" class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Qty Diterima</th>
                <!-- Kolom untuk selisih jika status received -->
                <th v-if="purchaseOrder?.status === 'received'" class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Selisih</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              <tr v-for="(item, index) in purchaseOrder?.items" :key="index" class="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name }}</div>
                  <div class="text-xs text-secondary-500 dark:text-secondary-400">{{ item.product?.barcode }}</div>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price) }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap font-medium text-secondary-900 dark:text-white">
                  {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity) }}
                </td>
                <td class="px-4 py-3 text-center whitespace-nowrap text-secondary-900 dark:text-white">
                  <span class="px-2 py-0.5 rounded-full text-xs"
                        :class="{
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.status === 'added',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': item.status === 'ordered',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.status === 'active'
                        }">
                    {{ item.status === 'added' ? 'Added' :
                       item.status === 'ordered' ? 'Ordered' : 'Active' }}
                  </span>
                </td>
                <!-- Kolom untuk jumlah diterima jika status received -->
                <td v-if="purchaseOrder?.status === 'received'" class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">
                  {{ item.received_quantity || 0 }}
                </td>
                <!-- Kolom untuk selisih jika status received -->
                <td v-if="purchaseOrder?.status === 'received'" class="px-4 py-3 text-right whitespace-nowrap">
                  <span :class="(item.quantity - (item.received_quantity || 0)) > 0 ? 'text-red-600 dark:text-red-400' : 'text-secondary-900 dark:text-white'">
                    {{ item.quantity - (item.received_quantity || 0) }}
                  </span>
                  <div v-if="item.notes" class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    {{ item.notes }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="purchaseOrder?.notes" class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
        <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Catatan</h3>
        <p class="text-secondary-900 dark:text-white text-sm">{{ purchaseOrder.notes }}</p>
      </div>
    </div>
  </BaseDialog>

  <!-- Print Template (hidden) -->
  <div ref="printTemplate" class="hidden">
    <div class="print-template">
      <div class="print-header">
        <h1>ORDER PEMBELIAN</h1>
        <div class="print-order-number">No: {{ purchaseOrder?.order_number || purchaseOrder?.id }}</div>
      </div>

      <div class="print-info">
        <div class="print-company">
          <h2>Dari:</h2>
          <div>Nama Toko Anda</div>
          <div>Alamat Toko Anda</div>
          <div>Email & Telepon Toko</div>
        </div>

        <div class="print-supplier">
          <h2>Kepada:</h2>
          <div>{{ purchaseOrder?.supplier?.name }}</div>
          <div>{{ purchaseOrder?.supplier?.address }}</div>
          <div>{{ purchaseOrder?.supplier?.phone }}</div>
          <div>{{ purchaseOrder?.supplier?.email }}</div>
        </div>

        <div class="print-dates">
          <div><strong>PO Num:</strong> {{ purchaseOrder?.unique_code }}</div>
          <div><strong>Tanggal Order:</strong> {{ new Date(purchaseOrder?.date).toLocaleDateString() }}</div>
          <!-- <div><strong>Jatuh Tempo:</strong> {{ purchaseOrder?.due_date ? new Date(purchaseOrder.due_date).toLocaleDateString() : '-' }}</div> -->
        </div>
      </div>

      <table class="print-items">
        <thead>
          <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in purchaseOrder?.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.product?.name }}</td>
            <td>{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price) }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-right"><strong>Total:</strong></td>
            <td>{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal()) }}</td>
          </tr>
        </tfoot>
      </table>

      <div v-if="purchaseOrder?.notes" class="print-notes">
        <h3>Catatan:</h3>
        <p>{{ purchaseOrder.notes }}</p>
      </div>

      <div class="print-signatures">
        <div class="print-signature">
          <div class="signature-line"></div>
          <div>Dibuat Oleh</div>
        </div>

        <div class="print-signature">
          <div class="signature-line"></div>
          <div>Disetujui Oleh</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog Penerimaan Barang -->
  <BaseDialog
    v-model="showReceiveItemsDialog"
    title="Penerimaan Barang"
    max-width="3xl"
    @close="showReceiveItemsDialog = false"
  >
    <div class="p-4">
      <p class="mb-4 text-secondary-600 dark:text-secondary-400">
        Masukkan jumlah barang yang diterima untuk setiap item. Jika jumlah berbeda dengan pesanan, sistem akan mencatat perbedaannya.
      </p>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead class="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Produk</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Qty Pesanan</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Qty Diterima</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            <tr v-for="(item, index) in receiveItems" :key="index" class="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name }}</div>
                <div class="text-xs text-secondary-500 dark:text-secondary-400">{{ item.product?.barcode }}</div>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap text-secondary-900 dark:text-white">
                {{ item.quantity }}
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <input
                  type="number"
                  v-model.number="item.received_quantity"
                  min="0"
                  :max="item.quantity"
                  class="w-20 px-2 py-1 border border-secondary-300 dark:border-secondary-600 rounded-md text-right bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </td>
              <td class="px-4 py-3">
                <input
                  type="text"
                  v-model="item.notes"
                  placeholder="Catatan (opsional)"
                  class="w-full px-2 py-1 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <BaseButton @click="showReceiveItemsDialog = false" variant="secondary">
          Batal
        </BaseButton>
        <BaseButton @click="submitReceiveItems" variant="primary">
          Simpan & Terima Barang
        </BaseButton>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'
import { api } from '@/services/api'
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'

const router = useRouter()
const purchaseOrderStore = usePurchaseOrderStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  purchaseOrderId: {
    type: [Number, String],
    default: null
  },
  dataOrder: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'status-updated'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const purchaseOrder = ref(null)
const loading = ref(false)
const printTemplate = ref(null)
const statusLoading = ref(false)
const showReceiveItemsDialog = ref(false)
const receiveItems = ref([])


onMounted(async () => {
  purchaseOrder.value = props.dataOrder

})

const closeDialog = () => {
  showDialog.value = false
}

// Flag untuk mencegah fetch ganda
const hasFetched = ref(false)

// Fungsi fetch yang dimodifikasi
const fetchPurchaseOrderDetail = async () => {
  if (!props.purchaseOrderId || hasFetched.value) return

  loading.value = true
  try {
    const { data } = await api.get(`/api/v1/purchase-orders/${props.purchaseOrderId}`)
    console.log('data purchase order detail', data)
    purchaseOrder.value = data
    hasFetched.value = true
  } catch (error) {
    console.error('Error fetching purchase order details:', error)
  } finally {
    loading.value = false
  }
}

const calculateTotal = () => {
  if (!purchaseOrder.value?.items?.length) return 0

  return purchaseOrder.value.items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

const printPurchaseOrder = () => {
  // Buat iframe tersembunyi
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Tulis konten ke iframe
  iframe.contentDocument.write(`
    <html>
      <head>
        <title>Print Purchase Order</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .print-items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .print-items th, .print-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .print-signatures { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature-line { border-bottom: 1px solid #333; margin-bottom: 10px; height: 40px; }
        </style>
      </head>
      <body>
        ${printTemplate.value.innerHTML}
      </body>
    </html>
  `);

  iframe.contentDocument.close();

  // Tunggu iframe selesai load
  iframe.onload = function() {
    // Cetak iframe
    iframe.contentWindow.print();

    // Hapus iframe setelah print dialog ditutup
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  };
}

// Fungsi untuk mengubah status PO
const updateStatus = async (newStatus) => {
  if (!purchaseOrder.value?.id) return

  // Validasi transisi status yang diperbolehkan
  const currentStatus = purchaseOrder.value.status
  const allowedTransitions = {
    'draft': ['ordered', 'cancelled'],
    'ordered': ['received', 'cancelled', 'draft'], // Tambahkan 'draft' di sini
    'received': [], // Tidak ada transisi yang diperbolehkan dari status received
    'cancelled': [] // Tidak ada transisi yang diperbolehkan dari status cancelled
  }

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    console.error(`Transisi status dari ${currentStatus} ke ${newStatus} tidak diperbolehkan`)
    return
  }

  statusLoading.value = true
  try {
    const { data } = await api.put(`/api/v1/purchase-orders/${purchaseOrder.value.id}/status`, {
      status: newStatus
    })

    // Update local data
    purchaseOrder.value.status = newStatus

    // Update data di store
    updatePurchaseOrderInStore(purchaseOrder.value.id, newStatus)

    // Emit event untuk memberitahu parent component
    emit('status-updated', { id: purchaseOrder.value.id, status: newStatus })

  } catch (error) {
    console.error('Error updating purchase order status:', error)
  } finally {
    statusLoading.value = false
  }
}

// Fungsi untuk memperbarui status PO di store
const updatePurchaseOrderInStore = (id, newStatus) => {
  // Cari PO di dalam items store
  const poIndex = purchaseOrderStore.items.findIndex(item => item.id === id)

  if (poIndex !== -1) {
    // Buat salinan item yang akan diperbarui
    const updatedPO = { ...purchaseOrderStore.items[poIndex], status: newStatus }

    // Update array items dengan item yang sudah diperbarui
    purchaseOrderStore.items = [
      ...purchaseOrderStore.items.slice(0, poIndex),
      updatedPO,
      ...purchaseOrderStore.items.slice(poIndex + 1)
    ]
  }
}

// Fungsi untuk menampilkan dialog penerimaan barang
const prepareReceiveItems = () => {
  if (!purchaseOrder.value?.items?.length) return

  // Buat salinan item untuk form penerimaan
  receiveItems.value = purchaseOrder.value.items.map(item => ({
    id: item.id,
    product_id: item.product_id,
    product: item.product,
    quantity: item.quantity,
    received_quantity: item.quantity, // Default sama dengan jumlah pesanan
    price: item.price,
    status: item.status,
    notes: ''
  }))

  showReceiveItemsDialog.value = true
}

// Fungsi untuk menyimpan penerimaan barang
const submitReceiveItems = async () => {
  if (!purchaseOrder.value?.id) return

  statusLoading.value = true
  try {
    // Persiapkan data untuk dikirim ke API
    const itemsData = receiveItems.value.map(item => ({
      id: item.id,
      received_quantity: item.received_quantity,
      notes: item.notes,
      // Status item berdasarkan jumlah yang diterima
      status: item.received_quantity > 0 ? 'active' : 'ordered'
    }))

    // Hitung apakah ada item yang diterima kurang dari yang dipesan
    const hasIncompleteItems = receiveItems.value.some(
      item => item.received_quantity < item.quantity
    )

    // Kirim data ke API
    const { data } = await api.put(`/api/v1/purchase-orders/${purchaseOrder.value.id}/receive`, {
      items: itemsData,
      status: 'received', // Status PO tetap received
      notes: hasIncompleteItems ? 'Penerimaan tidak lengkap' : null
    })

    // Update local data
    purchaseOrder.value.status = 'received'
    purchaseOrder.value.items = purchaseOrder.value.items.map(item => {
      const updatedItem = receiveItems.value.find(ri => ri.id === item.id)
      if (updatedItem) {
        return {
          ...item,
          received_quantity: updatedItem.received_quantity,
          notes: updatedItem.notes,
          status: updatedItem.received_quantity > 0 ? 'active' : 'ordered'
        }
      }
      return item
    })

    // Update data di store
    updatePurchaseOrderInStore(purchaseOrder.value.id, 'received')

    // Emit event untuk memberitahu parent component
    emit('status-updated', { id: purchaseOrder.value.id, status: 'received' })

    // Jika ada item yang tidak lengkap, tampilkan konfirmasi
    if (hasIncompleteItems) {
      const incompleteItems = receiveItems.value.filter(
        item => item.received_quantity < item.quantity
      )

      const totalMissing = incompleteItems.reduce(
        (sum, item) => sum + (item.quantity - item.received_quantity), 0
      )

      // Tampilkan dialog konfirmasi
      if (confirm(`${totalMissing} item tidak diterima lengkap. Apakah Anda ingin membuat PO baru untuk item yang kurang?`)) {
        // Redirect ke halaman pembuatan PO baru dengan data item yang kurang
        const missingItems = incompleteItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity - item.received_quantity,
          price: item.price
        }))

        // Simpan data sementara di localStorage atau store
        localStorage.setItem('missing_items', JSON.stringify(missingItems))
        localStorage.setItem('supplier_id', purchaseOrder.value.supplier_id)

        // Redirect ke halaman pembuatan PO
        router.push('/transaksi/po/create?from_incomplete=true')
      }
    }

    // Tutup dialog penerimaan
    showReceiveItemsDialog.value = false

  } catch (error) {
    console.error('Error receiving items:', error)
  } finally {
    statusLoading.value = false
  }
}

// Fungsi untuk membuat pembelian aktual
const createPurchase = () => {
  if (!purchaseOrder.value?.id) return

  // Redirect ke halaman pembelian baru dengan ID PO dan parameter from
  router.push(`/admin/transaksi/pembelian/create?purchaseOrderId=${purchaseOrder.value.id}&from=po-detail`)
}

// Fungsi untuk mengedit PO
const editPurchaseOrder = async () => {
  if (!purchaseOrder.value?.id || purchaseOrder.value.status !== 'draft') return

  try {
    // Reset form terlebih dahulu
    purchaseOrderStore.resetForm()

    // Langsung gunakan data purchaseOrder yang sudah ada
    purchaseOrderStore.form = {
      supplier_id: purchaseOrder.value.supplier_id,
      date: purchaseOrder.value.date,
      due_date: purchaseOrder.value.due_date || '',
      status: purchaseOrder.value.status,
      items: purchaseOrder.value.items.map(item => ({
        product_id: item.product_id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })) || [],
      notes: purchaseOrder.value.notes || ''
    }

    // Pastikan supplier ada di daftar suppliers
    if (purchaseOrder.value.supplier && !purchaseOrderStore.suppliers.some(s => s.id === purchaseOrder.value.supplier.id)) {
      purchaseOrderStore.suppliers.push(purchaseOrder.value.supplier)
    }

    // Set mode edit
    purchaseOrderStore.setEditMode(purchaseOrder.value.id)

    // Tampilkan dialog
    purchaseOrderStore.showCreateDialog = true

    // Baris ini dihapus untuk membiarkan dialog detail tetap terbuka
    // showDialog.value = false
  } catch (error) {
    console.error('Error preparing purchase order for edit:', error)
  }
}

// Gabungkan kedua watcher
watch([() => props.purchaseOrderId, () => showDialog.value], ([newId, isOpen]) => {
  // Reset flag ketika dialog ditutup
  if (!isOpen) {
    hasFetched.value = false
    return
  }

  // Fetch hanya jika dialog terbuka dan ada ID
  if (isOpen && newId) {
    fetchPurchaseOrderDetail()
  }
}, { immediate: true })

watch(() => props.dataOrder, (newData) => {
  console.log('watch data order', newData);

  purchaseOrder.value = newData
}, { immediate: true })
</script>

<style scoped>
/* Print styles */
@media print {
  .print-template {
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .print-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  }

  .print-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }

  .print-items {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
  }

  .print-items th, .print-items td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .print-items th {
    background-color: #f2f2f2;
  }

  .print-notes {
    margin-bottom: 30px;
  }

  .print-signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }

  .print-signature {
    width: 200px;
    text-align: center;
  }

  .signature-line {
    border-bottom: 1px solid #333;
    margin-bottom: 10px;
    height: 40px;
  }
}

/* Add styles for the print template even when not printing */
.print-template {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}

.print-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.print-items {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.print-items th, .print-items td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.print-items th {
  background-color: #f2f2f2;
}

.print-notes {
  margin-bottom: 30px;
}

.print-signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.print-signature {
  width: 200px;
  text-align: center;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 10px;
  height: 40px;
}
</style>
