<script setup>
import { onMounted, computed } from 'vue'
import { useAksesMenuStore } from '@/stores/settings/akses'
const store = useAksesMenuStore()

onMounted(() => {
  Promise.all([
    store.fetchData()
  ])
})

// Contoh roles global
const roles = ['owner', 'admin', 'cashier']

const menus = computed({
  get: () => store.items,
  set: value => store.setItems(value)
})



// Mengecek apakah role diizinkan
const hasAccess = (permissionString, role) => {
  if (!permissionString) return false
  return permissionString.split(',').map(r => r.trim().toLowerCase()).includes(role)
}

// Parent Checkbox State
function isParentChecked(menu, role) {
  if (!menu.children?.length) return hasAccess(menu.permission, role)

  return menu.children.every(child => hasAccess(child.permission, role))
}

function isParentIndeterminate(menu, role) {
  if (!menu.children?.length) return false

  const total = menu.children.length
  const active = menu.children.filter(child => hasAccess(child.permission, role)).length

  return active > 0 && active < total
}

// Saat parent di-click
function toggleParentPermission(menu, role) {
  const normalizedRole = role.toLowerCase()

  const checked = isParentChecked(menu, role)
  const updatedChildren = menu.children?.map(child => {
    const perms = child.permission?.split(',').map(p => p.trim().toLowerCase()) || []
    const filtered = checked
      ? perms.filter(p => p !== normalizedRole)
      : [...new Set([...perms, normalizedRole])]
    child.permission = filtered.join(',')
    return child
  }) || []

  if (!menu.children?.length) {
    const perms = menu.permission?.split(',').map(p => p.trim().toLowerCase()) || []
    const filtered = checked
      ? perms.filter(p => p !== normalizedRole)
      : [...new Set([...perms, normalizedRole])]
    menu.permission = filtered.join(',')
  }
}


// Toggle permission per menu item
const togglePermission = (menuItem, role) => {
  const permissions = menuItem.permission ? menuItem.permission.split(',').map(r => r.trim()) : []
  const index = permissions.indexOf(role)

  if (index >= 0) {
    permissions.splice(index, 1)
  } else {
    permissions.push(role)
  }

  menuItem.permission = permissions.join(',')
}


// Simpan ke API
const saveChanges = () => {
  // console.log('Saving changes:', store.flattenedMenus);
  const payload = {
    menus: store.flattenedMenus.map(menu => ({
      id: menu.id,
      permission: menu.permission || ''
    }))
  }

  // console.log('payload', payload);
  store.saveDataPermissions(payload)

}
</script>

<template>
  <BasePage :title="store.header.title" :subtitle="store.header.subtitle">




    <div v-for="menu in menus" :key="menu.id" class="mb-8 border rounded-lg dark:border-gray-700 ">
      <!-- Parent Menu -->
      <div class="px-4 py-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
        <div class="text-lg font-medium text-gray-700 dark:text-gray-100">
          {{ menu.label }}
        </div>
        <div class="flex gap-3">
          <label v-for="role in roles" :key="role"
            class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <!-- <input type="checkbox" class="accent-blue-500 w-4 h-4" :value="role"
              :checked="hasAccess(menu.permission, role)" @change="togglePermission(menu, role)" /> -->

            <input type="checkbox" class="accent-blue-500 w-4 h-4" :checked="isParentChecked(menu, role)"
              :indeterminate.prop="isParentIndeterminate(menu, role)" @change="toggleParentPermission(menu, role)" />
            <span class="capitalize">{{ role }}</span>
          </label>
        </div>
      </div>

      <!-- Children -->
      <div v-if="menu.children?.length" class="divide-y dark:divide-gray-700">
        <div v-for="child in menu.children" :key="child.id"
          class="px-4 py-3 bg-white dark:bg-gray-900 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <div class="text-sm font-medium text-gray-800 dark:text-gray-200">
            {{ child.label }}
          </div>
          <div class="flex gap-3">
            <label v-for="role in roles" :key="role + child.id"
              class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <!-- <input type="checkbox" class="accent-blue-500 w-4 h-4" :value="role"
                :checked="hasAccess(child.permission, role)" @change="togglePermission(child, role)" /> -->
              <input type="checkbox" class="accent-blue-500 w-4 h-4" :checked="hasAccess(child.permission, role)"
                @change="togglePermission(child, role)" />
              <span class="capitalize">{{ role }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="text-right">
      <!-- <button @click="saveChanges"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all">
        💾 Simpan Perubahan
      </button> -->

      <base-button label="💾 Simpan Perubahan" color="primary" @click="saveChanges" :loading="store.loading" />
    </div>

  </BasePage>
</template>
