
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useReturnPembelianStore } from '.'

export const useReturnPembelianFormStore = defineStore('returnPembelianFormStore', {
  state: () => ({
    item:null,
    loading: false
  }),

  getters: {

  },

  actions: {

    async simpanReturn(form) {

      this.loading = true

      const store = useReturnPembelianStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.post('/api/v1/return-pembelian', form);
        console.log('API response:', response);


        await store.fetchData();
        store.showCreateDialog = false
        this.item = null
        // showCreateDialog.value = false;
        // resetForm();

        return response
      } catch (error) {
        console.error('Error return pembelian:', error);
        throw error;
      } finally {
        this.loading = false;
      }



    },

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReturnPembelianFormStore, import.meta.hot))
}
