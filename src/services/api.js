import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8182',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const auth = useAuthStore()
    const token = auth.token
    // console.log('token', token);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Improve error handling
    if (error.response) {
      // Extract more detailed error message if available
      const responseData = error.response.data

      if (responseData.message && responseData.error) {
        // Combine message and error details
        error.message = `${responseData.message} ${responseData.error}`
      } else if (responseData.message) {
        error.message = responseData.message
      } else if (responseData.error) {
        error.message = responseData.error
      }

      // Handle validation errors
      if (responseData.errors) {
        // Convert validation errors object to array of error messages
        const validationErrors = Object.values(responseData.errors).flat()
        if (validationErrors.length > 0) {
          error.validationErrors = validationErrors
          error.message = validationErrors.join(', ')
        }
      }

      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear token and redirect to login
        const auth = useAuthStore()
        auth.logout()
        // window.location.href = '/login'
      }
    } else if (error.request) {
      // The request was made but no response was received
      error.message = 'Tidak ada respons dari server. Periksa koneksi internet Anda.'
    }

    return Promise.reject(error)
  }
)

export { api }
