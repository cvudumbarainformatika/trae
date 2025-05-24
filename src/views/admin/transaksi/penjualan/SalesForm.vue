<script setup>
import { ref, computed, onMounted } from 'vue';

const categories = ['Semua', 'Minuman', 'Makanan', 'Cemilan'];
const products = [
  { id: 1, name: 'Kopi Hitam', price: 10000, category: 'Minuman' },
  { id: 2, name: 'Teh Manis', price: 8000, category: 'Minuman' },
  { id: 3, name: 'Nasi Goreng', price: 15000, category: 'Makanan' },
  { id: 4, name: 'Keripik Singkong', price: 5000, category: 'Cemilan' },
  { id: 5, name: 'Air Mineral', price: 3000, category: 'Minuman' },
];

const cart = ref([]);
const history = ref([]);
const selectedCategory = ref('Semua');
const searchQuery = ref('');
const searchBox = ref(null);
const lastClickedProduct = ref(null);
const showModal = ref(false);
const selectedReceipt = ref(null);

const showCart = ref(false);
const showHistory = ref(false);
const screenIsSmall = ref(window.innerWidth < 768);

window.addEventListener('resize', () => {
  screenIsSmall.value = window.innerWidth < 768;
});

const filteredProducts = computed(() => {
  return products.filter(p => {
    const matchCategory = selectedCategory.value === 'Semua' || p.category === selectedCategory.value;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

function addToCart(product) {
  lastClickedProduct.value = product;
  const found = cart.value.find(item => item.id === product.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.value.push({ ...product, qty: 1 });
  }
}

function removeItem(id) {
  cart.value = cart.value.filter(item => item.id !== id);
}

function removeLastItem() {
  if (cart.value.length > 0) {
    cart.value.pop();
  }
}

function clearCart() {
  cart.value = [];
}

function totalPrice() {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function decreaseQty(id) {
  const item = cart.value.find(i => i.id === id);
  if (item && item.qty > 1) item.qty -= 1;
  else removeItem(id);
}

function saveHistory() {
  localStorage.setItem('pos-history', JSON.stringify(history.value));
}

function processPayment() {
  if (cart.value.length === 0) return;
  history.value.push({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    items: JSON.parse(JSON.stringify(cart.value)),
    total: totalPrice(),
  });
  saveHistory();
  cart.value = [];
  alert('Pembayaran berhasil');
}

function showReceipt(trx) {
  selectedReceipt.value = trx;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedReceipt.value = null;
}

function handleKeydown(e) {
  if (e.key === 'F1') {
    e.preventDefault();
    processPayment();
  } else if (e.key === 'F2') {
    e.preventDefault();
    if (searchBox.value) searchBox.value.focus();
  } else if (e.key === 'F3') {
    e.preventDefault();
    if (cart.value.length > 0) {
      cart.value[cart.value.length - 1].qty += 1;
    }
  } else if (e.key === 'F4') {
    e.preventDefault();
    removeLastItem();
  } else if (e.key === 'F5') {
    e.preventDefault();
    clearCart();
  } else if (e.key === 'F6') {
    e.preventDefault();
    if (lastClickedProduct.value) {
      addToCart(lastClickedProduct.value);
    }
  } else if (e.key === 'Escape') {
    if (showModal.value) closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  const saved = localStorage.getItem('pos-history');
  if (saved) history.value = JSON.parse(saved);
});
</script>

<template>
  <!-- Tombol toggle khusus mobile -->
  <div class="md:hidden flex gap-2 p-2 bg-white shadow sticky top-0 z-10">
    <button @click="showCart = !showCart" class="flex-1 bg-blue-600 text-white py-2 rounded">Keranjang</button>
    <button @click="showHistory = !showHistory" class="flex-1 bg-gray-600 text-white py-2 rounded">Riwayat</button>
  </div>

  <!-- Layout responsif -->
  <div class="flex flex-col md:flex-row gap-4 p-4">
    <!-- Daftar Produk -->
    <div class="w-full md:w-2/3">
      <!-- Filter dan Pencarian -->
      <div class="mb-4">
        <input
          type="text"
          ref="searchBox"
          v-model="searchQuery"
          placeholder="Cari produk..."
          class="w-full p-2 border rounded mb-2"
        />
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700', 'px-3 py-1 rounded']"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      <!-- Grid Produk -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          @click="addToCart(product)"
          class="cursor-pointer p-4 bg-white rounded shadow hover:bg-blue-50"
        >
          <h3 class="font-semibold text-lg">{{ product.name }}</h3>
          <p class="text-gray-600">Rp {{ product.price.toLocaleString() }}</p>
          <p class="text-sm text-gray-400">Kategori: {{ product.category }}</p>
        </div>
      </div>
    </div>

    <!-- Keranjang -->
    <div v-show="!screenIsSmall || showCart" class="w-full md:w-1/3 bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-2">Keranjang</h2>
      <div v-if="cart.length === 0" class="text-gray-500 italic">Belum ada item</div>
      <div v-else class="space-y-2">
        <div
          v-for="item in cart"
          :key="item.id"
          class="border rounded p-2 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-sm text-gray-600">
              Rp {{ item.price.toLocaleString() }} x {{ item.qty }}
            </div>
            <div class="text-sm text-gray-800">
              Total: Rp {{ (item.price * item.qty).toLocaleString() }}
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <button @click="item.qty++" class="text-sm bg-green-500 text-white px-2 rounded">+</button>
            <button @click="decreaseQty(item.id)" class="text-sm bg-yellow-500 text-white px-2 rounded">-</button>
            <button @click="removeItem(item.id)" class="text-sm bg-red-600 text-white px-2 rounded">Hapus</button>
          </div>
        </div>
      </div>
      <div class="mt-4 border-t pt-2">
        <div class="font-bold">Total: Rp {{ totalPrice().toLocaleString() }}</div>
        <button
          @click="processPayment"
          class="w-full mt-2 bg-blue-600 text-white py-2 rounded"
        >
          Bayar (F1)
        </button>
      </div>
    </div>

    <!-- Riwayat -->
    <div v-show="!screenIsSmall || showHistory" class="w-full md:w-1/3 bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-2">Riwayat Transaksi</h2>
      <div v-if="history.length === 0" class="text-gray-500 italic">Belum ada transaksi</div>
      <div v-else class="space-y-2">
        <div v-for="trx in history" :key="trx.id" class="border rounded p-2">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-semibold">{{ trx.time }}</div>
              <div class="text-sm text-gray-600">{{ trx.items.length }} item - Rp {{ trx.total.toLocaleString() }}</div>
            </div>
            <button @click="showReceipt(trx)" class="text-sm bg-blue-500 text-white px-3 py-1 rounded">Lihat</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Nota -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h3 class="text-lg font-bold mb-2">Detail Transaksi</h3>
      <div v-if="selectedReceipt">
        <p class="text-sm text-gray-600">Waktu: {{ selectedReceipt.time }}</p>
        <ul class="mt-2 space-y-1">
          <li v-for="item in selectedReceipt.items" :key="item.id">
            {{ item.name }} x {{ item.qty }} = Rp {{ (item.qty * item.price).toLocaleString() }}
          </li>
        </ul>
        <p class="mt-2 font-semibold">Total: Rp {{ selectedReceipt.total.toLocaleString() }}</p>
        <button @click="closeModal" class="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Tutup</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  @apply bg-gray-50;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
