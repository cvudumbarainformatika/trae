<template>
  <div
    class="flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
    <!-- Status Info (Simplified for direct purchase) -->
    <div class="flex justify-between items-center p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
      <div>
        <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">Status Pembelian</h3>
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white"
            :class="(purchase.due_amount || purchase.total - (purchase.paid_amount || 0)) <= 0 ? 'bg-green-500' : 'bg-red-500'">
            <Icon
              :name="(purchase.due_amount || purchase.total - (purchase.paid_amount || 0)) <= 0 ? 'CheckCircle' : 'AlertCircle'"
              class="w-5 h-5" />
          </div>
          <div class="ml-3 text-lg font-semibold text-secondary-900 dark:text-white capitalize">
            {{ (purchase.due_amount || purchase.total - (purchase.paid_amount || 0)) <= 0 ? 'Lunas' : 'Hutang' }} </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <BaseButton @click="printPurchase" variant="secondary" size="sm">
            <template #icon-left>
              <Icon name="Printer" class="w-4 h-4" />
            </template>
            <div class="ml-2">Cetak</div>
          </BaseButton>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Supplier Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Supplier</h3>
          <div class="text-secondary-900 dark:text-white font-medium">
            {{ purchase.supplier?.name || '-' }}
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ purchase.supplier?.email || '-' }}
          </div>
          <div class="text-sm text-secondary-500 dark:text-secondary-400">
            {{ purchase.supplier?.phone || '-' }}
          </div>
        </div>

        <!-- Purchase Info -->
        <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm md:col-span-2">
          <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-2">Informasi Pembelian</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-secondary-500 dark:text-secondary-400">Tanggal Pembelian:</div>
            <div class="text-secondary-900 dark:text-white font-medium">{{ formatDate(purchase.date) }}</div>

            <div class="text-secondary-500 dark:text-secondary-400">Jatuh Tempo:</div>
            <div class="text-secondary-900 dark:text-white font-medium">{{ formatDate(purchase.due_date) }}</div>

            <div class="text-secondary-500 dark:text-secondary-400">Metode Pembayaran:</div>
            <div class="text-secondary-900 dark:text-white font-medium capitalize">{{ purchase.payment_method || '-' }}
            </div>

            <!-- <div class="text-secondary-500 dark:text-secondary-400">Status Pembayaran:</div> -->
            <!-- <div class="text-secondary-900 dark:text-white font-medium capitalize">
            <span :class="{
              'text-green-600 dark:text-green-400': purchase.payment_status === 'paid',
              'text-yellow-600 dark:text-yellow-400': purchase.payment_status === 'partial',
              'text-red-600 dark:text-red-400': purchase.payment_status === 'unpaid'
            }">
              {{ purchase.payment_status === 'paid' ? 'Lunas' : purchase.payment_status === 'partial' ? 'Dibayar Sebagian' : 'Belum Lunas' }}
            </span>
          </div> -->

            <div class="text-secondary-500 dark:text-secondary-400 sm:col-span-2">Catatan:</div>
            <div class="text-secondary-900 dark:text-white font-medium sm:col-span-2">{{ purchase.note || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="p-4 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
        <h3 class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-3">Item Pembelian</h3>
        <div class="overflow-x-auto rounded-lg border border-secondary-200 dark:border-secondary-700">
          <table class="min-w-full text-sm">
            <thead class="bg-secondary-50 dark:bg-secondary-700/50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-secondary-600 dark:text-secondary-300">Produk</th>
                <th class="px-4 py-3 text-right font-semibold text-secondary-600 dark:text-secondary-300">Qty</th>
                <th class="px-4 py-3 text-right font-semibold text-secondary-600 dark:text-secondary-300">Harga Satuan
                </th>
                <th class="px-4 py-3 text-right font-semibold text-secondary-600 dark:text-secondary-300">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-secondary-200 dark:divide-secondary-700">
              <tr v-for="item in purchase.items" :key="item.id || item.product_id"
                class="hover:bg-secondary-50 dark:hover:bg-secondary-700/30">
                <td class="px-4 py-3 text-secondary-700 dark:text-secondary-200">{{ item.product?.name ||
                  item.product_name ||
                  '-' }}</td>
                <td class="px-4 py-3 text-right text-secondary-700 dark:text-secondary-200">{{ item.qty }}</td>
                <td class="px-4 py-3 text-right text-secondary-700 dark:text-secondary-200">{{
                  formatCurrency(item.price) }}
                </td>
                <td class="px-4 py-3 text-right text-secondary-700 dark:text-secondary-200">{{
                  formatCurrency(item.subtotal)
                }}</td>
              </tr>
              <tr v-if="!purchase.items || purchase.items.length === 0">
                <td colspan="4" class="px-4 py-10 text-center text-secondary-500 dark:text-secondary-400">
                  Tidak ada item.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Totals -->
        <div
          class="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700 flex flex-col items-end gap-1 text-sm">
          <div class="flex justify-between w-full max-w-xs">
            <span class="text-secondary-600 dark:text-secondary-300">Subtotal:</span>
            <span class="font-medium text-secondary-800 dark:text-secondary-100">{{ formatCurrency(purchase.subtotal ||
              purchase.total) }}</span>
          </div>
          <div v-if="purchase.discount_amount > 0" class="flex justify-between w-full max-w-xs">
            <span class="text-secondary-600 dark:text-secondary-300">Diskon ({{ purchase.discount_percentage || 0
              }}%):</span>
            <span class="font-medium text-secondary-800 dark:text-secondary-100">- {{
              formatCurrency(purchase.discount_amount)
            }}</span>
          </div>
          <div v-if="purchase.tax_amount > 0" class="flex justify-between w-full max-w-xs">
            <span class="text-secondary-600 dark:text-secondary-300">Pajak ({{ purchase.tax_percentage || 0 }}%):</span>
            <span class="font-medium text-secondary-800 dark:text-secondary-100">+ {{
              formatCurrency(purchase.tax_amount)
            }}</span>
          </div>
          <div
            class="flex justify-between w-full max-w-xs mt-1 pt-1 border-t border-secondary-200 dark:border-secondary-700">
            <span class="font-bold text-secondary-800 dark:text-secondary-100">Total Akhir:</span>
            <span class="font-bold text-lg text-primary-600 dark:text-primary-400">{{ formatCurrency(purchase.total)
              }}</span>
          </div>
          <div class="flex justify-between w-full max-w-xs mt-2">
            <span class="text-secondary-600 dark:text-secondary-300">Sudah Dibayar:</span>
            <span class="font-medium text-green-600 dark:text-green-400">{{ formatCurrency(purchase.paid || 0)
              }}</span>
          </div>
          <div class="flex justify-between w-full max-w-xs">
            <span class="text-secondary-600 dark:text-secondary-300">Sisa Hutang:</span>
            <span class="font-medium text-red-600 dark:text-red-400">{{ formatCurrency(purchase.due_amount ||
              purchase.total -
              (purchase.paid || 0)) }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import Icon from '@/components/ui/Icon.vue'
const props = defineProps({
  purchase: { type: Object, required: true }
})
function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID')
}
function formatCurrency(val) {
  if (!val) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val))
}
const printPurchase = () => {
  // Placeholder for print functionality
  console.log('Printing purchase:', props.purchase.id)
  // You would typically open a new window or use a library to generate a printable view
  // For example: window.print() if the dialog content itself is what you want to print,
  // or generate a PDF.
  alert('Fungsi cetak belum diimplementasikan.');
};
</script>

<style scoped>
/* Add any additional scoped styles if needed */
</style>
