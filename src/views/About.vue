<script setup>
import { ref } from 'vue'

const pageTitle = ref('About Us')
</script>

<template>
  <div class="about">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">{{ pageTitle }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p class="text-gray-600">
            We are dedicated to creating high-quality web applications using modern technologies
            and best practices. Our goal is to deliver exceptional user experiences through
            clean, maintainable, and scalable code.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Technology Stack</h2>
          <p class="text-gray-600 mb-4">
            Our application is built with cutting-edge technologies:
          </p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>Vue.js 3 with Composition API</li>
            <li>Vite for blazing fast development</li>
            <li>Pinia for state management</li>
            <li>Vue Router for seamless navigation</li>
            <li>TailwindCSS for modern styling</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>