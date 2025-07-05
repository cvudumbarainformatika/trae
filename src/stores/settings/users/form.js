
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useUsersStore } from '.'

export const useUsersFormStore = defineStore('users-form-store', {
  state: () => ({
    item:null,
    showEditDialog: false,
    loading: false
  }),

  getters: {

  },

  actions: {

    async simpanData(form) {

      this.loading = true

      const store = useUsersStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.post('/api/v1/users', form);
        // console.log('API response:', response);


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
    async updateData(form) {

      this.loading = true

      const store = useUsersStore()

      try {
        // console.log('Updating form to API:', form);
        const response = await api.put(`/api/v1/users/${form.id}`, form);
        console.log('API response:', response);


        await store.fetchData();
        this.showEditDialog = false
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
  import.meta.hot.accept(acceptHMRUpdate(useUsersFormStore, import.meta.hot))
}
