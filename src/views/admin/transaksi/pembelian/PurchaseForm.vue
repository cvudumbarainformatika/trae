<template>
  <BasePage
    :title="pageTitle"
    :subtitle="pageSubtitle"
    :loading="loading"
  >
    <template #actions>
      <div class="flex items-center space-x-2">
        <!-- Back Button -->
        <BaseButton
          @click="router.push('/admin/transaksi/pembelian')"
          variant="secondary"
          size="md"
          aria-label="Kembali ke daftar pembelian"
        >
          <template #icon-left>
            <Icon name="ArrowLeft" class="w-4 h-4" />
          </template>
          Kembali
        </BaseButton>

        <!-- Print Button -->
        <BaseButton
          v-if="editMode"
          @click="printInvoice"
          variant="secondary"
          size="md"
          aria-label="Cetak faktur"
        >
          <template #icon-left>
            <Icon name="Printer" class="w-4 h-4" />
          </template>
          Cetak
        </BaseButton>

        <!-- Submit Button -->
        <BaseButton
          @click="handleSubmit"
          variant="primary"
          size="md"
          :loading="loading"
          :disabled="!isFormValid || loading"
          aria-label="Simpan transaksi pembelian"
        >
          <template #icon-left>
            <Icon name="Save" class="w-4 h-4" />
          </template>
          Simpan
        </BaseButton>
      </div>
    </template>

    <!-- Form content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Info Cards Section - Grid untuk desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Supplier Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="User" class="w-5 h-5 mr-2 text-primary-500" />
              Informasi Supplier
            </h3>

            <!-- Supplier Selection -->
            <div>
              <label for="supplier-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <SearchDropdown
                  id="supplier-search"
                  v-model="supplierSearch"
                  placeholder="Cari supplier..."
                  :debounce="300"
                  :min-search-length="3"
                  item-key="id"
                  item-label="name"
                  not-found-text="Supplier tidak ditemukan"
                  not-found-subtext="Coba kata kunci lain atau tambahkan supplier baru"
                  add-button-text="Tambah Supplier Baru"
                  api-url="/api/v1/suppliers"
                  api-response-path="data.data"
                  :use-api="true"
                  @select="handleSupplierSelect"
                  @add-new="openAddSupplierDialog"
                  @items-loaded="onSuppliersLoaded"
                >
                  <template #item="{ item }">
                    <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                      <span>{{ item.phone || 'Tidak ada telepon' }}</span>
                    </div>
                  </template>
                </SearchDropdown>
              </div>
            </div>

            <!-- Selected Supplier Info -->
            <div v-if="form.supplier" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informasi Supplier</h4>
                  <div class="text-sm text-gray-900 dark:text-white font-medium">{{ form.supplier.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.supplier.phone }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ form.supplier.address }}</div>
                </div>
                <button
                  @click="clearSelectedSupplier"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Hapus supplier"
                >
                  <Icon name="X" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Tampilkan pesan jika supplier dengan ID tidak ditemukan -->
            <div v-else-if="form.supplier_id && !form.supplier" class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border-l-4 border-amber-500 animate-fadeIn">
              <div class="flex items-center">
                <Icon name="AlertCircle" class="w-5 h-5 text-amber-500 mr-2" />
                <div>
                  <h4 class="text-sm font-medium text-amber-800 dark:text-amber-200">Supplier Tidak Ditemukan</h4>
                  <p class="text-xs text-amber-700 dark:text-amber-300">
                    Supplier dengan ID {{ form.supplier_id }} tidak ditemukan.
                  </p>
                  <button
                    @click="clearSelectedSupplier"
                    class="mt-1 text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Pilih supplier lain
                  </button>
                </div>
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
              <!-- Date Selection -->
              <div>
                <label for="purchase-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  id="purchase-date"
                  v-model="form.date"
                  type="date"
                  class="w-full"
                  aria-required="true"
                />
              </div>

              <!-- Invoice Number -->
              <div>
                <label for="invoice-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Faktur <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  id="invoice-number"
                  v-model="form.invoice_number"
                  placeholder="Masukkan nomor faktur..."
                  class="w-full"
                  aria-label="Nomor faktur pembelian"
                  aria-required="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Product List Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Icon name="ShoppingCart" class="w-5 h-5 mr-2 text-primary-500" />
            Daftar Produk
          </h3>

          <!-- Info banner jika dari PO -->
          <div v-if="form.purchase_order_id" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-700 dark:text-blue-300 flex items-center">
              <Icon name="InformationCircle" class="w-4 h-4 mr-2" />
              Pembelian ini dibuat dari Purchase Order. Item dari PO tidak dapat dihapus. Item tambahan akan ditandai sebagai "Non-PO Item".
            </p>
          </div>

          <!-- Product Search - tetap aktif meskipun dari PO -->
          <div class="mb-4 flex space-x-2">
            <div class="flex-1 relative">
              <SearchDropdown
                ref="productSearchRef"
                id="product-search"
                v-model="productSearch"
                placeholder="Cari produk untuk ditambahkan..."
                :debounce="300"
                :min-search-length="3"
                item-key="id"
                item-label="name"
                not-found-text="Produk tidak ditemukan"
                not-found-subtext="Coba kata kunci lain atau tambahkan produk baru"
                add-button-text="Tambah Produk Baru"
                api-url="/api/v1/products/search"
                api-response-path="data.data"
                :api-params="{ per_page: 10 }"
                :use-api="true"
                @select="handleProductSelect"
                @items-loaded="onProductsLoaded"
              >
                <template #item="{ item }">
                  <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary-500 dark:text-secondary-400">{{ item.barcode || 'Tidak ada barcode' }}</span>
                    <span class="font-medium text-primary-600 dark:text-primary-400">Rp {{ formatCurrency(item.hargabeli) }}</span>
                  </div>
                </template>
              </SearchDropdown>
            </div>

            <!-- Barcode Scanner Button -->
            <button
              @click="showScanner = true"
              class="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
              title="Scan Barcode"
            >
              <Icon name="Scan" class="w-5 h-5" />
            </button>
          </div>

          <!-- Product Table -->
          <div class="overflow-x-auto">
            <!-- Desktop Table (tampil pada layar md ke atas) -->
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[35%]">
                    Produk
                  </th>
                  <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[25%]">
                    Harga
                  </th>
                  <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                    Jumlah
                  </th>
                  <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%]">
                    Subtotal
                  </th>
                  <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[5%]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="form.items.length === 0">
                  <td colspan="5" class="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada produk yang ditambahkan
                  </td>
                </tr>
                <tr v-for="(item, index) in form.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-3 py-4 whitespace-nowrap w-[35%]">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ item.product?.name }}
                      <span
                        v-if="form.purchase_order_id && item.is_additional"
                        class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      >
                        Non-PO
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right w-[25%]">
                    <BaseInput
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="w-full text-right"
                      @input="store.updateItemSubtotal(index)"
                    />
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right w-[15%]">
                    <BaseInput
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="w-full text-right"
                      @input="store.updateItemSubtotal(index)"
                    />
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white w-[20%]">
                    {{ formatCurrency(item.subtotal) }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right text-sm w-[5%]">
                    <button
                      v-if="!form.purchase_order_id || item.is_additional"
                      @click="store.removeItem(index)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Hapus item"
                    >
                      <Icon name="Trash" class="w-4 h-4" />
                    </button>
                    <span
                      v-else
                      class="inline-flex items-center justify-center p-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      title="Item dari Purchase Order tidak dapat dihapus"
                    >
                      <Icon name="Lock" class="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Mobile Card View (tampil pada layar kecil) -->
            <div class="md:hidden space-y-4">
              <div v-if="form.items.length === 0" class="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                Belum ada produk yang ditambahkan
              </div>

              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
                :class="{ 'border-l-4 border-l-amber-500': form.purchase_order_id && item.is_additional }"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      {{ item.product?.name }}
                      <span
                        v-if="form.purchase_order_id && item.is_additional"
                        class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      >
                        Non-PO
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product?.barcode }}</div>
                  </div>
                  <button
                    v-if="!form.purchase_order_id || item.is_additional"
                    @click="store.removeItem(index)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Hapus item"
                  >
                    <Icon name="Trash" class="w-4 h-4" />
                  </button>
                  <span
                    v-else
                    class="inline-flex items-center justify-center p-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    title="Item dari Purchase Order tidak dapat dihapus"
                  >
                    <Icon name="Lock" class="w-4 h-4" />
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Harga</label>
                    <BaseInput
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="w-full text-right"
                      @input="store.updateItemSubtotal(index)"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah</label>
                    <BaseInput
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="w-full text-right"
                      @input="store.updateItemSubtotal(index)"
                    />
                  </div>
                </div>

                <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.subtotal) }}</span>
                </div>
              </div>
            </div>
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
            <!-- Supplier Info telah dipindahkan ke atas -->

            <!-- Summary Items -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Total Item:</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ store.calculateTotalQuantity() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ formatCurrency(store.calculateTotal()) }}</span>
              </div>

              <!-- Discount -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Diskon:</span>
                <BaseInput
                  v-model.number="form.discount"
                  type="number"
                  min="0"
                  class="w-24 text-right"
                />
              </div>

              <!-- Tax -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Pajak (%):</span>
                <BaseInput
                  v-model.number="form.tax"
                  type="number"
                  min="0"
                  max="100"
                  class="w-24 text-right"
                />
              </div>
            </div>

            <!-- Grand Total -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-800 dark:text-gray-200 font-medium">Total Pembayaran:</span>
                <span class="text-lg text-primary-600 dark:text-primary-400 font-bold">
                  {{ formatCurrency(store.calculateGrandTotal()) }}
                </span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Metode Pembayaran
              </label>
              <div class="flex flex-wrap gap-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="form.payment_method"
                    value="cash"
                    class="form-radio text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Tunai</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="form.payment_method"
                    value="transfer"
                    class="form-radio text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Transfer Bank</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="form.payment_method"
                    value="credit"
                    class="form-radio text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Kredit</span>
                </label>
              </div>
            </div>

            <!-- Bank Details (for transfer payment) -->
            <div v-if="form.payment_method === 'transfer'" class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label for="bank-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank
              </label>
              <BaseInput
                id="bank-name"
                v-model="form.bank_name"
                placeholder="Nama Bank"
                class="w-full mb-2"
              />
              <label for="account-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nomor Rekening
              </label>
              <BaseInput
                id="account-number"
                v-model="form.account_number"
                placeholder="Nomor Rekening"
                class="w-full mb-2"
              />
              <label for="account-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Pemilik Rekening
              </label>
              <BaseInput
                id="account-name"
                v-model="form.account_name"
                placeholder="Nama Pemilik Rekening"
                class="w-full"
              />
            </div>

            <!-- Due Date (for credit payment) -->
            <div v-if="form.payment_method === 'credit'" class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label for="due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Jatuh Tempo
              </label>
              <BaseInput
                id="due-date"
                v-model="form.due_date"
                type="date"
                class="w-full"
              />
            </div>

            <!-- Notes -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Tambahkan catatan jika diperlukan..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barcode Scanner Modal -->
    <BarcodeScanner
      v-if="showScanner"
      @close="showScanner = false"
      @scan="store.handleBarcodeScan"
      @error="handleScanError"
    />

    <!-- Unsaved Changes Dialog -->
    <BaseDialog
      v-model="showUnsavedChangesDialog"
      title="Perubahan Belum Disimpan"
      :closable="true"
    >
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?
      </p>
      <div class="flex justify-end space-x-2">
        <BaseButton
          @click="showUnsavedChangesDialog = false"
          variant="secondary"
          size="md"
        >
          Batal
        </BaseButton>
        <BaseButton
          @click="store.confirmLeave(router)"
          variant="danger"
          size="md"
        >
          Tinggalkan
        </BaseButton>
      </div>
    </BaseDialog>

    <!-- Print Dialog -->
    <BaseDialog
      v-model="showPrintDialog"
      title="Cetak Faktur"
      :closable="true"
    >
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Transaksi berhasil disimpan. Apakah Anda ingin mencetak faktur sekarang?
      </p>
      <div class="flex justify-end space-x-2">
        <BaseButton
          @click="showPrintDialog = false"
          variant="secondary"
          size="md"
        >
          Nanti
        </BaseButton>
        <BaseButton
          @click="printInvoice"
          variant="primary"
          size="md"
        >
          Cetak
        </BaseButton>
      </div>
    </BaseDialog>

    <!-- Supplier Form Modal -->
    <SupplierForm
      v-if="showSupplierForm"
      v-model="showSupplierForm"
      :supplier="null"
      :is-edit="false"
      @close="handleSupplierFormClose"
      @submit="handleSupplierSubmit"
    />
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePurchaseFormStore } from '@/stores/transaksi/pembelian/form'
import { useNotification } from '@/composables/useNotification'
import { PURCHASE_STATUS } from '@/constants/transaction'
import { api } from '@/services/api'

