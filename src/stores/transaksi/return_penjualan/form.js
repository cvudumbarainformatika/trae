
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useReturnPenjualanStore } from '.'

export const useReturnPenjualanFormStore = defineStore('returnPenjualanFormStore', {
  state: () => ({
    item:null,
    loading: false
  }),

  getters: {

  },

  actions: {

    async simpanReturn(form) {

      this.loading = true

      const store = useReturnPenjualanStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.post('/api/v1/return-penjualan', form);
        console.log('API response:', response);


        await store.fetchData();
        store.showCreateDialog = false
        this.item = null
        // showCreateDialog.value = false;
        // resetForm();

        return response
      } catch (error) {
        console.error('Error updating purchase order:', error);
        throw error;
      } finally {
        this.loading = false;
      }



    },

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReturnPenjualanFormStore, import.meta.hot))
}
