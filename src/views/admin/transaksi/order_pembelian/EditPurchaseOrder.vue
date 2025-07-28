<template>
  <BasePage title="Edit Purchase Order">
    <template #actions>
      <BaseButton @click="$router.back()" variant="secondary">
        <template #icon-left>
          <Icon name="ArrowLeft" class="w-4 h-4" />
        </template>
        Kembali
      </BaseButton>
    </template>

    <!-- Hapus kondisi v-if untuk memastikan form selalu muncul -->
    <div>
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <PurchaseOrderForm v-if="!loading" :purchase-order-id="purchaseOrderId" :edit-mode="true"
        @success="handleSuccess" />
    </div>
  </BasePage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import BasePage from '@/components/ui/BasePage.vue'
// import BaseButton from '@/components/ui/BaseButton.vue'
// import Icon from '@/components/ui/Icon.vue'
import PurchaseOrderForm from '@/views/admin/transaksi/order_pembelian/PurchaseOrderForm.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const purchaseOrderId = ref(parseInt(route.params.id))

onMounted(async () => {
  // Validasi ID
  if (!purchaseOrderId.value) {
    router.push('/admin/transaksi/po')
    return
  }

  // Tambahkan delay kecil untuk memastikan komponen dimuat
  setTimeout(() => {
    loading.value = false
    console.log('Loading set to false, purchaseOrderId:', purchaseOrderId.value)
  }, 500)
})

const handleSuccess = () => {
  // Redirect ke halaman detail setelah berhasil update
  router.push(`/admin/transaksi/po/detail/${purchaseOrderId.value}`)
}
</script>
