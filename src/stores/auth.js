import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth-store', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isError: false,
    loading: false,


    form : {
      email: '',
      password: ''
    }
  }),

  persist: true,

  actions: {
    setUser(user, token) {
      this.user = user
      this.token = token
      this.isAuthenticated = !!user
    },
    setLoading(status) {
      this.loading = status
    },

    async login() {

      this.loading = true

      try {
        const response = await api.post('/api/v1/login', this.form)
        this.setUser(response.data.user, response.data.token)
        // return response
      } catch (error) {
        console.error('Login error:', error)
        this.isError = true
        setTimeout(() => {
          this.isError = false
        }, 3000)
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.form.email = ''
      this.form.password = ''
    },

    async logout() {
      this.loading = true

      // try {
      //   await api.post('/api/v1/logout')


      // } catch (error) {
      //   console.error('Logout error:', error)
      // } finally {


        this.loading = false
        this.user = null
        this.token = null
        this.isAuthenticated = false

        localStorage?.removeItem('auth-store')
        localStorage?.removeItem('salesFormWitTabs')
        localStorage?.removeItem('company-store')
        localStorage?.removeItem('order')
        localStorage?.removeItem('penerimaan')
        localStorage?.removeItem('satuan')
      // }


    },

  },



  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))

}
