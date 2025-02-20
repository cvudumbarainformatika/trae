<script setup>
import { ref } from 'vue'
import { useMainStore } from '../stores'

const store = useMainStore()
const welcomeMessage = ref('Welcome to Your Vue.js Application')
</script>

<template>
  <div class="home">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">{{ welcomeMessage }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul class="space-y-2 text-gray-600">
            <li>Vue 3 with Composition API</li>
            <li>Vite for rapid development</li>
            <li>Pinia for state management</li>
            <li>Vue Router for navigation</li>
            <li>TailwindCSS for styling</li>
          </ul>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Getting Started</h2>
          <p class="text-gray-600">
            This template provides a minimal setup to get Vue working in Vite with HMR and some ESLint rules.
            Start building your application by modifying components and adding new features.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Resources</h2>
          <div class="space-y-2">
            <a href="https://vuejs.org/" target="_blank" class="text-blue-600 hover:text-blue-800 block">Vue.js Documentation</a>
            <a href="https://vitejs.dev/" target="_blank" class="text-blue-600 hover:text-blue-800 block">Vite Documentation</a>
            <a href="https://pinia.vuejs.org/" target="_blank" class="text-blue-600 hover:text-blue-800 block">Pinia Documentation</a>
            <a href="https://tailwindcss.com/" target="_blank" class="text-blue-600 hover:text-blue-800 block">Tailwind CSS Documentation</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>