// Admin Components (not registered globally)
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import SupplierForm from '@/components/admin/suppliers/SupplierForm.vue'
import { useSupplierStore } from '@/stores/admin/supplier'

// Inisialisasi router dan route
const router = useRouter()
const route = useRoute()
const productSearchRef = ref(null)
const { notify } = useNotification()
const showPrintDialog = ref(false)
// Pastikan showScanner diinisialisasi di sini jika tidak ada di store
const localShowScanner = ref(false)
// Tambahkan state untuk dialog tambah supplier
const showSupplierForm = ref(false)
const supplierStore = useSupplierStore()

// Route params
const purchaseOrderId = ref(route.query.purchaseOrderId || null)
const fromPage = ref(route.query.from || null)
const editMode = ref(route.params.id ? true : false)

// Initialize store
const store = usePurchaseFormStore()

// Gunakan storeToRefs untuk reaktivitas, dengan defensive coding
// Pastikan semua properti yang diambil dari store ada di state store
const storeRefs = storeToRefs(store)
const form = storeRefs.form || ref({})
const loading = storeRefs.loading || ref(false)
const isFormValid = storeRefs.isFormValid || ref(false)
const showScanner = storeRefs.showScanner || localShowScanner
const supplierSearch = storeRefs.supplierSearch || ref('')
const productSearch = storeRefs.productSearch || ref('')
const supplierLoading = storeRefs.supplierLoading || ref(false)
const productLoading = storeRefs.productLoading || ref(false)
const validationErrors = storeRefs.validationErrors || ref([])
const showUnsavedChangesDialog = storeRefs.showUnsavedChangesDialog || ref(false)

