<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
    <div class="max-w-md w-full space-y-6">
      <div class="text-red-500">
        <!-- <LockIcon class="mx-auto h-16 w-16" /> -->
        <icon name="Lock" class="mx-auto h-16 w-16" />
      </div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Akses Ditolak</h1>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Kamu tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika kamu rasa ini adalah
        kesalahan.
      </p>
      <router-link to="/admin"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow">
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Lock } from 'lucide-vue-next' // Pastikan kamu install lucide-icon, atau ganti dengan icon lain

const LockIcon = Lock
</script>
