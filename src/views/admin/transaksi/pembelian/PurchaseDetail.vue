<template>
  <BasePage :title="`Detail Pembelian #${purchase?.invoice_number || purchase?.id || ''}`"
    subtitle="Detail transaksi pembelian">
    <template #actions>
      <div class="flex space-x-2">
        <BaseButton @click="router.push('/admin/transaksi/pembelian')" variant="secondary" size="md">
          <template #icon-left>
            <Icon name="ArrowLeft" class="w-4 h-4" />
          </template>
          Kembali
        </BaseButton>
        <BaseButton @click="printPurchase" variant="secondary" size="md">
          <template #icon-left>
            <Icon name="Printer" class="w-4 h-4" />
          </template>
          Cetak
        </BaseButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="!purchase" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
      <Icon name="AlertCircle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Data Tidak Ditemukan</h3>
      <p class="text-gray-500 dark:text-gray-400">Pembelian dengan ID tersebut tidak ditemukan.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info Section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Status Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Status Pembelian</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ new Date(purchase.date).toLocaleDateString() }}</p>
            </div>
            <div>
              <span class="px-3 py-1 rounded-full text-sm font-medium" :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': purchase?.purchase_order?.status === 'received',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': purchase.purchase_order?.status === 'draft',
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': purchase.purchase_order?.status === 'cancelled'
              }">
                {{ purchase.purchase_order?.status === 'received' ? 'Selesai' :
                  purchase.purchase_order?.status === 'draft' ? 'Pending' : 'Dibatalkan' }}
              </span>
            </div>
          </div>

          <div class="mt-4 flex items-center">
            <div class="flex-1 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                <Icon name="FileText" class="w-4 h-4" />
              </div>
              <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">Dibuat</div>
            </div>
            <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700"
              :class="{ 'bg-indigo-500 dark:bg-indigo-500': purchase.purchase_order?.status !== 'draft' }"></div>
            <div class="flex-1 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="purchase.purchase_order?.status === 'received' || purchase.purchase_order?.status === 'cancelled' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'">
                <Icon name="Package" class="w-4 h-4" />
              </div>
              <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">Diproses</div>
            </div>
            <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700"
              :class="{ 'bg-indigo-500 dark:bg-indigo-500': purchase.status === 'received' }"></div>
            <div class="flex-1 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="purchase.purchase_order?.status === 'received' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'">
                <Icon name="CheckCircle" class="w-4 h-4" />
              </div>
              <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">Selesai</div>
            </div>
          </div>

          <div v-if="purchase.status === 'pending'" class="mt-6 flex justify-end space-x-2">
            <BaseButton @click="completePurchase" variant="success" size="sm">
              <template #icon-left>
                <Icon name="CheckCircle" class="w-4 h-4" />
              </template>
              Selesaikan
            </BaseButton>
            <BaseButton @click="cancelPurchase" variant="danger" size="sm">
              <template #icon-left>
                <Icon name="XCircle" class="w-4 h-4" />
              </template>
              Batalkan
            </BaseButton>
          </div>
        </div>

        <!-- Items Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Item Pembelian</h3>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produk</th>
                  <th scope="col"
                    class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Harga</th>
                  <th scope="col"
                    class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Qty</th>
                  <th scope="col"
                    class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subtotal</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in purchase.items" :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product?.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price) }}
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.qty }}
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subtotal
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', {
                      style: 'currency', currency: 'IDR'
                    }).format(calculateSubtotal()) }}
                  </td>
                </tr>
                <tr v-if="purchase.discount">
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    Diskon
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(purchase.discount)
                    }}
                  </td>
                </tr>
                <tr v-if="purchase.tax">
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pajak
                    ({{ purchase.tax }}%)</td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTax()) }}
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">Total
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal())
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="purchase.notes" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Catatan</h3>
          <p class="text-gray-700 dark:text-gray-300">{{ purchase.notes }}</p>
        </div>
      </div>

      <!-- Sidebar Section -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Supplier Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Supplier</h3>

          <div class="space-y-3">
            <div class="text-gray-900 dark:text-white font-medium">{{ purchase.supplier?.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ purchase.supplier?.email }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ purchase.supplier?.phone }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ purchase.supplier?.address }}</div>
          </div>
        </div>

        <!-- Purchase Info Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Pembelian</h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">No. Invoice</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ purchase.invoice_number || '-'
                }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Tanggal</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ new
                Date(purchase.date).toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span class="text-sm font-medium" :class="{
                'text-green-600 dark:text-green-400': purchase.status === 'completed',
                'text-yellow-600 dark:text-yellow-400': purchase.status === 'pending',
                'text-red-600 dark:text-red-400': purchase.status === 'cancelled'
              }">
                {{ purchase.status === 'completed' ? 'Selesai' :
                  purchase.status === 'pending' ? 'Pending' : 'Dibatalkan' }}
              </span>
            </div>
            <div v-if="purchase.purchase_order_id" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Purchase Order</span>
              <router-link :to="`/transaksi/po/${purchase.purchase_order_id}`"
                class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Lihat PO
              </router-link>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Ringkasan</h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total Item</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ purchase.items.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total Qty</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ calculateTotalQuantity() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total Harga</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ new Intl.NumberFormat('id-ID', {
                style:
                  'currency', currency: 'IDR'
              }).format(calculateTotal()) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import BasePage from '@/components/ui/BasePage.vue'
// import BaseButton from '@/components/ui/BaseButton.vue'
// import Icon from '@/components/ui/Icon.vue'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()
const purchase = ref(null)
const loading = ref(true)

// Fetch purchase data
const fetchPurchase = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/api/v1/purchases/${route.params.id}`)
    purchase.value = data
  } catch (error) {
    console.error('Error fetching purchase:', error)
  } finally {
    loading.value = false
  }
}

// Calculate totals
const calculateSubtotal = () => {
  if (!purchase.value?.items) return 0
  return purchase.value.items.reduce((total, item) => total + (item.price * item.qty), 0)
}

const calculateTax = () => {
  if (!purchase.value?.tax) return 0
  return calculateSubtotal() * (purchase.value.tax / 100)
}

const calculateTotal = () => {
  const subtotal = calculateSubtotal()
  const tax = calculateTax()
  const discount = purchase.value?.discount || 0
  return subtotal + tax - discount
}

const calculateTotalQuantity = () => {
  if (!purchase.value?.items) return 0
  return purchase.value.items.reduce((total, item) => total + item.qty, 0)
}

// Update purchase status
const completePurchase = async () => {
  try {
    await api.put(`/api/v1/purchases/${purchase.value.id}/status`, {
      status: 'completed'
    })
    purchase.value.status = 'completed'
  } catch (error) {
    console.error('Error completing purchase:', error)
    alert('Terjadi kesalahan saat mengubah status pembelian.')
  }
}

const cancelPurchase = async () => {
  if (!confirm('Apakah Anda yakin ingin membatalkan pembelian ini?')) return

  try {
    await api.put(`/api/v1/purchases/${purchase.value.id}/status`, {
      status: 'cancelled'
    })
    purchase.value.status = 'cancelled'
  } catch (error) {
    console.error('Error cancelling purchase:', error)
    alert('Terjadi kesalahan saat membatalkan pembelian.')
  }
}

// Print purchase
const printPurchase = () => {
  window.print()
}

// Lifecycle hooks
onMounted(() => {
  fetchPurchase()
})
</script>
