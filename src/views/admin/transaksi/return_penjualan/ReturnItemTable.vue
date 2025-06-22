<template>
  <table class="w-full text-sm text-left border mt-4">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Barang</th>
        <th class="px-4 py-2 text-center">Jumlah</th>
        <th class="px-4 py-2 text-center">Jumlah Retur</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id" class="border-t">
        <td class="px-4 py-2">{{ item.nama }}</td>
        <td class="px-4 py-2 text-center">{{ item.qty }}</td>
        <td class="px-4 py-2 text-center">
          <input type="number" v-model.number="item.return_qty" :max="item.qty" min="0"
            class="w-20 border px-2 py-1 rounded" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  items: Array
})
</script>
