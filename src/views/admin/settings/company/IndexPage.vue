<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useCompanyStore } from '@/stores/settings/company'
import { useNotification } from '@/composables/useNotification'

const store = useCompanyStore()
const { notify } = useNotification()
onMounted(() => {
  Promise.all([
    store.fetchData()
  ])
})

const themeStore = useThemeStore()

const settings = ref({
  siteName: 'Trae Admin',
  siteDescription: 'Modern Vue.js Admin Dashboard',
  emailNotifications: true,
  darkMode: themeStore.isDark,
  language: 'en',
  timezone: 'UTC'
})

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
]

const timezones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo'
]

const saveSettings = () => {
  // TODO: Implement settings save functionality
  // console.log('Settings saved:', store.form)
  store.saveData()
    .then(() => {
      notify({
        title: 'Berhasil',
        message: 'Data berhasil disimpan',
        type: 'success'
      })
    })
    .catch(() => {
      notify({
        title: 'Gagal',
        message: 'Data gagal disimpan',
        type: 'error'
      })
    })
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{{ store.header?.title }}</h1>

    <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
      <form @submit.prevent="saveSettings" class="space-y-6">
        <!-- Site Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ store.header?.subtitle }}</h2>

          <div>
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Site Name</label>
            <input v-model="settings.siteName" type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-700 dark:text-white"> -->
            <base-input v-model="store.form.name" label="Nama Perusahaan/ Toko" type="text" required />
          </div>

          <div>
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Site Description</label>
            <textarea v-model="settings.siteDescription" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-700 dark:text-white"></textarea> -->
            <base-input v-model="store.form.address" label="Alamat Perusahaan/ Toko" type="text" required />
          </div>
        </div>

        <!-- Preferences -->
        <div class="space-y-4">
          <!-- <h2 class="text-lg font-medium text-gray-900 dark:text-white">Preferences</h2>

          <div class="flex items-center">
            <input v-model="settings.emailNotifications" type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600">
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Enable Email Notifications</label>
          </div>

          <div class="flex items-center">
            <input v-model="settings.darkMode" type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              @change="themeStore.toggleTheme()">
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Dark Mode</label>
          </div> -->

          <base-input v-model="store.form.phone" label="Phone" type="text" required />

          <div>
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select v-model="settings.language"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select> -->
          </div>

          <div>
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
            <select v-model="settings.timezone"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
            </select> -->
          </div>
        </div>

        <div class="flex justify-end">
          <!-- <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button> -->
          <base-button type="submit" label="Simpan Perubahan"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" :loading="store.loading" />
        </div>
      </form>
    </div>
  </div>
</template>
