<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-800 via-secondary-900 to-gray-800 flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 relative overflow-hidden">
      <!-- Gradient Glow Border -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-500 to-secondary-500 opacity-20 blur-2xl animate-pulse">
      </div>

      <!-- Content -->
      <div class="relative z-10">
        <h2 class="text-3xl font-bold text-white mb-2 text-center animate-fade-in">YAUMI 47</h2>
        <h2 class="text-3xl font-bold text-white mb-2 text-center animate-fade-in">Selamat Datang</h2>
        <p class="text-indigo-200 text-center mb-6 animate-fade-in delay-200">Harap Login dahulu</p>

        <form @submit.prevent="handleLogin" class="space-y-4 animate-slide-up">
          <div>
            <label class="block text-indigo-100 text-sm mb-1">Username</label>
            <input type="text" v-model="form.email"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label class="block text-indigo-100 text-sm mb-1">Password</label>
            <input type="password" v-model="form.password"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="••••••••" required />
          </div>
          <!-- <button type="submit"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            Login
          </button> -->

          <div v-if="isError" class="text-center mt-6 text-sm text-gray-300 animate-fade-in bg-red-600 p-4">
            <!-- <a href="#" class="text-indigo-100 hover:underline">Forgot Password?</a> -->
            <div>Maaf Login Gagal </div>
            <div>Harap Ulangi Credential anda !!! </div>
          </div>

          <hr class="bg-white/20 border-0 h-px my-8" />

          <div class="mt-12">
            <BaseButton color="secondary" type="submit" :loading="loading"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
              <template #icon-left>
                <Icon name="bolt" class="w-4 h-4 mr-2" />
              </template>
              Login
            </BaseButton>
          </div>
        </form>

        <div class="text-center mt-6 text-sm text-indigo-300 animate-fade-in delay-500">
          Don’t have an account? <a href="#" class="text-indigo-100 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useAuthStore()
const { form, loading, isError } = storeToRefs(store)
const { login } = store

onMounted(() => {
  isError.value = false
  loading.value = false
})

const handleLogin = async () => {
  // console.log('form', form.value);

  try {
    await login()
    router.push('/admin') // redirect ke dashboard
  } catch (err) {
    console.log(err);
  }
}
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease forwards;
}

.animate-slide-up {
  animation: slide-up 1s ease forwards;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-500 {
  animation-delay: 0.5s;
}
</style>
