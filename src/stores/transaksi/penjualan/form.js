import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSalesFormStore = defineStore('salesForm', {
  state: () => ({
    customer_id: null,
    customer: null,
    category: 'umum',
    unique_code: null,
    paid: 0,
    notes: '',
    payment_method: '',
    discount: 0,
    tax: 0,
    reference: '',
    cashier_id: null,
    date: null,
    due_date: null,
    items: [
      // { product_id: null, qty: 1, price: 0, subtotal: 0  }
    ],



    existingItemHighlighted: null,
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.qty, 0)
    },
    total: (state) => {
      return state.items.reduce((total, item) => total + item.subtotal, 0)
    },
  },

  actions: {
    resetForm() {
      this.customer_id = null
      this.items = []
      this.paid = 0
      this.notes = ''
      this.payment_method = ''
      this.discount = 0
      this.tax = 0
      this.reference = ''
      this.cashier_id = null
    },
    setField(nama, nilai) {
      if (Object.prototype.hasOwnProperty.call(this, nama)) {
        this[nama] = nilai
      }
    },
    addItem(item) {

      const existingItem = this.items.find((i) => i.product_id === item.product_id)
      if (existingItem) {
        const newQty = existingItem.qty + item.qty
        existingItem.qty += item.qty
        existingItem.subtotal = item.price * newQty

        // Trigger highlight (e.g. berkedip)
        this.existingItemHighlighted = existingItem.product_id
        // Hapus efek setelah 1 detik
        setTimeout(() => {
          this.existingItemHighlighted = null
        }, 1000)

        return
      }

      this.items.push(item)
    },
    updateItem(index, item) {
      this.items[index] = item
    },
    removeItem(index) {
      this.items.splice(index, 1)
    },
    setItems(items) {
      this.items = items
    },

    generateUniqueCode() {
      const now = new Date()

      const pad = (n) => n.toString().padStart(2, '0')

      const year = now.getFullYear()
      const month = pad(now.getMonth() + 1) // 0-based
      const day = pad(now.getDate())
      const hour = pad(now.getHours())
      const minute = pad(now.getMinutes())
      const second = pad(now.getSeconds())
      const millis = pad(now.getMilliseconds(), 3) // tambahkan milidetik

      const randomDigits = Math.floor(100 + Math.random() * 900) // Angka 3 digit acak (100–999)

      this.unique_code = `PJL-${year}${month}${day}${hour}${minute}${second}${millis}-${randomDigits}`
    },


    simpanPenjualan() {
      const form ={
        customer_id: this.customer_id,
        items: this.items,
        paid: this.paid,
        notes: this.notes,
        payment_method: this.payment_method,
        discount: this.discount,
        tax: this.tax,
        reference: this.reference,
        cashier_id: this.cashier_id,
        date: this.date,
        category: this.category,
      }
      // Lakukan proses penyimpanan penjualan
      // Misalnya, kirim data penjualan ke server menggunakan API
      // Atau simpan data penjualan ke dalam database
      // Setelah penyimpanan berhasil, reset form
      // this.resetForm()
      console.log(form);

    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalesFormStore, import.meta.hot))
}
