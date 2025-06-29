
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useCashFlowStore } from '.'

export const useCashFlowFormStore = defineStore('CashFlowFormStore', {
  state: () => ({
    item:null,
    loading: false
  }),

  getters: {

  },

  actions: {

    async simpan(form) {

      this.loading = true

      const store = useCashFlowStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.post('/api/v1/cash-flows', form);
        console.log('API response:', response);


        await store.fetchData();
        store.showCreateDialog = false
        this.item = null
        // showCreateDialog.value = false;
        // resetForm();

        return response
      } catch (error) {
        console.error('Error cash flow:', error);
        throw error;
      } finally {
        this.loading = false;
      }



    },

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCashFlowFormStore, import.meta.hot))
}
