
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useBayarHutangStore } from '.'

export const useBayarHutangFormStore = defineStore('bayarHutangFormStore', {
  state: () => ({
    item:null,
    loading: false
  }),

  getters: {

  },

  actions: {

    async simpanPembayaran(form) {

      this.loading = true

      const store = useBayarHutangStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.post('/api/v1/pembayaran-hutang', form);
        console.log('API response:', response);


        await store.fetchData();
        store.showCreateDialog = false
        this.item = null
        // showCreateDialog.value = false;
        // resetForm();

        return response
      } catch (error) {
        console.error('Error pembayaran hutang:', error);
        throw error;
      } finally {
        this.loading = false;
      }



    },

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBayarHutangFormStore, import.meta.hot))
}