// Pastikan validationErrors diinisialisasi dengan array kosong jika undefined
if (!validationErrors.value) {
  validationErrors.value = []
}

// Computed properties dengan defensive coding
const pageTitle = computed(() => {
  if (editMode.value) return 'Edit Pembelian'
  return purchaseOrderId.value ? 'Buat Pembelian dari PO' : 'Buat Pembelian'
})

const pageSubtitle = computed(() => {
  if (editMode.value) return `Edit transaksi pembelian #${route.params.id || ''}`
  return purchaseOrderId.value
    ? `Membuat transaksi pembelian dari PO #${purchaseOrderId.value}`
    : 'Buat transaksi pembelian baru'
})

// Fungsi format currency dengan defensive coding
const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return 'Rp 0'
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  } catch (e) {
    console.error('Error formatting currency:', e)
    return 'Rp 0'
  }
}

/**
 * Handles form submission
 * Validates form, submits to API, and shows appropriate notifications
 */
const handleSubmit = async () => {
  try {
    // Validasi form terlebih dahulu
    const errors = store.validateForm ? store.validateForm() : []

    if (errors.length > 0) {
      validationErrors.value = errors
      notify({
        title: 'Validasi Gagal',
        message: 'Silakan perbaiki kesalahan pada form',
        type: 'error'
      })
      return
    }

    await store.submitForm()
    notify({
      title: 'Berhasil',
      message: editMode.value
        ? 'Transaksi pembelian berhasil diperbarui'
        : 'Transaksi pembelian berhasil disimpan',
      type: 'success'
    })
    router.push('/transaksi/pembelian')
  } catch (error) {
    notify({
      title: 'Gagal',
      message: error.message || 'Terjadi kesalahan saat menyimpan transaksi',
      type: 'error'
    })
  }
}

