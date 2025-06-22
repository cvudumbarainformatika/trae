<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="print:hidden">
      <h1 class="text-2xl font-bold mb-6">Laporan Penjualan</h1>
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="exportToExcel">
            Export Excel
          </button>
          <button class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" @click="cetak">
            Cetak
          </button>
        </div>

        <div>
          <label class="text-sm font-medium">Tampilkan:</label>
          <select v-model="mode" class="border px-2 py-1 rounded ml-2">
            <option value="invoice">Per Invoice</option>
            <option value="barang">Per Barang</option>
            <option value="kategori">Per Kategori</option>
          </select>
        </div>
      </div>


      <SalesReportFilter @filter="loadData" />
    </div>
    <!-- Atur bagian tabel seperti ini -->
    <div id="laporan-cetak" class="bg-white p-4 print:p-0 print:shadow-none print-area">
      <SalesReportTable v-if="report.length" :transaksi="report" />
      <table v-else-if="mode === 'barang'" class="w-full text-sm border">
        <thead>
          <tr>
            <th>Barang</th>
            <th>Qty</th>
            <th>Harga</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in reportPerBarang" :key="b.nama">
            <td>{{ b.nama }}</td>
            <td>{{ b.qty }}</td>
            <td>{{ formatRupiah(b.harga) }}</td>
            <td>{{ formatRupiah(b.subtotal) }}</td>
          </tr>
        </tbody>
      </table>

      <table v-else class="w-full text-sm border">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in reportPerKategori" :key="k.nama">
            <td>{{ k.nama }}</td>
            <td>{{ formatRupiah(k.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SalesReportFilter from './SalesReportFilter.vue'
import SalesReportTable from './SalesReportTable.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const mode = ref('invoice') // invoice | barang | kategori
const report = ref([])

const reportPerBarang = ref([
  { nama: 'Semen Tiga Roda', qty: 20, harga: 50000, subtotal: 1000000 },
  { nama: 'Batu Bata', qty: 1000, harga: 1000, subtotal: 1000000 }
])

const reportPerKategori = ref([
  { nama: 'Material Bangunan', total: 1500000 },
  { nama: 'Alat', total: 500000 }
])


const exportToExcel = () => {
  let exportData = []

  if (mode.value === 'invoice') {
    exportData = report.value.map((t) => ({
      'No Invoice': t.no_invoice,
      Tanggal: t.tanggal,
      Customer: t.customer,
      Total: t.total,
      Metode: t.metode,
      Kasir: t.kasir
    }))
  } else if (mode.value === 'barang') {
    exportData = reportPerBarang.value.map((b) => ({
      Barang: b.nama,
      Qty: b.qty,
      'Harga Satuan': b.harga,
      Subtotal: b.subtotal
    }))
  } else if (mode.value === 'kategori') {
    exportData = reportPerKategori.value.map((k) => ({
      Kategori: k.nama,
      Total: k.total
    }))
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream'
  })

  saveAs(blob, `laporan-penjualan-${mode.value}.xlsx`)
}

const loadData = (filter) => {
  // Simulasi data
  report.value = [
    {
      id: 1,
      no_invoice: 'INV-001',
      tanggal: '2025-06-01',
      customer: 'Budi',
      total: 350000,
      metode: 'Tunai',
      kasir: 'Kasir Andi'
    },
    {
      id: 2,
      no_invoice: 'INV-002',
      tanggal: '2025-06-02',
      customer: 'PT Beton',
      total: 720000,
      metode: 'Transfer',
      kasir: 'Kasir Rina'
    }
  ]
  // Lalu filter sesuai kebutuhan


}

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(v)
}

const cetak = () => {
  window.print()
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }

  #laporan-cetak,
  #laporan-cetak * {
    visibility: visible;
  }

  #laporan-cetak {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
