<template>
  <BasePage title="Penjualan Cepat (Kasir)" subtitle="Transaksi penjualan dengan proses cepat dan efisien">
    <template #actions>
      <BaseButton @click="reset" variant="secondary" size="md">
        <template #icon-left>
          <Icon name="RefreshCw" class="w-4 h-4" />
        </template>
        Reset
      </BaseButton>
      <BaseButton @click="submit" variant="primary" size="md">
        <template #icon-left>
          <Icon name="Printer" class="w-4 h-4" />
        </template>
        Simpan & Cetak Struk
      </BaseButton>
    </template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Customer Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="User" class="w-5 h-5 mr-2 text-primary-500" />
              Informasi Customer
            </h3>
            <div>
              <label for="customer-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer <span class="text-red-500">*</span>
              </label>
              <SearchDropdown
                id="customer-search"
                v-model="customerSearch"
                placeholder="Cari customer..."
                :debounce="300"
                :min-search-length="2"
                item-key="id"
                item-label="name"
                not-found-text="Customer tidak ditemukan"
                not-found-subtext="Coba kata kunci lain atau tambahkan customer baru"
                add-button-text="Tambah Customer Baru"
                api-url="/api/v1/customers"
                api-response-path="data.data"
                :use-api="true"
                @select="handleCustomerSelect"
                @add-new="openAddCustomerDialog"
                @items-loaded="onCustomersLoaded"
              >
                <template #item="{ item }">
                  <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                  <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                    <span>{{ item.phone || 'Tidak ada telepon' }}</span>
                  </div>
                </template>
              </SearchDropdown>
            </div>
            <div v-if="form.customer" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informasi Customer</h4>
                  <div class="text-sm text-gray-900 dark:text-white font-medium">{{ form.customer.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.customer.phone }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.customer.address }}</div>
                </div>
                <button @click="clearSelectedCustomer" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Hapus customer">
                  <Icon name="X" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <!-- Date and Invoice Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="Calendar" class="w-5 h-5 mr-2 text-primary-500" />
              Informasi Transaksi
            </h3>
            <div class="space-y-6">
              <div>
                <label for="sales-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal <span class="text-red-500">*</span>
                </label>
                <BaseInput id="sales-date" v-model="form.date" type="date" class="w-full" aria-required="true" />
              </div>
              <div>
                <label for="invoice-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Struk <span class="text-red-500">*</span>
                </label>
                <BaseInput id="invoice-number" v-model="form.invoice_number" placeholder="Masukkan nomor struk..." class="w-full" aria-label="Nomor struk penjualan" aria-required="true" />
              </div>
            </div>
          </div>
          <!-- Product List Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="ShoppingCart" class="w-5 h-5 mr-2 text-primary-500" />
              Daftar Barang
            </h3>
            <div class="flex gap-2 mb-4">
              <BaseInput label="Scan / Input Barcode" v-model="barcode" @keyup.enter="addItemByBarcode" autofocus class="flex-1" />
              <BaseButton color="primary" type="button" @click="addItemByBarcode" class="h-12 mt-6">
                <Icon name="Plus" class="w-5 h-5 mr-1" /> Tambah
              </BaseButton>
            </div>
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
              <table class="min-w-full bg-white dark:bg-gray-900 text-sm">
                <thead class="bg-indigo-50 dark:bg-indigo-900">
                  <tr>
                    <th class="px-3 py-2 text-left">#</th>
                    <th class="px-3 py-2 text-left">Nama Barang</th>
                    <th class="px-3 py-2 text-right">Harga</th>
                    <th class="px-3 py-2 text-right">Qty</th>
                    <th class="px-3 py-2 text-right">Subtotal</th>
                    <th class="px-3 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in form.items" :key="item.id" class="hover:bg-indigo-50 dark:hover:bg-indigo-800/40">
                    <td class="px-3 py-2">{{ idx + 1 }}</td>
                    <td class="px-3 py-2">{{ item.name }}</td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(item.price) }}</td>
                    <td class="px-3 py-2 text-right">
                      <input type="number" min="1" v-model.number="item.qty" class="w-16 rounded border-gray-300 dark:border-gray-700 px-2 py-1 text-right" />
                    </td>
                    <td class="px-3 py-2 text-right">{{ formatCurrency(item.price * item.qty) }}</td>
                    <td class="px-3 py-2 text-center">
                      <BaseButton color="danger" size="xs" @click.prevent="removeItem(idx)">
                        <Icon name="Trash" class="w-4 h-4" />
                      </BaseButton>
                    </td>
                  </tr>
                  <tr v-if="!form.items.length">
                    <td colspan="6" class="text-center text-gray-400 py-4">Belum ada barang ditambahkan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Summary Section -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="Calculator" class="w-5 h-5 mr-2 text-primary-500" />
              Ringkasan
            </h3>
            <div class="space-y-4">
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Total Item:</span>
                  <span class="text-gray-900 dark:text-white font-medium">{{ form.items.reduce((sum, item) => sum + (item.qty || 0), 0) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span class="text-gray-900 dark:text-white font-medium">{{ formatCurrency(total) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Diskon:</span>
                  <BaseInput v-model.number="form.discount" type="number" min="0" class="w-24 text-right" />
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Pajak (%):</span>
                  <BaseInput v-model.number="form.tax" type="number" min="0" max="100" class="w-24 text-right" />
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-800 dark:text-gray-200 font-medium">Total Pembayaran:</span>
                  <span class="text-lg text-primary-600 dark:text-primary-400 font-bold">{{ formatCurrency(grandTotal) }}</span>
                </div>
              </div>
              <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 mb-4">
                <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4">Metode Pembayaran</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Metode Pembayaran <span class="text-red-500">*</span></label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button @click="form.payment_method = 'cash'" :class="['flex items-center justify-center px-4 py-2 rounded-lg border', form.payment_method === 'cash' ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-secondary-700 dark:border-secondary-600 dark:text-gray-300 dark:hover:bg-secondary-600']">
                        <Icon name="CreditCard" class="w-4 h-4 mr-2" />Tunai
                      </button>
                      <button @click="form.payment_method = 'transfer'" :class="['flex items-center justify-center px-4 py-2 rounded-lg border', form.payment_method === 'transfer' ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-secondary-700 dark:border-secondary-600 dark:text-gray-300 dark:hover:bg-secondary-600']">
                        <Icon name="Bank" class="w-4 h-4 mr-2" />Transfer
                      </button>
                      <button @click="form.payment_method = 'credit'" :class="['flex items-center justify-center px-4 py-2 rounded-lg border', form.payment_method === 'credit' ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-secondary-700 dark:border-secondary-600 dark:text-gray-300 dark:hover:bg-secondary-600']">
                        <Icon name="Calendar" class="w-4 h-4 mr-2" />Kredit
                      </button>
                    </div>
                  </div>
                  <div>
                    <label for="paid-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah Dibayarkan</label>
                    <BaseInput id="paid-amount" v-model.number="form.paid" type="number" min="0" :max="grandTotal" :disabled="form.payment_method === 'cash' || form.payment_method === 'transfer'" class="w-full" />
                    <p class="text-xs text-gray-500 mt-1">
                      <span v-if="form.payment_method === 'cash' || form.payment_method === 'transfer'">Pembayaran penuh otomatis</span>
                      <span v-else-if="form.payment_method === 'credit'">Masukkan jumlah yang sudah dibayarkan (uang muka)</span>
                    </p>
                  </div>
                  <div v-if="form.payment_method === 'transfer'" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label for="bank-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank</label>
                    <BaseInput id="bank-name" v-model="form.bank_name" placeholder="Nama Bank" class="w-full mb-2" />
                    <label for="account-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Rekening</label>
                    <BaseInput id="account-number" v-model="form.account_number" placeholder="Nomor Rekening" class="w-full mb-2" />
                    <label for="account-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Pemilik Rekening</label>
                    <BaseInput id="account-name" v-model="form.account_name" placeholder="Nama Pemilik Rekening" class="w-full" />
                  </div>
                  <div v-if="form.payment_method === 'credit'" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label for="due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal Jatuh Tempo</label>
                    <BaseInput id="due-date" v-model="form.due_date" type="date" class="w-full" />
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catatan</label>
                <textarea id="notes" v-model="form.notes" rows="3" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="Tambahkan catatan jika diperlukan..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSalesFormStore } from '@/stores/transaksi/penjualan/form'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'
import BasePage from '@/components/ui/BasePage.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'

const formStore = useSalesFormStore()
const form = formStore
const barcode = ref('')
const customerSearch = ref('')

function addItemByBarcode() {
  // TODO: cari produk berdasarkan barcode dan tambahkan ke form.items
  barcode.value = ''
}
function removeItem(idx) {
  form.items.splice(idx, 1)
}
function submit() {
  // TODO: submit logic & cetak struk
}
function reset() {
  formStore.resetForm()
}
function formatCurrency(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val || 0)
}
function handleCustomerSelect(customer) {
  form.customer = customer
}
function clearSelectedCustomer() {
  form.customer = null
  customerSearch.value = ''
}
function openAddCustomerDialog() {
  // TODO: open dialog to add new customer
}
function onCustomersLoaded() {
  // Optional: handle after customers loaded
}
const total = computed(() => form.items.reduce((sum, item) => sum + (item.price * item.qty), 0))
const change = computed(() => (form.paid || 0) - total.value)
</script>