/**
 * Handles barcode scan errors
 * @param {Error} error - The error that occurred during scanning
 */
const handleScanError = (error) => {
  notify({
    title: 'Scan Gagal',
    message: error.message || 'Gagal memindai barcode',
    type: 'error'
  })
}

/**
 * Print invoice
 */
const printInvoice = async () => {
  if (editMode.value && form.value && form.value.id) {
    try {
      await store.generateInvoice()
    } catch (error) {
      notify({
        title: 'Gagal',
        message: 'Gagal mencetak faktur',
        type: 'error'
      })
    }
  } else {
    // For new purchases, show print dialog after saving
    showPrintDialog.value = true
  }
}

/**
 * Focuses the product search input if it exists
 */
const focusProductSearch = () => {
  if (productSearchRef.value) {
    productSearchRef.value.focus()
  }
}

// Fungsi untuk menangani pemilihan supplier
const handleSupplierSelect = (supplier) => {
  // Simpan supplier ke form
  form.value.supplier = supplier;
  form.value.supplier_id = supplier.id;

  // Kosongkan input pencarian
  supplierSearch.value = '';

  // Fokus ke input berikutnya (misalnya tanggal atau nomor faktur)
  nextTick(() => {
    const nextInput = document.getElementById('purchase-date') ||
                      document.getElementById('invoice-number');
    if (nextInput) nextInput.focus();
  });

  // Tampilkan notifikasi jika diperlukan
  if (typeof notify === 'function') {
    notify({
      title: 'Supplier Dipilih',
      message: `${supplier.name} telah dipilih sebagai supplier`,
      type: 'success'
    });
  }
}

