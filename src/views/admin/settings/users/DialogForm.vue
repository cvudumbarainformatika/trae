<template>
  <BaseDialog title="Data Pengguna Baru" max-width="xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">

          <form @submit.prevent="submit">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <BaseInput v-model="form.name" label="Nama" class="w-full" required :error="nameError" />
              </div>

              <div>
                <BaseSelect v-model="form.role" label="Role" :clearable="true" required :options="[
                  { value: 'cashier', label: 'Kasir' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'owner', label: 'Owner' }
                ]" :error="roleError" />
              </div>

              <div>
                <BaseInput v-model="form.username" label="Username" class="w-full" required :error="usernameError" />
              </div>


              <div>
                <BaseInput v-model="form.password" label="Password" type="password" :error="passwordError"
                  class="w-full" required />
              </div>
              <div>
                <BaseInput v-model="form.password_confirmation" type="password" label="Konfirmasi Password"
                  class="w-full" :error="passwordConfirmationError" required />
              </div>



            </div>
            <div class="mt-4 py-4 border-t border-gray-50">

              <base-button type="submit" label="Simpan" :loading="storeForm.loading" class="ml-2"></base-button>
            </div>
          </form>



        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUsersFormStore } from '@/stores/settings/users/form'
import { useNotification } from '@/composables/useNotification'


const usernamePattern = /^[a-z0-9]+$/  // hanya huruf kecil dan angka
const usernameError = computed(() => {
  if (!form.value.username) return 'Username wajib diisi'
  if (!usernamePattern.test(form.value.username)) {
    return 'Username hanya boleh huruf kecil dan angka, tanpa spasi atau simbol'
  }
  return ''
})

const nameError = computed(() => {
  if (!form.value.name) return 'Nama wajib diisi'
  return ''
})
const roleError = computed(() => {
  if (!form.value.role) return 'Role wajib diisi'
  return ''
})
const passwordError = computed(() => {
  if (!form.value.password) return 'Password wajib diisi'
  if (form.value.password.length < 4) return 'Password minimal 4 karakter'
  return ''
})

const passwordConfirmationError = computed(() => {
  if (!form.value.password_confirmation) return 'Konfirmasi password wajib diisi'
  if (form.value.password !== form.value.password_confirmation) return 'Konfirmasi password tidak cocok'
  return ''
})

const hasError = computed(() => {
  return !!usernameError.value || !!passwordError.value || !!passwordConfirmationError.value || !!nameError.value || !!roleError.value  // tambah validasi lain jika ada
})

const storeForm = useUsersFormStore()
const emit = defineEmits(['close'])

const optionsRole = ref([
  'owner', 'admin', 'cashier'
])
// const kasList = computed(() => storeKas.items.sort((a, b) => a.id - b.id))

// const selectedKas = computed(() => {
//   return kasList.value.find(k => k.id === form.value.kas_id) || null
// })

// const kasirList = computed(() => storeUsers.items.filter(u => u.role === 'kasir'))

const form = ref({
  name: null,
  username: null,
  email: null,
  password: null,
  password_confirmation: null,
  role: 'cashier',
})

const { notify } = useNotification()


const submit = () => {



  // console.log('Kas flowa:', form.value)
  if (hasError.value) {
    console.warn('Ada error, tidak bisa simpan')
    notify({
      title: 'Gagal',
      message: 'Masih Ada Validasi Error, Cek Inputan Anda !',
      type: 'error'
    })
    alert('Masih Ada Validasi Error, Cek Inputan Anda !')
    return
  }

  // Kirim ke backend
  if (form.value.username.trim() !== '') {
    form.value.email = form.value.username + '@tokoyaumi47.my.id'
  }
  storeForm.simpanData(form.value)
}




const closeDialog = () => {
  storeForm.item = null
  emit('close')
}


</script>
