
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSalesFormWitTabsStore = defineStore('salesFormWitTabs', {
  state: () => ({
    tabs:[
    ],
    activeTab: null,
    isPaymentOpen: false,
    loadingSimpan: false,
    riwayats: [],
    printing: false,
    isiPrint: null
  }),


  persist:true,

  getters: {
    isiTab: (state) => {
      return state.tabs.find(tab => tab.unique_code === state.activeTab) || null
    },
    listItems: (state) => {
      return state.tabs.find(tab => tab.unique_code === state.activeTab)?.items || []
    },
    totalItems: (state) => {
      const list = state.tabs.find(tab => tab.unique_code === state.activeTab)?.items || []
      return list?.reduce((total, item) => total + item.qty, 0)
    },
    total: (state) => {
      const list = state.tabs.find(tab => tab.unique_code === state.activeTab)?.items || []
      return list?.reduce((total, item) => total + item.subtotal, 0)
    },
  },

  actions: {
    initTabs() {
      if (this.tabs.length === 0) {
        const unique_code = this.generateUniqueCode()
        this.tabs.push({
          customer_id: null,
          customer: null,
          category: 'umum',
          unique_code,
          paid: 0,
          notes: '',
          payment_method: '',
          discount: 0,
          tax: 0,
          cashier_id: null,
          date: null,
          due_date: null,

          items: [
            // { product_id: null, qty: 1, price: 0, subtotal: 0  }
          ],
          itemIndexOnDelete: null,
          showDeleteConfirm: false,
          existingItemHighlighted: null,
        })
        this.activeTab = unique_code
      }
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

      return `PJL-${year}${month}${day}${hour}${minute}${second}${millis}-${randomDigits}`
    },
    generateTabBaru() {
      const unique_code = this.generateUniqueCode()
      this.tabs.push({
        customer_id: null,
        customer: null,
        category: 'umum',
        unique_code,
        paid: 0,
        notes: '',
        payment_method: '',
        discount: 0,
        tax: 0,
        cashier_id: null,
        date: null,
        due_date: null,
        items: [
          // { product_id: null, qty: 1, price: 0, subtotal: 0  }
        ],
        itemIndexOnDelete: null,
        showDeleteConfirm: false,
        existingItemHighlighted: null,
      })
      this.activeTab = unique_code
    },

    removeTab(unique_code) {
      this.tabs = this.tabs.filter(tab => tab.unique_code !== unique_code)




      // if (this.tabs.length === 0) {
      //   this.generateTabBaru()
      // }



      if (this.tabs.length > 0) {
        // console.log('tab > 0');
        this.activeTab = this.tabs[this.tabs.length - 1].unique_code
      }
      // else {
      //   // console.log('tab = 0');
      //   this.generateTabBaru()
      // }
    },


    // fungsional untuk items
    addItem(item) {
      const existingItem = this.isiTab?.items?.find((i) => i.product_id === item.product_id) || null
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
      this.isiTab.items.push(item)
    },
    updateItem(index, item) {
      this.isiTab.items[index] = item
    },
    removeItem(index) {
      this.isiTab.itemIndexOnDelete = index
      this.isiTab.showDeleteConfirm = true
    },

    confirmDeleteItem() {
      this.isiTab.items.splice(this.isiTab.itemIndexOnDelete, 1)
      this.isiTab.showDeleteConfirm = false
      this.isiTab.itemIndexOnDelete = null
    },

    cancelDeleteItem() {
      this.isiTab.itemIndexOnDelete = null
      this.isiTab.showDeleteConfirm = false
    },

    setItems(items) {
      this.isiTab.items = items
    },

    increaseQty(index) {
      // console.log('index from store form', index);

      const item = this.isiTab.items[index]
      if (!item) return
      item.qty = (item.qty || 1) + 1
      item.subtotal = (item.price || 0) * item.qty
      this.updateItem(index, item)
    },

    decreaseQty(index) {
      const item = this.isiTab.items[index]
      if (!item) return
      if (item.qty > 1) {
        item.qty -= 1
        item.subtotal = (item.price || 0) * item.qty
        this.updateItem(index, item)
      }
    },

    simpanPenjualan() {
      this.isPaymentOpen = true


    },

    async handlePayment(data){

      const dp = data.payment_method === 'credit' ? data.dp || 0 : 0
      const tempo = data.payment_method === 'credit' ? data.tempo || 0 : 0

      const paid = data.payment_method !== 'credit' ? data.pembayaran || 0 : data.dp || 0
      const kembali = data.payment_method !== 'credit' ? data.kembali || 0 : 0

      const form ={
        customer_id: this.isiTab.customer_id,
        items: this.isiTab.items,
        total: data.total,
        paid,
        bayar: paid,
        kembali,
        notes: data.notes,
        payment_method: data.payment_method,
        discount: data.discount || 0,
        tax: data.tax || 0,
        reference: this.isiTab.unique_code,
        unique_code: this.isiTab.unique_code,
        cashier_id: this.isiTab.cashier_id,
        date: null,
        category: this.isiTab.category,
        dp,
        tempo
      }
      // Lakukan proses penyimpanan penjualan
      // Misalnya, kirim data penjualan ke server menggunakan API
      // Atau simpan data penjualan ke dalam database
      // Setelah penyimpanan berhasil, reset form
      // this.resetForm()
      // console.log('handlePayment',form);

      // setTimeout(() => {
      //   this.isPaymentOpen = false
      //   this.removeTab(this.isiTab.unique_code)
      //   this.generateTabBaru()
      // }, 1000)


      await api.post('/api/v1/sales', form)
      .then((res) => {
        // console.log(res);
        this.printing = true
        this.isiPrint = res?.data?.sales
        this.riwayats.unshift(res?.data?.sales)
        this.riwayats = this.riwayats.slice(0, 5)

        // const existing = this.riwwayats || []
        // const newData = res?.data?.sales
        // const updated = [newData, ...existing].slice(0, 5)

        // this.riwwayats = updated

        this.isPaymentOpen = false
        this.removeTab(this.isiTab.unique_code)
        this.generateTabBaru()
      })
      .catch((err) => {
        console.log(err);
      })
      .finally()

    }


  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalesFormWitTabsStore, import.meta.hot))
}