// Fungsi untuk menghapus supplier yang dipilih
const clearSelectedSupplier = () => {
  // Konfirmasi jika ada item yang sudah ditambahkan
  if (form.value.items && form.value.items.length > 0) {
    if (!confirm('Menghapus supplier akan menghapus semua item. Lanjutkan?')) {
      return;
    }
    // Kosongkan daftar item jika konfirmasi diterima
    form.value.items = [];
  }

  // Hapus supplier dari form
  form.value.supplier = null;
  form.value.supplier_id = null;

  // Fokus kembali ke pencarian supplier
  nextTick(() => {
    const supplierSearch = document.getElementById('supplier-search');
    if (supplierSearch) supplierSearch.focus();
  });
}

// Fungsi untuk menangani data supplier yang dimuat
const onSuppliersLoaded = (suppliers) => {
  // Simpan daftar supplier jika diperlukan
  if (suppliers && suppliers.length > 0) {
    // Misalnya, simpan ke state lokal atau store
    store.suppliers = suppliers;
  }
}

// Fungsi untuk membuka dialog tambah supplier
const openAddSupplierDialog = () => {
  showSupplierForm.value = true
}

// Fungsi untuk menangani submit form supplier
const handleSupplierSubmit = async (formData) => {
  try {
    const newSupplier = await supplierStore.addSupplier(formData)
    showSupplierForm.value = false

    // Otomatis pilih supplier yang baru ditambahkan
    if (newSupplier?.id) {
      handleSupplierSelect(newSupplier)
    }

    notify({
      title: 'Berhasil',
      message: 'Supplier baru berhasil ditambahkan',
      type: 'success'
    })
  } catch (error) {
    notify({
      title: 'Gagal',
      message: error.message || 'Gagal menambahkan supplier',
      type: 'error'
    })
  }
}

// Fungsi untuk menangani close form supplier
const handleSupplierFormClose = () => {
  showSupplierForm.value = false
}

// Fungsi untuk menangani hasil scan barcode
const handleBarcodeScan = (barcode) => {
  showScanner.value = false
  productSearch.value = barcode

  // Gunakan ref untuk memanggil metode fetchFromApi pada komponen SearchDropdown
  if (productSearchRef.value) {
    productSearchRef.value.fetchFromApi(barcode)
  }
}

// Handler untuk event items-loaded
const onProductsLoaded = (products) => {
  // Jika hanya ada satu produk dan itu hasil dari scan barcode, tambahkan langsung
  if (products && products.length === 1 && productSearch.value.length > 5) {
    store.addProduct(products[0])
    productSearch.value = ''
  }
}

// Fungsi untuk menangani pemilihan produk
const handleProductSelect = (product) => {
  // Tambahkan produk ke daftar
  store.addProduct(product)

  // Kosongkan text pencarian
  productSearch.value = ''

  // Fokus kembali ke input pencarian
  // Gunakan nextTick untuk memastikan DOM telah diperbarui
  nextTick(() => {
    try {
      // Coba gunakan metode focus yang diexpose oleh komponen
      if (productSearchRef.value) {
        productSearchRef.value.focus()
      }
    } catch (error) {
      console.warn('Could not focus search input:', error)

      // Fallback: cari input langsung
      const searchInput = document.querySelector('#product-search input')
      if (searchInput) {
        searchInput.focus()
      }
    }
  })
}

// Lifecycle hooks
onMounted(async () => {
  // Set initial state based on route
  if (store.setFromPage) {
    store.setFromPage(fromPage.value)
  }

  if (purchaseOrderId.value) {
    store.setPurchaseOrderId(purchaseOrderId.value)
  }

  // If editing, fetch purchase data
  if (editMode.value && route.params.id) {
    try {
      await store.fetchPurchase(route.params.id)
    } catch (error) {
      notify({
        title: 'Gagal',
        message: 'Gagal memuat data pembelian',
        type: 'error'
      })
      router.push('/admin/transaksi/pembelian')
    }
  }
})

// Cleanup on component unmount
onBeforeUnmount(() => {
  // Cleanup any event listeners or timers
  if (showScanner.value) {
    showScanner.value = false
  }
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
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
</style>


