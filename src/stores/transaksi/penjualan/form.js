import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSalesFormStore = defineStore('salesForm', {
  state: () => ({
    customer_id: null,
    items: [
      // { product_id: null, qty: 1, price: 0 }
    ],
    paid: 0,
    notes: '',
    payment_method: '',
    discount: 0,
    tax: 0,
    reference: '',
    cashier_id: null
  }),
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
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalesFormStore, import.meta.hot))
}
