<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'

const emit = defineEmits(['scan-success', 'scan-error', 'close'])
const scannerRef = ref(null)
let html5QrcodeScanner = null

onMounted(() => {
  html5QrcodeScanner = new Html5QrcodeScanner(
    'qr-reader',
    { fps: 10, qrbox: 250 },
    false
  )

  html5QrcodeScanner.render((decodedText) => {
    emit('scan-success', decodedText)
    html5QrcodeScanner.clear()
  }, (error) => {
    emit('scan-error', error)
  })
})

onUnmounted(() => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear()
  }
})

const handleClose = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear()
  }
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Scan Barcode</h3>
        <button
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      <div id="qr-reader" class="w-full"></div>
    </div>
  </div>
</template>