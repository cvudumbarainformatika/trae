<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { user, loading } = storeToRefs(auth)


const router = useRouter()

const handleLogout = async () => {
  try {
    await auth.logout()
    router.push('/login')
  } catch (err) {
    console.log(err)
  }
}



</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Profile</h1>

    <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
      <div class="flex items-center space-x-6 text-indigo-500">
        <!-- <img src="https://i.pravatar.cc/100?img=12" alt="Avatar"
          class="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg" /> -->
        <Icon name="User" class="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg" />
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ user?.name }}
          </h2>
          <p class="text-gray-500 dark:text-gray-300">{{ user?.email }}</p>
        </div>
      </div>


      <hr class="mt-8 border-gray-200 dark:border-gray-700" />
      <div class="mt-8 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Nama</label>
            <div
              class="p-4 mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {{ user?.name }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
            <div
              class="p-4 mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {{ user?.email }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Username</label>
            <div
              class="p-4 mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {{ user?.username }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Role</label>
            <div
              class="p-4 mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {{ user?.role || '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 flex justify-end py-8">
        <BaseButton color="secondary" :loading="loading" @click="handleLogout"
          class="w-full bg-gradient-to-r from-red-600 to-orange-800 shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-102 hover:translate-y-[-2px]">
          <template #icon-left>
            <Icon name="bolt" class="w-4 h-4 mr-2" />
          </template>
          Logout
        </BaseButton>
      </div>



    </div>
  </div>
</template>
