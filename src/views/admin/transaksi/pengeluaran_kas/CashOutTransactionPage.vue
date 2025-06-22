<template>
  <CashOutForm @submit="handleSubmit" />
</template>

<script setup>
import CashOutForm from './CashOutForm.vue'

const handleSubmit = (data) => {
  console.log('Pengeluaran kas:', data)
  // Kirim ke backend
}
</script>
