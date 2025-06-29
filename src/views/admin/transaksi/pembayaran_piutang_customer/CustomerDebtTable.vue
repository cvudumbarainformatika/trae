<template>
  <div>
    <div v-if="items.length"
      class="overflow-x-auto rounded-lg shadow relative border border-secondary-200 dark:border-secondary-700">
      <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-secondary-700 w-full text-sm ">
        <thead class="bg-gray-100 dark:bg-secondary-900 text-gray-200 dark:text-gray-500">
          <tr>
            <th class="px-4 py-2">No Invoice</th>
            <th class="px-4 py-2 text-center">Tanggal</th>
            <th class="px-4 py-2 text-right">Total</th>
            <th class="px-4 py-2 text-right">Terbayar</th>
            <th class="px-4 py-2 text-right">Sisa</th>
          </tr>
        </thead>
        <tbody class="text-gray-200 dark:text-gray-500">
          <tr v-for="inv in items" :key="inv.id" class="border-t border-gray-200 dark:border-secondary-700">
            <td class="px-4 py-2">{{ inv?.faktur }}</td>
            <td class="px-4 py-2 text-center">{{ formatDateIndo(inv?.tanggal) }}</td>
            <td class="px-4 py-2 text-right">{{ formatRupiah(inv?.total) }}</td>
            <td class="px-4 py-2 text-right">{{ formatRupiah(inv?.dibayar) }}</td>
            <td class="px-4 py-2 text-right text-red-600">{{ formatRupiah(inv?.sisa) }}</td>
            <!-- <td class="px-4 py-2 text-right">
              <input type="number" v-model.number="inv.bayar" :max="inv.sisa" min="0"
                class="w-24 border px-2 py-1 rounded text-right" />
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data By Invoice Atau Supplier Telebih Dahulu"
        icon="Package" action-label="Add Product" />
    </div>
  </div>
</template>

<script setup>
import { formatRupiah } from '@/utils/uangHelper'
import { formatDateIndo } from '@/utils/dateHelper'
defineProps({ items: { type: Array, default: () => [] }, data: { type: Object, default: null } })
</script>
